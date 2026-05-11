from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.database import engine, Base
from app.routers import users

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="User Service",
    description="Authentication and user management microservice",
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

app.include_router(users.router)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "user-service"}

@app.get("/chaos/delay")
def chaos_delay():
    import time
    time.sleep(5)
    return {"message": "Delayed response"}

@app.get("/chaos/error")
def chaos_error():
    from fastapi import HTTPException
    raise HTTPException(status_code=500, detail="Simulated error")
