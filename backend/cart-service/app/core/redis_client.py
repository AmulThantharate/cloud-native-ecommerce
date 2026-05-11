import json
import redis
from .config import get_settings

settings = get_settings()
redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)

CART_PREFIX = "cart:"
CART_TTL = 7 * 24 * 3600  # 7 days

class CartRedis:
    @staticmethod
    def get_cart(user_id: str):
        data = redis_client.get(f"{CART_PREFIX}{user_id}")
        return json.loads(data) if data else {"items": []}

    @staticmethod
    def set_cart(user_id: str, cart: dict):
        redis_client.setex(f"{CART_PREFIX}{user_id}", CART_TTL, json.dumps(cart))

    @staticmethod
    def delete_cart(user_id: str):
        redis_client.delete(f"{CART_PREFIX}{user_id}")

    @staticmethod
    def get_cart_ttl(user_id: str):
        return redis_client.ttl(f"{CART_PREFIX}{user_id}")

cart_redis = CartRedis()
