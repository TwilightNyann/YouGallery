from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import ContactMessage
from schemas import ContactMessageCreate, ContactMessage as ContactMessageSchema

router = APIRouter()

@router.post("/", response_model=ContactMessageSchema)
def send_contact_message(
    message: ContactMessageCreate,
    db: Session = Depends(get_db)
):
    db_message = ContactMessage(
        name=message.name,
        email=message.email,
        message=message.message
    )
    
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # Here you could add email sending logic
    # send_email_notification(message)
    
    return db_message

@router.get("/", response_model=list[ContactMessageSchema])
def get_contact_messages(
    db: Session = Depends(get_db)
):
    # This endpoint could be protected with admin authentication
    messages = db.query(ContactMessage).order_by(
        ContactMessage.created_at.desc()
    ).all()
    
    return messages
