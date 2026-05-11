import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db
from app.core.redis_cache import cache
from app.models.product import Product, Category

router = APIRouter(prefix="/products", tags=["products"])

# Schemas
class CategoryResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    image: Optional[str] = None
    productCount: Optional[int] = None

class ProductResponse(BaseModel):
    id: str
    name: str
    description: str
    price: float
    originalPrice: Optional[float] = None
    images: List[str]
    category: CategoryResponse
    tags: List[str]
    rating: float
    reviewCount: int
    stock: int
    sku: str
    features: List[str]
    specifications: dict
    isNew: bool = False
    isBestseller: bool = False
    isFeatured: bool = False

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    originalPrice: Optional[float] = None
    stock: int = 0
    sku: str
    categoryId: str
    images: List[str] = []
    tags: List[str] = []
    features: List[str] = []
    specifications: dict = {}
    isNew: bool = False
    isBestseller: bool = False
    isFeatured: bool = False

def product_to_dict(product: Product) -> dict:
    return {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "originalPrice": product.original_price,
        "images": json.loads(product.images) if product.images else [],
        "category": {
            "id": product.category.id,
            "name": product.category.name,
            "slug": product.category.slug,
            "description": product.category.description,
            "image": product.category.image,
            "productCount": product.category.product_count,
        } if product.category else None,
        "tags": json.loads(product.tags) if product.tags else [],
        "rating": product.rating,
        "reviewCount": product.review_count,
        "stock": product.stock,
        "sku": product.sku,
        "features": json.loads(product.features) if product.features else [],
        "specifications": json.loads(product.specifications) if product.specifications else {},
        "isNew": product.is_new,
        "isBestseller": product.is_bestseller,
        "isFeatured": product.is_featured,
    }

@router.get("", response_model=dict)
def list_products(
    q: Optional[str] = None,
    category: Optional[str] = None,
    featured: bool = False,
    trending: bool = False,
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    cache_key = f"products:{q}:{category}:{featured}:{trending}:{limit}:{skip}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    query = db.query(Product)

    if q:
        query = query.filter(Product.name.ilike(f"%{q}%"))
    if category:
        query = query.filter(Product.category_id == category)
    if featured:
        query = query.filter(Product.is_featured == True)
    if trending:
        query = query.filter(Product.is_bestseller == True)

    total = query.count()
    products = query.offset(skip).limit(limit).all()

    result = {
        "products": [product_to_dict(p) for p in products],
        "total": total,
        "skip": skip,
        "limit": limit,
    }

    cache.set(cache_key, result, expire=300)
    return result

@router.get("/search")
def search_products(q: str, db: Session = Depends(get_db)):
    cache_key = f"search:{q}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    products = db.query(Product).filter(
        Product.name.ilike(f"%{q}%") | Product.description.ilike(f"%{q}%")
    ).limit(10).all()

    result = {"products": [product_to_dict(p) for p in products], "query": q}
    cache.set(cache_key, result, expire=180)
    return result

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: str, db: Session = Depends(get_db)):
    cache_key = f"product:{product_id}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    result = product_to_dict(product)
    cache.set(cache_key, result, expire=600)
    return result

@router.post("", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(
        name=product.name,
        description=product.description,
        price=product.price,
        original_price=product.originalPrice,
        stock=product.stock,
        sku=product.sku,
        category_id=product.categoryId,
        images=json.dumps(product.images),
        tags=json.dumps(product.tags),
        features=json.dumps(product.features),
        specifications=json.dumps(product.specifications),
        is_new=product.isNew,
        is_bestseller=product.isBestseller,
        is_featured=product.isFeatured,
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    cache.delete_pattern("products:*")
    return product_to_dict(db_product)

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: str, product: ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    for key, value in product.dict().items():
        if value is not None:
            if key in ["images", "tags", "features", "specifications"]:
                setattr(db_product, key, json.dumps(value))
            else:
                setattr(db_product, key, value)

    db.commit()
    db.refresh(db_product)
    cache.delete(f"product:{product_id}")
    cache.delete_pattern("products:*")
    return product_to_dict(db_product)

@router.delete("/{product_id}")
def delete_product(product_id: str, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    cache.delete(f"product:{product_id}")
    cache.delete_pattern("products:*")
    return {"message": "Product deleted"}
