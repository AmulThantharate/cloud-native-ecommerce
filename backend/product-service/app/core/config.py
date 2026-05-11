from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    APP_NAME: str = "product-service"
    DEBUG: bool = False
    DATABASE_URL: str = "postgresql://postgres:postgres@postgres:5432/products_db"
    REDIS_URL: str = "redis://redis:6379/1"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
