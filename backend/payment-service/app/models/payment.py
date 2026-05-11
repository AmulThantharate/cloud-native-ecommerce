import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Text
from app.core.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String(36), nullable=False, index=True)
    user_id = Column(String(36), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    status = Column(String(20), default="pending")  # pending, succeeded, failed, refunded
    stripe_payment_intent_id = Column(String(100))
    stripe_charge_id = Column(String(100))
    failure_message = Column(Text)
    retry_count = Column(String(10), default="0")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
