# 🧪 Testing Guide

## Test Structure

```
tests/
├── conftest.py           # Shared fixtures & utilities
├── unit/                 # Unit tests (fast, isolated)
│   ├── test_product.py   # Product logic tests
│   └── test_auth.py      # Auth logic tests
└── integration/          # Integration tests (require services)
    └── test_e2e.py       # End-to-end API tests
```

## Running Tests

### Unit Tests

```bash
# All unit tests
make test

# Specific test file
pytest tests/unit/test_product.py -v

# With coverage
pytest tests/ --cov=app --cov-report=html

# Watch mode (requires pytest-watch)
ptw tests/
```

### Integration Tests

```bash
# Start services first
make up
make seed

# Run integration tests
make test-integration
```

### Test Markers

```bash
# Run only unit tests
pytest -m unit

# Run only integration tests
pytest -m integration

# Skip slow tests
pytest -m "not slow"
```

## Writing Tests

### Unit Test Template

```python
import pytest

class TestFeatureName:
    """Test [feature] logic."""

    def test_happy_path(self, mock_product):
        """Verify [expected behavior]."""
        result = some_function(mock_product)
        assert result == expected_value

    def test_edge_case(self):
        """Verify [edge case handling]."""
        with pytest.raises(ValueError):
            some_function(invalid_input)
```

### Using Fixtures

```python
def test_with_fixtures(mock_user, mock_product, auth_headers):
    """Fixtures from conftest.py are auto-injected."""
    assert mock_user["email"] == "test@example.com"
    assert "Authorization" in auth_headers
```

## Coverage

- **Target**: 70% minimum coverage
- **Report**: Generated at `htmlcov/index.html`
- **CI**: Coverage uploaded to Codecov on every PR
