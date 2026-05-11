"""
🧪 NexStore — Integration Test Suite
End-to-end tests that verify service interactions through the API Gateway.
"""

import requests
import sys
import time

API_BASE = "http://localhost:8000"
FRONTEND_BASE = "http://localhost:3000"

passed = 0
failed = 0
total = 0


def test(name: str, condition: bool, detail: str = ""):
    """Simple test assertion helper."""
    global passed, failed, total
    total += 1
    if condition:
        passed += 1
        print(f"  ✅ {name}")
    else:
        failed += 1
        print(f"  ❌ {name} — {detail}")


def section(title: str):
    print(f"\n{title}")


# ── Health Checks ─────────────────────────────────────────
section("💓 HEALTH CHECKS")
for port, name in [(8000, "api-gateway"), (8001, "user-service"), (8002, "product-service"),
                    (8003, "cart-service"), (8004, "order-service"), (8005, "payment-service"),
                    (8006, "notification-service")]:
    try:
        r = requests.get(f"http://localhost:{port}/health", timeout=5)
        test(f"{name} :{port}", r.status_code == 200, f"status={r.status_code}")
    except Exception as e:
        test(f"{name} :{port}", False, str(e))

# ── Product Tests ─────────────────────────────────────────
section("📦 PRODUCT TESTS")
try:
    r = requests.get(f"{API_BASE}/products", params={"limit": 50}, timeout=5)
    data = r.json()
    test(f"GET /products: {data.get('total', 0)} products", r.status_code == 200 and data.get("total", 0) > 0)

    r2 = requests.get(f"{API_BASE}/products", params={"featured": "true"}, timeout=5)
    d2 = r2.json()
    test(f"GET /products?featured=true: {d2.get('total', 0)} featured", r2.status_code == 200)

    r3 = requests.get(f"{API_BASE}/products", params={"q": "headphones"}, timeout=5)
    d3 = r3.json()
    test(f"GET /products?q=headphones: {d3.get('total', 0)} results", d3.get("total", 0) >= 1)

    if data.get("products"):
        pid = data["products"][0]["id"]
        r4 = requests.get(f"{API_BASE}/products/{pid}", timeout=5)
        test(f"GET /products/{{id}}: {r4.json().get('name', '?')}", r4.status_code == 200)
except Exception as e:
    test("Product tests", False, str(e))

# ── Category Tests ────────────────────────────────────────
section("📂 CATEGORY TESTS")
try:
    r = requests.get(f"{API_BASE}/categories", timeout=5)
    cats = r.json()
    test(f"GET /categories: {len(cats)} categories", r.status_code == 200 and len(cats) > 0)
except Exception as e:
    test("Category tests", False, str(e))

# ── Search Tests ──────────────────────────────────────────
section("🔍 SEARCH TESTS")
for query in ["yoga", "shoes", "lamp"]:
    try:
        r = requests.get(f"{API_BASE}/products", params={"q": query}, timeout=5)
        d = r.json()
        test(f"GET /products?q={query}: {d.get('total', 0)} results", r.status_code == 200)
    except Exception as e:
        test(f"Search '{query}'", False, str(e))

# ── Auth Tests ────────────────────────────────────────────
section("🔐 AUTH TESTS")
test_email = f"test_{int(time.time())}@e2e.test"
try:
    r = requests.post(f"{API_BASE}/users/signup", json={
        "email": test_email, "password": "Test123!", "firstName": "E2E", "lastName": "Test"
    }, timeout=5)
    test(f"POST /users/signup ({test_email})", r.status_code in [200, 201])

    r2 = requests.post(f"{API_BASE}/users/login", json={"email": test_email, "password": "Test123!"}, timeout=5)
    token_data = r2.json()
    test("POST /users/login", r2.status_code == 200 and "access_token" in token_data)

    token = token_data.get("access_token", "")
    r3 = requests.get(f"{API_BASE}/users/profile", headers={"Authorization": f"Bearer {token}"}, timeout=5)
    test("GET /users/profile", r3.status_code == 200)
except Exception as e:
    test("Auth tests", False, str(e))

# ── Cart Tests ────────────────────────────────────────────
section("🛒 CART TESTS")
try:
    headers = {"x-user-id": "e2e-test-user"}
    r = requests.get(f"{API_BASE}/cart", headers=headers, timeout=5)
    test("GET /cart", r.status_code == 200)

    r2 = requests.post(f"{API_BASE}/cart/items", headers=headers, json={
        "productId": "test-product", "name": "Test Product", "price": 9.99, "quantity": 1
    }, timeout=5)
    test("POST /cart/items", r2.status_code in [200, 201])
except Exception as e:
    test("Cart tests", False, str(e))

# ── Frontend Tests ────────────────────────────────────────
section("🌐 FRONTEND PROXY TESTS")
for path in ["/api/products", "/api/categories"]:
    try:
        r = requests.get(f"{FRONTEND_BASE}{path}", timeout=5)
        test(f"GET {path} (via frontend)", r.status_code == 200)
    except Exception as e:
        test(f"GET {path}", False, str(e))

# ── Summary ───────────────────────────────────────────────
print(f"\n{'='*50}")
print(f"📊 Results: {passed}/{total} passed, {failed} failed")
print(f"{'='*50}")
sys.exit(0 if failed == 0 else 1)
