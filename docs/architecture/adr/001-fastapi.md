# ADR-001: Use FastAPI for Backend Services

## Status: ✅ Accepted

## Context

We need a Python web framework for building our microservices. The key requirements are:
- High performance (async support)
- Automatic API documentation (OpenAPI)
- Type safety with Pydantic
- Easy to learn and maintain

## Decision

Use **FastAPI** as the web framework for all backend services.

## Consequences

### Positive
- Built-in async support with `asyncio`
- Automatic OpenAPI documentation at `/docs`
- Pydantic models for request/response validation
- Excellent performance (on par with Node.js/Go)
- Strong typing with Python type hints
- Active community and ecosystem

### Negative
- Smaller ecosystem compared to Django
- No built-in admin panel
- Requires manual setup for some features (e.g., migrations)

## Alternatives Considered

| Framework | Pros | Cons | Decision |
|-----------|------|------|----------|
| Django + DRF | Batteries included, admin panel | Slower, monolithic by default | ❌ |
| Flask | Simple, flexible | No async, no built-in validation | ❌ |
| FastAPI | Async, typed, auto-docs | Newer ecosystem | ✅ |
