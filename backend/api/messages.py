from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime

from database import get_db, Message, Conversation
from schemas import IncomingMessage, ApproveRequest
from services.agent import classify_priority, generate_reply

router = APIRouter(prefix="/api")

@router.post("/webhook/message")
def receive_message(msg: IncomingMessage, db: Session = Depends(get_db)):
    priority = classify_priority(msg.content)
    ai_reply = generate_reply(msg.content, priority)
    
    db_msg = Message(
        sender_phone=msg.sender_phone,
        sender_name=msg.sender_name or "Unknown",
        content=msg.content,
        priority=priority,
        ai_reply=ai_reply
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
        "status": "pending_approval"
    }

@router.get("/messages")
def list_messages(priority: str = None, status: str = None, db: Session = Depends(get_db)):
    query = db.query(Message)
    if priority:
        query = query.filter(Message.priority == priority.upper())
    if status:
        query = query.filter(Message.status == status)
    results = query.order_by(Message.created_at.desc()).all()
    return [{
        "id": r.id,
        "sender_phone": r.sender_phone,
        "sender_name": r.sender_name,
        "content": r.content,
        "priority": r.priority,
        "status": r.status,
        "ai_reply": r.ai_reply,
        "created_at": r.created_at.isoformat() if r.created_at else None,
        "replied_at": r.replied_at.isoformat() if r.replied_at else None
    } for r in results]

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

@router.get("/messages/{msg_id}/conversation")
def get_conversation(msg_id: int, db: Session = Depends(get_db)):
    results = db.query(Conversation).filter(Conversation.message_id == msg_id).order_by(Conversation.created_at).all()
    return [{
        "id": r.id,
        "message_id": r.message_id,
        "role": r.role,
        "content": r.content,
        "created_at": r.created_at.isoformat() if r.created_at else None
    } for r in results]

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