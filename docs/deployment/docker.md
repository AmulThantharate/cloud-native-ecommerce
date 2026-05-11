# 🐳 Docker Deployment Guide

## Local Development

```bash
# Start everything
docker compose up -d --build

# Seed database
python3 scripts/seed_data.py

# View logs
docker compose logs -f

# Stop
docker compose down
```

## Production Dockerfile Best Practices

All NexStore Dockerfiles follow these standards:

- ✅ Multi-stage builds to minimize image size
- ✅ Non-root user for security
- ✅ `.dockerignore` to exclude unnecessary files
- ✅ Pinned base image versions
- ✅ Health checks defined
- ✅ Minimal final image (slim/alpine)

## Container Registry

Images are published to GitHub Container Registry on each release:

```bash
# Pull a specific service
docker pull ghcr.io/nexstore/cloud-native-ecommerce/user-service:latest

# Pull a specific version
docker pull ghcr.io/nexstore/cloud-native-ecommerce/user-service:1.0.0
```

## Resource Limits

Recommended container resource limits for production:

| Service | CPU | Memory |
|---------|-----|--------|
| API Gateway | 0.5 | 256Mi |
| User Service | 0.5 | 256Mi |
| Product Service | 0.5 | 256Mi |
| Cart Service | 0.25 | 128Mi |
| Order Service | 0.5 | 256Mi |
| Payment Service | 0.25 | 128Mi |
| Frontend | 0.5 | 512Mi |
| PostgreSQL | 1.0 | 512Mi |
| Redis | 0.25 | 128Mi |
| RabbitMQ | 0.5 | 256Mi |
