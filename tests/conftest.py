"""
🧪 NexStore — Test Fixtures & Utilities
Shared test helpers used across all service test suites.
"""

import os
import pytest
from unittest.mock import MagicMock


# ── Environment ───────────────────────────────────────────
@pytest.fixture(autouse=True)
def _set_test_env(monkeypatch):
    """Set test environment variables."""
    monkeypatch.setenv("APP_ENV", "test")
    monkeypatch.setenv("DATABASE_URL", "sqlite:///test.db")
    monkeypatch.setenv("SECRET_KEY", "test-secret-key")
    monkeypatch.setenv("REDIS_URL", "redis://localhost:6379/15")


# ── Mock Factories ────────────────────────────────────────
@pytest.fixture
def mock_user():
    """Create a mock user object."""
    return {
        "id": "test-user-id",
        "email": "test@example.com",
        "firstName": "Test",
        "lastName": "User",
        "role": "user",
    }


@pytest.fixture
def mock_product():
    """Create a mock product object."""
    return {
        "id": "test-product-id",
        "name": "Test Product",
        "description": "A test product",
        "price": 29.99,
        "originalPrice": 39.99,
        "stock": 100,
        "sku": "TEST-001",
        "categoryId": "test-category-id",
        "images": ["https://example.com/image.jpg"],
        "tags": ["test"],
        "features": ["Feature 1"],
        "specifications": {"Key": "Value"},
        "rating": 4.5,
        "reviewCount": 10,
        "isNew": True,
        "isFeatured": True,
    }


@pytest.fixture
def mock_cart_item(mock_product):
    """Create a mock cart item."""
    return {
        "id": "cart-item-id",
        "productId": mock_product["id"],
        "name": mock_product["name"],
        "price": mock_product["price"],
        "quantity": 2,
        "image": mock_product["images"][0],
    }


@pytest.fixture
def auth_headers():
    """Create mock auth headers with a test JWT token."""
    return {
        "Authorization": "Bearer test-jwt-token",
        "Content-Type": "application/json",
    }


# ── Database Helpers ──────────────────────────────────────
@pytest.fixture
def mock_db():
    """Create a mock database session."""
    db = MagicMock()
    db.commit = MagicMock()
    db.rollback = MagicMock()
    db.close = MagicMock()
    return db
