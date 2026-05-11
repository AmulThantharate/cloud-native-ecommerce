import time
from collections import defaultdict
from fastapi import HTTPException

class RateLimiter:
    def __init__(self, max_requests: int = 100, window: int = 60):
        self.max_requests = max_requests
        self.window = window
        self.requests = defaultdict(list)

    def is_allowed(self, client_id: str) -> bool:
        now = time.time()
        client_requests = self.requests[client_id]

        # Remove old requests
        client_requests[:] = [req for req in client_requests if now - req < self.window]

        if len(client_requests) >= self.max_requests:
            return False

        client_requests.append(now)
        return True

    def check(self, client_id: str):
        if not self.is_allowed(client_id):
            raise HTTPException(status_code=429, detail="Rate limit exceeded")

rate_limiter = RateLimiter(max_requests=1000, window=60)
