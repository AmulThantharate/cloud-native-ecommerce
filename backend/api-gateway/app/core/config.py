from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    APP_NAME: str = "api-gateway"
    DEBUG: bool = False

    # Service URLs
    USER_SERVICE_URL: str = "http://user-service:8000"
    PRODUCT_SERVICE_URL: str = "http://product-service:8000"
    CART_SERVICE_URL: str = "http://cart-service:8000"
    ORDER_SERVICE_URL: str = "http://order-service:8000"
    PAYMENT_SERVICE_URL: str = "http://payment-service:8000"
    NOTIFICATION_SERVICE_URL: str = "http://notification-service:8000"

    # JWT
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 100

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
