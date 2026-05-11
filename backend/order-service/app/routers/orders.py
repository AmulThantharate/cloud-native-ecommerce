import json
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db
from app.core.messaging import publisher
from app.models.order import Order

router = APIRouter(prefix="/orders", tags=["orders"])

class OrderItem(BaseModel):
    productId: str
    name: str
    price: float
    quantity: int

class OrderCreate(BaseModel):
    items: List[OrderItem]
    shippingAddress: dict
    billingAddress: dict
    subtotal: float
    tax: float
    shipping: float
    total: float

class OrderResponse(BaseModel):
    id: str
    userId: str
    status: str
    paymentStatus: str
    total: float
    trackingNumber: Optional[str] = None
    createdAt: str

@router.post("", response_model=OrderResponse)
def create_order(
    order_data: OrderCreate,
    x_user_id: str = Header(None),
    db: Session = Depends(get_db)
):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="User ID required")

    order_id = str(uuid.uuid4())
    db_order = Order(
        id=order_id,
        user_id=x_user_id,
        items=json.dumps([item.dict() for item in order_data.items]),
        shipping_address=json.dumps(order_data.shippingAddress),
        billing_address=json.dumps(order_data.billingAddress),
        subtotal=order_data.subtotal,
        tax=order_data.tax,
        shipping=order_data.shipping,
        total=order_data.total,
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # Publish event
    publisher.publish(
        "order.created",
        {
            "orderId": order_id,
            "userId": x_user_id,
            "total": order_data.total,
            "items": [item.dict() for item in order_data.items],
        }
    )

    return {
        "id": db_order.id,
        "userId": db_order.user_id,
        "status": db_order.status,
        "paymentStatus": db_order.payment_status,
        "total": db_order.total,
        "trackingNumber": db_order.tracking_number,
        "createdAt": db_order.created_at.isoformat() if db_order.created_at else None,
    }

@router.get("", response_model=List[OrderResponse])
def list_orders(
    x_user_id: str = Header(None),
    db: Session = Depends(get_db)
):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="User ID required")

    orders = db.query(Order).filter(Order.user_id == x_user_id).order_by(Order.created_at.desc()).all()
    return [{
        "id": o.id, "userId": o.user_id, "status": o.status,
        "paymentStatus": o.payment_status, "total": o.total,
        "trackingNumber": o.tracking_number,
        "createdAt": o.created_at.isoformat() if o.created_at else None,
    } for o in orders]

@router.get("/{order_id}")
def get_order(order_id: str, x_user_id: str = Header(None), db: Session = Depends(get_db)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="User ID required")

    order = db.query(Order).filter(Order.id == order_id, Order.user_id == x_user_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return {
        "id": order.id,
        "userId": order.user_id,
        "status": order.status,
        "paymentStatus": order.payment_status,
        "items": json.loads(order.items) if order.items else [],
        "shippingAddress": json.loads(order.shipping_address) if order.shipping_address else {},
        "billingAddress": json.loads(order.billing_address) if order.billing_address else {},
        "subtotal": order.subtotal,
        "tax": order.tax,
        "shipping": order.shipping,
        "total": order.total,
        "trackingNumber": order.tracking_number,
        "createdAt": order.created_at.isoformat() if order.created_at else None,
        "updatedAt": order.updated_at.isoformat() if order.updated_at else None,
    }

@router.get("/{order_id}/track")
def track_order(order_id: str, x_user_id: str = Header(None), db: Session = Depends(get_db)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="User ID required")

    order = db.query(Order).filter(Order.id == order_id, Order.user_id == x_user_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Mock tracking events
    events = []
    if order.status in ["shipped", "delivered"]:
        events.append({"status": "shipped", "location": "Distribution Center", "timestamp": "2024-01-15T10:00:00Z"})
    if order.status == "delivered":
        events.append({"status": "delivered", "location": "Customer Address", "timestamp": "2024-01-16T14:30:00Z"})

    return {
        "orderId": order_id,
        "status": order.status,
        "trackingNumber": order.tracking_number,
        "carrier": "FedEx",
        "events": events,
    }

@router.put("/{order_id}/status")
def update_status(
    order_id: str,
    status: str,
    x_user_id: str = Header(None),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = status
    db.commit()

    publisher.publish(
        "order.updated",
        {"orderId": order_id, "status": status, "userId": order.user_id}
    )

    return {"message": "Status updated", "status": status}
