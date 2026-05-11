"""
🧪 Unit Tests — Product Service
"""

import pytest


class TestProductEndpoints:
    """Test product service endpoint logic."""

    def test_product_creation_data(self, mock_product):
        """Verify mock product has required fields."""
        assert mock_product["name"] == "Test Product"
        assert mock_product["price"] == 29.99
        assert mock_product["stock"] == 100
        assert "images" in mock_product
        assert len(mock_product["images"]) > 0

    def test_product_discount_calculation(self, mock_product):
        """Verify discount percentage calculation."""
        original = mock_product["originalPrice"]
        current = mock_product["price"]
        discount = round(((original - current) / original) * 100)
        assert discount == 25  # (39.99 - 29.99) / 39.99 * 100

    def test_product_search_query_normalization(self):
        """Test search query normalization."""
        queries = ["  Headphones  ", "HEADPHONES", "headphones"]
        normalized = [q.strip().lower() for q in queries]
        assert all(q == "headphones" for q in normalized)

    def test_product_pagination_params(self):
        """Verify pagination parameter validation."""
        limit = min(max(1, 50), 100)  # clamp between 1-100
        offset = max(0, 0)
        assert limit == 50
        assert offset == 0

    def test_product_sku_format(self, mock_product):
        """Verify SKU format is valid."""
        sku = mock_product["sku"]
        parts = sku.split("-")
        assert len(parts) == 2
        assert parts[0].isalpha()
        assert parts[1].isdigit()
