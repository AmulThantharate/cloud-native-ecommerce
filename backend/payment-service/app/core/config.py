from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    APP_NAME: str = "payment-service"
    DATABASE_URL: str = "postgresql://postgres:postgres@postgres:5432/payments_db"
    STRIPE_SECRET_KEY: str = "sk_test_..."  # Replace with real key
    STRIPE_WEBHOOK_SECRET: str = "whsec_..."
    API_GATEWAY_URL: str = "http://api-gateway:8000"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
