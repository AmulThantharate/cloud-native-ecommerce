from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db
from app.core.redis_cache import cache
from app.models.product import Product

router = APIRouter(prefix="/inventory", tags=["inventory"])

class InventoryUpdate(BaseModel):
    stock: int

@router.get("/{product_id}")
def get_inventory(product_id: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"productId": product_id, "stock": product.stock, "sku": product.sku}

@router.put("/{product_id}")
def update_inventory(product_id: str, update: InventoryUpdate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.stock = update.stock
    db.commit()
    cache.delete(f"product:{product_id}")
    return {"productId": product_id, "stock": product.stock, "message": "Inventory updated"}
