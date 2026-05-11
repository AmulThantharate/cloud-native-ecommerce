import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, Text
from app.core.database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=False, index=True)
    status = Column(String(20), default="pending")  # pending, processing, shipped, delivered, cancelled
    payment_status = Column(String(20), default="pending")  # pending, paid, failed, refunded
    shipping_address = Column(Text, default="{}")  # JSON
    billing_address = Column(Text, default="{}")  # JSON
    items = Column(Text, default="[]")  # JSON array of items
    subtotal = Column(Float, default=0.0)
    tax = Column(Float, default=0.0)
    shipping = Column(Float, default=0.0)
    total = Column(Float, default=0.0)
    tracking_number = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
