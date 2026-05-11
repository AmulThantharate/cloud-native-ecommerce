import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    image = Column(String(500))
    product_count = Column(Integer, default=0)

    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    original_price = Column(Float)
    stock = Column(Integer, default=0)
    sku = Column(String(100), unique=True, nullable=False)
    images = Column(Text, default="[]")  # JSON array
    tags = Column(Text, default="[]")  # JSON array
    features = Column(Text, default="[]")  # JSON array
    specifications = Column(Text, default="{}")  # JSON object
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    is_new = Column(Boolean, default=False)
    is_bestseller = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    category_id = Column(String(36), ForeignKey("categories.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    category = relationship("Category", back_populates="products")
