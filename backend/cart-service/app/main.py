from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import cart

app = FastAPI(
    title="Cart Service",
    description="Shopping cart management with Redis persistence",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cart.router)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "cart-service"}
