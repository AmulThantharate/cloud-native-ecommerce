from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.database import engine, Base
from app.routers import products, categories, inventory

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="Product Service",
    description="Product catalog and inventory management microservice",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(categories.router)
app.include_router(inventory.router)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "product-service"}

@app.get("/chaos/cpu")
def chaos_cpu():
    import math
    for _ in range(1000000):
        math.sqrt(12345)
    return {"message": "CPU intensive task completed"}

@app.get("/chaos/memory")
def chaos_memory():
    data = []
    for i in range(100000):
        data.append("x" * 1000)
    return {"message": "Memory allocated", "size": len(data)}
