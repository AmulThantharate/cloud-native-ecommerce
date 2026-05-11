import uuid
import httpx
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel

from app.core.redis_client import cart_redis
from app.core.config import get_settings

router = APIRouter(prefix="/cart", tags=["cart"])
settings = get_settings()

class CartItem(BaseModel):
    productId: str
    quantity: int = 1
    options: Optional[dict] = None

class CartItemResponse(BaseModel):
    id: str
    productId: str
    name: str
    price: float
    image: str
    quantity: int
    total: float

class CartResponse(BaseModel):
    items: List[CartItemResponse]
    subtotal: float
    tax: float
    shipping: float
    total: float
    itemCount: int

async def get_product_details(product_id: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{settings.API_GATEWAY_URL}/products/{product_id}", timeout=5.0)
            if response.status_code == 200:
                return response.json()
    except Exception:
        pass
    return None

def calculate_cart_totals(items: list) -> dict:
    subtotal = sum(item["price"] * item["quantity"] for item in items)
    tax = subtotal * 0.08
    shipping = 0 if subtotal > 50 else 5.99
    total = subtotal + tax + shipping
    item_count = sum(item["quantity"] for item in items)
    return {
        "subtotal": round(subtotal, 2),
        "tax": round(tax, 2),
        "shipping": round(shipping, 2),
        "total": round(total, 2),
        "itemCount": item_count,
    }

@router.get("")
async def get_cart(x_user_id: str = Header(None)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="User ID required")

    cart = cart_redis.get_cart(x_user_id)
    items = cart.get("items", [])

    # Enrich with product details
    enriched_items = []
    for item in items:
        product = await get_product_details(item["productId"])
        if product:
            enriched_items.append({
                "id": item.get("id", str(uuid.uuid4())),
                "productId": item["productId"],
                "name": product.get("name", "Unknown"),
                "price": product.get("price", 0),
                "image": product.get("images", [""])[0] if product.get("images") else "",
                "quantity": item["quantity"],
                "total": round(product.get("price", 0) * item["quantity"], 2),
            })

    totals = calculate_cart_totals(enriched_items)
    return {
        "items": enriched_items,
        **totals,
    }

@router.post("/items")
async def add_item(item: CartItem, x_user_id: str = Header(None)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="User ID required")

    cart = cart_redis.get_cart(x_user_id)
    items = cart.get("items", [])

    # Check if item already exists
    existing = next((i for i in items if i["productId"] == item.productId), None)
    if existing:
        existing["quantity"] += item.quantity
    else:
        items.append({
            "id": str(uuid.uuid4()),
            "productId": item.productId,
            "quantity": item.quantity,
            "options": item.options or {},
        })

    cart_redis.set_cart(x_user_id, {"items": items})
    return await get_cart(x_user_id)

@router.put("/items/{item_id}")
async def update_item(item_id: str, quantity: int, x_user_id: str = Header(None)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="User ID required")

    cart = cart_redis.get_cart(x_user_id)
    items = cart.get("items", [])

    item = next((i for i in items if i.get("id") == item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if quantity <= 0:
        items.remove(item)
    else:
        item["quantity"] = quantity

    cart_redis.set_cart(x_user_id, {"items": items})
    return await get_cart(x_user_id)

@router.delete("/items/{item_id}")
async def remove_item(item_id: str, x_user_id: str = Header(None)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="User ID required")

    cart = cart_redis.get_cart(x_user_id)
    items = cart.get("items", [])
    items = [i for i in items if i.get("id") != item_id]

    cart_redis.set_cart(x_user_id, {"items": items})
    return await get_cart(x_user_id)

@router.delete("")
async def clear_cart(x_user_id: str = Header(None)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="User ID required")
    cart_redis.delete_cart(x_user_id)
    return {"message": "Cart cleared"}

@router.get("/checkout-preview")
async def checkout_preview(x_user_id: str = Header(None)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="User ID required")
    return await get_cart(x_user_id)
