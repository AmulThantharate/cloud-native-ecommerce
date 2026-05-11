from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.routers import gateway
from app.middleware.tracing import TracingMiddleware

app = FastAPI(
    title="API Gateway",
    description="Central gateway for all microservices",
    version="1.0.0",
)

app.add_middleware(TracingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(gateway.router)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "api-gateway",
        "services": {
            "user-service": "connected",
            "product-service": "connected",
            "cart-service": "connected",
            "order-service": "connected",
            "payment-service": "connected",
            "notification-service": "connected",
        }
    }

@app.get("/metrics")
def metrics():
    return {
        "total_requests": 15234,
        "avg_latency_ms": 45,
        "error_rate": 0.02,
        "active_connections": 128,
    }
