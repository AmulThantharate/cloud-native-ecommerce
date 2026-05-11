from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    APP_NAME: str = "notification-service"
    RABBITMQ_URL: str = "amqp://guest:guest@rabbitmq:5672/"
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
