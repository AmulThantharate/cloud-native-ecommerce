# 🛠️ Local Development Setup

## Prerequisites

| Tool | Version | Required |
|------|---------|----------|
| Docker | 24+ | ✅ |
| Docker Compose | v2+ | ✅ |
| Node.js | 20+ | Frontend dev |
| Python | 3.11+ | Backend dev |
| Make | Any | Recommended |

## Quick Start

```bash
# Clone
git clone <repo-url>
cd cloud-native-ecommerce

# Copy environment
cp .env.example .env

# Start all services
make up

# Seed database
make seed

# Check health
make health
```

## Services

| Service | URL | Docs |
|---------|-----|------|
| Frontend | http://localhost:3000 | — |
| API Gateway | http://localhost:8000 | http://localhost:8000/docs |
| RabbitMQ | http://localhost:15672 | guest/guest |

## Frontend Development

```bash
cd frontend
npm install
npm run dev
```

The frontend proxies `/api/*` requests to the API gateway automatically.

## Backend Development

```bash
# Start infra only
docker compose up postgres redis rabbitmq -d

# Run a specific service locally
cd backend/user-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

## Useful Commands

```bash
make help        # Show all available commands
make logs        # Tail service logs
make ps          # Show running services
make lint        # Run linters
make format      # Auto-format code
make test        # Run all tests
make reset-db    # Clear database
```

## Troubleshooting

See the [Troubleshooting section](../../README.md#-troubleshooting) in the README.
