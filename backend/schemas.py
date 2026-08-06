from pydantic import BaseModel

class IncomingMessage(BaseModel):
    sender_phone: str
    sender_name: str = ""
    content: str

class ApproveRequest(BaseModel):
    approved: bool
    edited_reply: str | None = None