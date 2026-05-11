<div align="center">

# 🛍️ NexStore

### Cloud-Native E-Commerce Platform

[![CI](https://img.shields.io/github/actions/workflow/status/nexstore/cloud-native-ecommerce/ci.yml?branch=main&label=CI&logo=github)](https://github.com/nexstore/cloud-native-ecommerce/actions/workflows/ci.yml)
[![Security](https://img.shields.io/github/actions/workflow/status/nexstore/cloud-native-ecommerce/security.yml?branch=main&label=Security&logo=github)](https://github.com/nexstore/cloud-native-ecommerce/actions/workflows/security.yml)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Code Style](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)

**A production-grade microservices e-commerce platform built with FastAPI, Next.js, PostgreSQL, Redis & RabbitMQ.**

[🚀 Quick Start](#-quick-start) · [📖 Docs](docs/) · [🤝 Contributing](CONTRIBUTING.md) · [🔒 Security](SECURITY.md)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Services](#-services)
- [Frontend Pages](#-frontend-pages)
- [API Reference](#-api-reference)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

NexStore is a **cloud-native e-commerce platform** built with microservices architecture. It demonstrates production-grade patterns including:

- ⚡ **7 independently deployable services** with clear domain boundaries
- 🔐 **JWT authentication** with role-based access control
- 🚀 **Redis caching** for high-performance product catalog
- 📨 **Event-driven architecture** via RabbitMQ
- 🐳 **Fully containerized** with Docker Compose
- 🧪 **Comprehensive testing** — unit, integration & E2E
- 📊 **Observability-ready** — health checks, structured logging, tracing hooks

---

## 🏗️ Architecture

```
                    ┌─────────────┐
                    │   Client    │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Next.js   │   :3000
                    │   Frontend  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ API Gateway │   :8000
                    │  (FastAPI)  │
                    └──────┬──────┘
                           │
        ┌────────┬─────────┼─────────┬──────────┐
        │        │         │         │          │
   ┌────▼───┐ ┌──▼────┐ ┌──▼───┐ ┌──▼────┐ ┌───▼────┐
   │  User  │ │Product│ │ Cart │ │Order  │ │Payment │
   │:8001   │ │:8002  │ │:8003 │ │:8004  │ │:8005   │
   └───┬────┘ └───┬───┘ └──┬───┘ └──┬───┘ └───┬────┘
       │          │        │        │         │
   ┌───▼───┐ ┌───▼───┐ ┌──▼──┐ ┌──▼───┐ ┌───▼───┐
   │  PG   │ │PG+Redis│ │Redis│ │PG+MQ │ │  PG   │
   └───────┘ └───────┘ └─────┘ └──────┘ └───────┘
                                   │
                            ┌──────▼──────┐
                            │Notification │  :8006
                            │  Service    │
                            └──────┬──────┘
                                   │
                            ┌──────▼──────┐
                            │  RabbitMQ   │
                            └─────────────┘
```

> 📖 See [Architecture Overview](docs/architecture/overview.md) for detailed diagrams and design decisions.

---

## 🛠️ Tech Stack

| Layer         | Technology                         | Purpose                        |
| ------------- | ---------------------------------- | ------------------------------ |
| **Frontend**  | Next.js 14, React 18, Tailwind CSS | App Router, SSR, responsive UI |
| **UI**        | ShadCN UI, Framer Motion, Zustand  | Components, animations, state  |
| **Backend**   | FastAPI, Python 3.11               | High-performance async API     |
| **Database**  | PostgreSQL 16                      | Relational data per service    |
| **Cache**     | Redis 7                            | Product cache, cart storage    |
| **Messaging** | RabbitMQ                           | Async event processing         |
| **Auth**      | JWT + bcrypt                       | Token-based authentication     |
| **Container** | Docker, Docker Compose             | Local dev & deployment         |
| **CI/CD**     | GitHub Actions                     | Lint, test, build, release     |
| **Security**  | Trivy, CodeQL, Gitleaks            | Container + code scanning      |

---

## 🚀 Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose v2+
- [Node.js 20+](https://nodejs.org/) (for frontend dev)
- [Python 3.11+](https://www.python.org/) (for backend dev)
- [Make](https://www.gnu.org/software/make/) (recommended)

### 1. Clone & Configure

```bash
git clone https://github.com/AmulThantharate/cloud-native-ecommerce.git
cd cloud-native-ecommerce
cp .env.example .env
```

### 2. Start Services

```bash
# Using Make (recommended)
make up

# Or using Docker Compose directly
docker compose up -d --build
```

### 3. Seed Database

```bash
make seed
# or: python3 scripts/seed_data.py
```

### 4. Open the App

| Service        | URL                                  |
| -------------- | ------------------------------------ |
| 🌐 Frontend    | http://localhost:3000                |
| 📡 API Gateway | http://localhost:8000                |
| 📖 API Docs    | http://localhost:8000/docs           |
| 🐰 RabbitMQ    | http://localhost:15672 (guest/guest) |

### 5. Verify Health

```bash
make health
```

---

## 📁 Project Structure

```
cloud-native-ecommerce/
├── 📂 .github/                  # GitHub configuration
│   ├── CODEOWNERS               # Ownership rules
│   ├── dependabot.yml           # Dependency updates
│   ├── pull_request_template.md # PR template
│   ├── ISSUE_TEMPLATE/          # Issue templates
│   │   ├── bug_report.yml       # Bug reports
│   │   ├── feature_request.yml  # Feature requests
│   │   └── task.yml             # Internal tasks
│   └── workflows/               # CI/CD pipelines
│       ├── ci.yml               # Lint, test, build
│       ├── security.yml         # Security scanning
│       └── release.yml          # Release & publish
├── 📂 .vscode/                  # Editor settings
├── 📂 backend/                  # Microservices
│   ├── api-gateway/             # 🔀 Request routing & auth
│   ├── user-service/            # 👤 Authentication & users
│   ├── product-service/         # 📦 Product catalog
│   ├── cart-service/            # 🛒 Shopping cart (Redis)
│   ├── order-service/           # 📋 Order processing
│   ├── payment-service/         # 💳 Payment handling
│   └── notification-service/    # 📧 Email/SMS notifications
├── 📂 frontend/                 # Next.js frontend
│   ├── src/app/                 # App Router pages
│   ├── src/components/          # React components
│   ├── src/store/               # Zustand stores
│   └── src/lib/                 # Utilities & API
├── 📂 infra/                    # Infrastructure
│   ├── terraform/               # Terraform modules
│   └── docker/                  # Docker configs
├── 📂 docs/                     # Documentation
│   ├── architecture/            # Design docs & ADRs
│   ├── api/                     # API reference
│   ├── deployment/              # Deployment guides
│   └── development/             # Dev guides
├── 📂 scripts/                  # Utility scripts
│   ├── seed_data.py             # Database seeder
│   └── init-db.sql              # DB initialization
├── 📂 tests/                    # Test suites
│   ├── conftest.py              # Shared fixtures
│   ├── unit/                    # Unit tests
│   └── integration/             # Integration tests
├── 📄 .editorconfig             # Editor formatting
├── 📄 .env.example              # Environment template
├── 📄 .gitattributes            # Git attributes
├── 📄 .gitignore                # Git ignore rules
├── 📄 .gitleaks.toml            # Secret detection
├── 📄 CHANGELOG.md              # Release history
├── 📄 CODE_OF_CONDUCT.md        # Community standards
├── 📄 CONTRIBUTING.md           # Contribution guide
├── 📄 docker-compose.yml        # Local orchestration
├── 📄 LICENSE                   # MIT License
├── 📄 Makefile                  # Developer commands
├── 📄 pyproject.toml            # Python tooling config
├── 📄 README.md                 # ← You are here
└── 📄 SECURITY.md               # Security policy
```

---

## ⚙️ Services

### Service Endpoints

| Service            | Port | Health    | Description                          |
| ------------------ | ---- | --------- | ------------------------------------ |
| 🔀 API Gateway     | 8000 | `/health` | Request routing, auth, rate limiting |
| 👤 User Service    | 8001 | `/health` | Registration, login, profiles        |
| 📦 Product Service | 8002 | `/health` | Catalog, categories, search          |
| 🛒 Cart Service    | 8003 | `/health` | Cart management (Redis)              |
| 📋 Order Service   | 8004 | `/health` | Order processing                     |
| 💳 Payment Service | 8005 | `/health` | Payment handling                     |
| 📧 Notification    | 8006 | `/health` | Email/SMS (RabbitMQ consumer)        |

### Service Features

| Feature         | Service              | Details                                |
| --------------- | -------------------- | -------------------------------------- |
| JWT Auth        | User                 | Token-based authentication with bcrypt |
| Redis Cache     | Product              | Cache-first catalog reads              |
| Redis Storage   | Cart                 | Ephemeral cart with 7-day TTL          |
| RabbitMQ Events | Order → Notification | Async order status updates             |
| Rate Limiting   | Gateway              | 1000 req/min per IP                    |
| Chaos Endpoints | All                  | `/chaos/delay`, `/chaos/error`         |

---

## 🌐 Frontend Pages

| Page               | Route                | Auth | Description                           |
| ------------------ | -------------------- | ---- | ------------------------------------- |
| 🏠 Home            | `/`                  | ❌   | Hero, featured products, trending     |
| 📦 Products        | `/products`          | ❌   | Grid with search, filters, categories |
| 🔍 Product Detail  | `/products/[id]`     | ❌   | Full product page with specs          |
| 📂 Categories      | `/categories`        | ❌   | Category grid with images             |
| 📂 Category Detail | `/categories/[slug]` | ❌   | Products by category                  |
| 🔥 Deals           | `/deals`             | ❌   | Discounted products                   |
| ✨ New Arrivals    | `/new-arrivals`      | ❌   | Latest products                       |
| 🛒 Cart            | `/cart`              | ❌   | Shopping cart                         |
| 💳 Checkout        | `/checkout`          | ✅   | Order placement                       |
| 🔑 Login           | `/login`             | ❌   | Sign in                               |
| 📝 Sign Up         | `/signup`            | ❌   | Registration                          |
| 👤 Dashboard       | `/dashboard`         | ✅   | User profile                          |
| 📋 Orders          | `/orders`            | ✅   | Order history                         |
| 🔧 Admin           | `/admin`             | 🔑   | Admin panel                           |

---

## 📖 API Reference

Each service exposes interactive API docs at `/docs` (Swagger UI):

```bash
# API Gateway docs
open http://localhost:8000/docs
```

> 📖 See [API Documentation](docs/api/gateway.md) for the complete endpoint reference.

---

## 🧪 Testing

```bash
# Run all tests
make test

# Unit tests only
pytest tests/unit/ -v

# Integration tests (requires running services)
make test-integration

# With coverage
make test-coverage
```

| Type        | Directory            | Requires Services |
| ----------- | -------------------- | ----------------- |
| Unit        | `tests/unit/`        | ❌                |
| Integration | `tests/integration/` | ✅                |
| E2E         | Browser-based        | ✅                |

> 📖 See [Testing Guide](docs/development/testing.md) for details.

---

## 🚢 Deployment

### Docker (Development)

```bash
make up     # Start all services
make down   # Stop all services
make logs   # View logs
```

### Release (Production)

```bash
# Tag a release
make release
# → Triggers GitHub Actions to build & push images to GHCR

# Pull production images
docker pull ghcr.io/nexstore/cloud-native-ecommerce/user-service:1.0.0
```

> 📖 See [Production Checklist](docs/deployment/production.md) for deployment readiness.

---

## 🔐 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

| Variable            | Default                           | Description                             |
| ------------------- | --------------------------------- | --------------------------------------- |
| `SECRET_KEY`        | —                                 | JWT signing key (change in production!) |
| `POSTGRES_USER`     | postgres                          | Database user                           |
| `POSTGRES_PASSWORD` | postgres                          | Database password                       |
| `REDIS_URL`         | redis://redis:6379/0              | Redis connection                        |
| `RABBITMQ_URL`      | amqp://guest:guest@rabbitmq:5672/ | RabbitMQ connection                     |

> 📖 See [`.env.example`](.env.example) for all variables.

---

## 🔧 Troubleshooting

<details>
<summary>🐳 <b>Services won't start</b></summary>

```bash
# Check container status
docker compose ps

# View logs for a specific service
docker compose logs user-service

# Rebuild from scratch
docker compose down -v
docker compose up --build
```

</details>

<details>
<summary>🔴 <b>Database connection errors</b></summary>

```bash
# Wait for PostgreSQL to be healthy
docker compose up postgres -d
sleep 5
docker compose up -d
```

</details>

<details>
<summary>⚠️ <b>Port already in use</b></summary>

```bash
# Find and kill the process
lsof -i :8000
kill -9 <PID>
```

</details>

<details>
<summary>🔑 <b>Login returns 422 error</b></summary>

The login endpoint expects JSON body: `{"email": "...", "password": "..."}`. Not form-encoded data.

</details>

---

## 🤝 Contributing

We welcome contributions! Please read our:

- 📖 [Contributing Guide](CONTRIBUTING.md) — workflow, conventions, code style
- 📜 [Code of Conduct](CODE_OF_CONDUCT.md) — community standards
- 🔒 [Security Policy](SECURITY.md) — vulnerability reporting

```bash
# Fork → Branch → Develop → Test → PR
git checkout -b feat/your-feature
make lint && make test
git commit -m "feat(scope): description"
```

---

## 📋 Available Commands

```bash
make help           # Show all commands
make up             # Start services
make down           # Stop services
make seed           # Seed database
make test           # Run tests
make lint           # Lint code
make format         # Format code
make health         # Health check
make security-scan  # Scan vulnerabilities
make secret-scan    # Detect leaked secrets
make release        # Create release
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ for learning and production use**

[⬆ Back to Top](#-nexstore)

</div>
