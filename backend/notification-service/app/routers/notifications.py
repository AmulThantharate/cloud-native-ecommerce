from typing import List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from app.core.messaging import consumer

router = APIRouter(prefix="/notifications", tags=["notifications"])

class EmailRequest(BaseModel):
    to: EmailStr
    subject: str
    body: str

class SMSRequest(BaseModel):
    to: str
    message: str

@router.post("/email")
def send_email(request: EmailRequest):
    # Mock email sending
    print(f"[Email] To: {request.to}, Subject: {request.subject}")
    return {"message": "Email queued for delivery", "to": request.to}

@router.post("/sms")
def send_sms(request: SMSRequest):
    # Mock SMS sending
    print(f"[SMS] To: {request.to}, Message: {request.message}")
    return {"message": "SMS queued for delivery", "to": request.to}

@router.get("/health")
def notification_health():
    return {"status": "healthy", "service": "notification-service", "consumer": "running"}

@router.post("/start-consumer")
def start_consumer():
    consumer.start()
    return {"message": "Notification consumer started"}
