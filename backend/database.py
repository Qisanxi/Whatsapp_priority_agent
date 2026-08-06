from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from config import DATABASE_URL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    sender_phone = Column(String(50))
    sender_name = Column(String(100))
    content = Column(Text)
    priority = Column(String(20))
    status = Column(String(20), default="pending")
    ai_reply = Column(Text)
    created_at = Column(DateTime, default=datetime.now)
    replied_at = Column(DateTime)

class Conversation(Base):
    __tablename__ = "conversations"
    id = Column(Integer, primary_key=True, index=True)
    message_id = Column(Integer)
    role = Column(String(20))
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.now)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()