import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Header, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db
from app.core.config import get_settings
from app.models.payment import Payment

settings = get_settings()

router = APIRouter(prefix="/payments", tags=["payments"])

class PaymentIntent(BaseModel):
    orderId: str
    amount: float
    currency: str = "USD"

class PaymentResponse(BaseModel):
    id: str
    orderId: str
    status: str
    amount: float
    clientSecret: Optional[str] = None

@router.post("/intent")
def create_payment_intent(
    intent: PaymentIntent,
    x_user_id: str = Header(None),
    db: Session = Depends(get_db)
):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="User ID required")

    payment_id = str(uuid.uuid4())

    db_payment = Payment(
        id=payment_id,
        order_id=intent.orderId,
        user_id=x_user_id,
        amount=intent.amount,
        currency=intent.currency,
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)

    return {
        "id": db_payment.id,
        "orderId": db_payment.order_id,
        "status": db_payment.status,
        "amount": db_payment.amount,
        "clientSecret": f"mock_secret_{payment_id}",
    }

@router.post("/{payment_id}/confirm")
def confirm_payment(
    payment_id: str,
    x_user_id: str = Header(None),
    db: Session = Depends(get_db)
):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="User ID required")

    payment = db.query(Payment).filter(Payment.id == payment_id, Payment.user_id == x_user_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    payment.status = "succeeded"
    db.commit()

    return {
        "id": payment.id,
        "orderId": payment.order_id,
        "status": payment.status,
        "amount": payment.amount,
    }

@router.post("/{payment_id}/refund")
def refund_payment(
    payment_id: str,
    x_user_id: str = Header(None),
    db: Session = Depends(get_db)
):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="User ID required")

    payment = db.query(Payment).filter(Payment.id == payment_id, Payment.user_id == x_user_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    if payment.status != "succeeded":
        raise HTTPException(status_code=400, detail="Payment not eligible for refund")

    payment.status = "refunded"
    db.commit()

    return {
        "id": payment.id,
        "orderId": payment.order_id,
        "status": payment.status,
        "amount": payment.amount,
    }

@router.get("/{payment_id}")
def get_payment(payment_id: str, x_user_id: str = Header(None), db: Session = Depends(get_db)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="User ID required")

    payment = db.query(Payment).filter(Payment.id == payment_id, Payment.user_id == x_user_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    return {
        "id": payment.id,
        "orderId": payment.order_id,
        "status": payment.status,
        "amount": payment.amount,
        "currency": payment.currency,
        "createdAt": payment.created_at.isoformat() if payment.created_at else None,
    }

@router.post("/webhook")
async def payment_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle payment provider webhook events"""
    payload = await request.body()
    return {"received": True}
