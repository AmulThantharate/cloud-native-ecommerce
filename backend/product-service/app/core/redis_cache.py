import json
import redis
from .config import get_settings

settings = get_settings()
redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)

class RedisCache:
    @staticmethod
    def get(key: str):
        data = redis_client.get(key)
        return json.loads(data) if data else None

    @staticmethod
    def set(key: str, value, expire: int = 300):
        redis_client.setex(key, expire, json.dumps(value, default=str))

    @staticmethod
    def delete(key: str):
        redis_client.delete(key)

    @staticmethod
    def delete_pattern(pattern: str):
        for key in redis_client.scan_iter(match=pattern):
            redis_client.delete(key)

cache = RedisCache()
