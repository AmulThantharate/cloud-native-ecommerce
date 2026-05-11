# 📋 Changelog

All notable changes to NexStore will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### ✨ Added
- Categories page with image cards and browsable grid
- Category detail page with product filtering
- Deals page with discount hero banner
- New Arrivals page
- Working category filter buttons on products page (inline filtering)
- Filter panel with price range presets (Under $50, $50-$100, etc.)
- Sort dropdown (Price, Name, Rating, Newest)
- 22 products across 5 categories
- Production-grade GitHub repository setup

### 🐛 Fixed
- Login endpoint now accepts JSON body (`{email, password}`) instead of form-encoded data
- API gateway base route routing (307 redirect loops)
- bcrypt compatibility with passlib (pinned bcrypt==4.0.1)
- Rate limiter threshold increased to 1000 req/min
- Pydantic Optional field validation errors

### 🔧 Changed
- Upgraded seed script to 22 products with rich metadata
- Rewrote API gateway proxy with dual routing strategy

---

## [0.1.0] — 2026-05-10

### ✨ Added
- Initial microservices architecture
- User Service with JWT authentication
- Product Service with Redis caching
- Cart Service with Redis persistence
- Order Service with RabbitMQ events
- Payment Service (mock)
- Notification Service
- API Gateway with rate limiting
- Next.js frontend with dark mode
- Docker Compose orchestration
- Database seeding script

[Unreleased]: https://github.com/nexstore/cloud-native-ecommerce/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/nexstore/cloud-native-ecommerce/releases/tag/v0.1.0
