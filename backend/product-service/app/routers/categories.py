from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db
from app.core.redis_cache import cache
from app.models.product import Category

router = APIRouter(prefix="/categories", tags=["categories"])

class CategoryResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    image: Optional[str] = None
    productCount: int = 0

@router.get("", response_model=List[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    cache_key = "categories:all"
    cached = cache.get(cache_key)
    if cached:
        return cached

    categories = db.query(Category).all()
    result = [{
        "id": c.id, "name": c.name, "slug": c.slug,
        "description": c.description, "image": c.image, "productCount": c.product_count,
    } for c in categories]
    cache.set(cache_key, result, expire=600)
    return result

@router.post("", response_model=CategoryResponse)
def create_category(name: str, slug: str, description: str = None, db: Session = Depends(get_db)):
    db_category = Category(name=name, slug=slug, description=description)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    cache.delete("categories:all")
    return {"id": db_category.id, "name": db_category.name, "slug": db_category.slug,
            "description": db_category.description, "image": db_category.image, "productCount": 0}
