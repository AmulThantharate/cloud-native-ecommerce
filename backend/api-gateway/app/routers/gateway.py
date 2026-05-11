import httpx
from fastapi import APIRouter, Depends, HTTPException, Header, Request
from typing import Optional

from app.core.config import get_settings
from app.core.security import verify_token
from app.core.rate_limiter import rate_limiter

router = APIRouter()
settings = get_settings()

SERVICE_MAP = {
    "users": settings.USER_SERVICE_URL,
    "products": settings.PRODUCT_SERVICE_URL,
    "categories": settings.PRODUCT_SERVICE_URL,
    "inventory": settings.PRODUCT_SERVICE_URL,
    "cart": settings.CART_SERVICE_URL,
    "orders": settings.ORDER_SERVICE_URL,
    "payments": settings.PAYMENT_SERVICE_URL,
    "notifications": settings.NOTIFICATION_SERVICE_URL,
}

async def proxy_request(
    service: str,
    path: str,
    method: str,
    body: Optional[dict] = None,
    headers: Optional[dict] = None,
    params: Optional[dict] = None,
):
    base_url = SERVICE_MAP.get(service)
    if not base_url:
        raise HTTPException(status_code=404, detail=f"Service {service} not found")

    clean_path = path.strip("/")
    url = f"{base_url}/{clean_path}" if clean_path else base_url

    # Remove hop-by-hop headers that cause issues when proxied
    if headers:
        hop_headers = {"host", "transfer-encoding", "connection", "content-length"}
        headers = {k: v for k, v in headers.items() if k.lower() not in hop_headers}

    async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
        try:
            if method == "GET":
                response = await client.get(url, headers=headers, params=params)
            elif method == "POST":
                response = await client.post(url, json=body, headers=headers, params=params)
            elif method == "PUT":
                response = await client.put(url, json=body, headers=headers, params=params)
            elif method == "DELETE":
                response = await client.delete(url, headers=headers, params=params)
            else:
                raise HTTPException(status_code=405, detail="Method not allowed")

            if response.headers.get("content-type", "").startswith("application/json"):
                return response.json()
            return {"data": response.text}
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="Service timeout")
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Service error: {str(e)}")


async def _get_body(request: Request):
    """Safely extract JSON body from request."""
    if request.method in ("POST", "PUT", "PATCH"):
        try:
            return await request.json()
        except Exception:
            return None
    return None


# ── User routes ──────────────────────────────────────────────────────

@router.post("/users/signup")
async def signup(request: Request):
    rate_limiter.check(request.client.host)
    body = await _get_body(request)
    return await proxy_request("users", "users/signup", "POST", body, dict(request.headers), dict(request.query_params))

@router.post("/users/login")
async def login(request: Request):
    rate_limiter.check(request.client.host)
    body = await _get_body(request)
    return await proxy_request("users", "users/login", "POST", body, dict(request.headers), dict(request.query_params))

@router.api_route("/users", methods=["GET", "POST", "PUT", "DELETE"])
@router.api_route("/users/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def users_proxy(request: Request, path: str = ""):
    rate_limiter.check(request.client.host)
    body = await _get_body(request)
    target = f"users/{path}" if path else "users"
    return await proxy_request("users", target, request.method, body, dict(request.headers), dict(request.query_params))


# ── Product routes ───────────────────────────────────────────────────

@router.api_route("/products", methods=["GET", "POST"])
@router.api_route("/products/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def products_proxy(request: Request, path: str = ""):
    rate_limiter.check(request.client.host)
    body = await _get_body(request)
    target = f"products/{path}" if path else "products"
    return await proxy_request("products", target, request.method, body, dict(request.headers), dict(request.query_params))

@router.api_route("/categories", methods=["GET", "POST"])
@router.api_route("/categories/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def categories_proxy(request: Request, path: str = ""):
    rate_limiter.check(request.client.host)
    body = await _get_body(request)
    target = f"categories/{path}" if path else "categories"
    return await proxy_request("categories", target, request.method, body, dict(request.headers), dict(request.query_params))

@router.api_route("/inventory", methods=["GET"])
@router.api_route("/inventory/{path:path}", methods=["GET", "PUT"])
async def inventory_proxy(request: Request, path: str = ""):
    rate_limiter.check(request.client.host)
    body = await _get_body(request)
    target = f"inventory/{path}" if path else "inventory"
    return await proxy_request("inventory", target, request.method, body, dict(request.headers), dict(request.query_params))


# ── Cart routes (require auth) ───────────────────────────────────────

@router.api_route("/cart", methods=["GET", "POST", "DELETE"])
@router.api_route("/cart/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def cart_proxy(request: Request, path: str = "", user_id: str = Depends(verify_token)):
    rate_limiter.check(request.client.host)
    headers = dict(request.headers)
    headers["X-User-ID"] = user_id
    body = await _get_body(request)
    target = f"cart/{path}" if path else "cart"
    return await proxy_request("cart", target, request.method, body, headers, dict(request.query_params))


# ── Order routes (require auth) ──────────────────────────────────────

@router.api_route("/orders", methods=["GET", "POST"])
@router.api_route("/orders/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def orders_proxy(request: Request, path: str = "", user_id: str = Depends(verify_token)):
    rate_limiter.check(request.client.host)
    headers = dict(request.headers)
    headers["X-User-ID"] = user_id
    body = await _get_body(request)
    target = f"orders/{path}" if path else "orders"
    return await proxy_request("orders", target, request.method, body, headers, dict(request.query_params))


# ── Payment routes (require auth) ────────────────────────────────────

@router.api_route("/payments", methods=["GET", "POST"])
@router.api_route("/payments/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def payments_proxy(request: Request, path: str = "", user_id: str = Depends(verify_token)):
    rate_limiter.check(request.client.host)
    headers = dict(request.headers)
    headers["X-User-ID"] = user_id
    body = await _get_body(request)
    target = f"payments/{path}" if path else "payments"
    return await proxy_request("payments", target, request.method, body, headers, dict(request.query_params))


# ── Notification routes ──────────────────────────────────────────────

@router.api_route("/notifications", methods=["GET", "POST"])
@router.api_route("/notifications/{path:path}", methods=["GET", "POST"])
async def notifications_proxy(request: Request, path: str = ""):
    rate_limiter.check(request.client.host)
    body = await _get_body(request)
    target = f"notifications/{path}" if path else "notifications"
    return await proxy_request("notifications", target, request.method, body, dict(request.headers), dict(request.query_params))
