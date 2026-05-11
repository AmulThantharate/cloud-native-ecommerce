from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    APP_NAME: str = "order-service"
    DATABASE_URL: str = "postgresql://postgres:postgres@postgres:5432/orders_db"
    REDIS_URL: str = "redis://redis:6379/3"
    RABBITMQ_URL: str = "amqp://guest:guest@rabbitmq:5672/"
    API_GATEWAY_URL: str = "http://api-gateway:8000"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
