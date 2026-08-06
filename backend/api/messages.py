from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime

from database import get_db, Message, Conversation
from schemas import IncomingMessage, ApproveRequest
from services.agent import classify_priority, generate_reply

router = APIRouter(prefix="/api")

# ─── WEBHOOK ───
@router.post("/webhook/message")
def receive_message(msg: IncomingMessage, db: Session = Depends(get_db)):
    priority = classify_priority(msg.content)
    ai_reply = generate_reply(msg.content, priority)
    
    auto_reply = priority in ["URGENT", "HIGH"]
    
    db_msg = Message(
        sender_phone=msg.sender_phone,
        sender_name=msg.sender_name or "Unknown",
        content=msg.content,
        priority=priority,
        ai_reply=ai_reply,
        status="replied" if auto_reply else "pending"
    )
    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)
    
    db.add(Conversation(message_id=db_msg.id, role="user", content=msg.content))
    db.add(Conversation(message_id=db_msg.id, role="assistant", content=ai_reply))
    db.commit()
    
    return {
        "id": db_msg.id,
        "priority": priority,
        "ai_reply": ai_reply,
        "status": "replied" if auto_reply else "pending_approval",
        "auto_replied": auto_reply
    }

# ─── INBOX (Grouped by Phone) ───
@router.get("/inbox")
def inbox(db: Session = Depends(get_db)):
    subquery = db.query(
        Message.sender_phone,
        func.max(Message.created_at).label('latest_time')
    ).group_by(Message.sender_phone).subquery()
    
    results = db.query(Message).join(
        subquery,
        (Message.sender_phone == subquery.c.sender_phone) & 
        (Message.created_at == subquery.c.latest_time)
    ).order_by(Message.created_at.desc()).all()
    
    return [{
        "sender_phone": r.sender_phone,
        "sender_name": r.sender_name,
        "last_message": r.content,
        "last_priority": r.priority,
        "last_status": r.status,
        "unread_count": db.query(Message).filter(
            Message.sender_phone == r.sender_phone,
            Message.status == "pending"
        ).count(),
        "updated_at": r.created_at.isoformat()
    } for r in results]

# ─── CONVERSATION THREAD (All messages for one phone) ───
@router.get("/conversations/{phone}")
def get_conversation_by_phone(phone: str, db: Session = Depends(get_db)):
    results = db.query(Message).filter(Message.sender_phone == phone).order_by(Message.created_at.asc()).all()
    return [{
        "id": r.id,
        "content": r.content,
        "priority": r.priority,
        "status": r.status,
        "ai_reply": r.ai_reply,
        "created_at": r.created_at.isoformat()
    } for r in results]

# ─── APPROVE / REJECT ───
@router.post("/messages/{msg_id}/approve")
def approve_message(msg_id: int, req: ApproveRequest, db: Session = Depends(get_db)):
    msg = db.query(Message).filter(Message.id == msg_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    
    if req.approved:
        msg.status = "replied"
        msg.replied_at = datetime.now()
        if req.edited_reply:
            msg.ai_reply = req.edited_reply
    else:
        msg.status = "rejected"
    
    db.commit()
    return {"status": "success", "message_id": msg_id, "new_status": msg.status}

# ─── DASHBOARD STATS ───
@router.get("/dashboard/stats")
def dashboard_stats(db: Session = Depends(get_db)):
    total = db.query(Message).count()
    pending = db.query(Message).filter(Message.status == "pending").count()
    dist = db.query(Message.priority, func.count(Message.id)).group_by(Message.priority).all()
    return {
        "total_messages": total,
        "pending_approval": pending,
        "priority_distribution": {p: c for p, c in dist}
    }