from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.routers import notifications
from app.core.messaging import consumer

@asynccontextmanager
async def lifespan(app: FastAPI):
    consumer.start()
    yield
    consumer.stop()

app = FastAPI(
    title="Notification Service",
    description="Email, SMS, and event-driven notifications",
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

app.include_router(notifications.router)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "notification-service"}
