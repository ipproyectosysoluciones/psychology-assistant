# 🐳 Docker Documentation - Psychology Assistant

## Overview

This project uses Docker for containerized deployment of both backend (Node.js/Express) and frontend (Angular) applications. The setup includes production and development configurations.

**Version**: 0.3.0  
**Last Updated**: March 12, 2026

---

## Table of Contents

1. [Architecture](#architecture)
2. [Prerequisites](#prerequisites)
3. [Production Deployment](#production-deployment)
4. [Development Setup](#development-setup)
5. [Building Images](#building-images)
6. [Resource Management](#resource-management)
7. [Security](#security)
8. [Troubleshooting](#troubleshooting)
9. [Performance Optimization](#performance-optimization)

---

## Architecture

### Services

```
┌─────────────────────────────────────────────────┐
│          Docker Compose Network                 │
│                                                 │
│  ┌──────────────┐    ┌──────────────┐          │
│  │   Frontend   │    │   Backend    │          │
│  │  Angular     │───▶│   Node.js    │          │
│  │  Port 4200   │    │   Port 5000  │          │
│  └──────────────┘    └──────────────┘          │
│         │                    │                  │
│         │                    ▼                  │
│         │            ┌──────────────┐          │
│         │            │  MongoDB     │          │
│         │            │  Port 27017  │          │
│         └───────────▶│ (Shared)     │          │
│                      └──────────────┘          │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Files

- **Dockerfile** - Backend production image (multi-stage build)
- **frontend/Dockerfile.dev** - Frontend development image
- **frontend/Dockerfile.prod** - Frontend production image (nginx serving)
- **docker-compose.yml** - Production orchestration
- **docker-compose.dev.yml** - Development orchestration
- **.dockerignore** - Files excluded from Docker builds
- **nginx.prod.conf** - Nginx configuration for production frontend

---

## Prerequisites

### Required

- Docker >= 20.10
- Docker Compose >= 2.0
- 4GB free disk space (minimum)

### Optional

- Docker Desktop (for GUI)
- Make or bash shell (for scripts)

### Verification

```bash
docker --version
docker-compose --version
```

---

## Production Deployment

### 1. Environment Configuration

Create `.env` file with required variables:

```bash
# Required - API Configuration
JWT_SECRET=your_jwt_secret_min_32_chars
REFRESH_TOKEN_SECRET=your_refresh_token_secret_min_32_chars

# Required - Database
MONGO_ROOT_PASSWORD=your_mongodb_password_min_8_chars
MONGO_ROOT_USER=admin

# Optional - API Settings
NODE_ENV=production
PORT=5000
LOG_LEVEL=info
CORS_ORIGIN=https://yourdomain.com

# Optional - Database
MONGO_DATABASE=psychology-assistant
```

### 2. Build and Start

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 3. Verify Services

```bash
# Check running containers
docker-compose ps

# Test API health
curl http://localhost:5000/health

# Test MongoDB connection
docker-compose exec mongodb mongosh -u admin -p
```

### 4. Scaling & Management

```bash
# Stop services
docker-compose down

# Remove images and volumes
docker-compose down -v

# Restart services
docker-compose restart

# View resource usage
docker stats
```

---

## Development Setup

### 1. Quick Start

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Tail logs
docker-compose -f docker-compose.dev.yml logs -f
```

### 2. Service Access

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

### 3. Development Workflow

```bash
# Edit code - volumes are hot-reloaded
# Changes apply automatically

# View backend logs
docker-compose -f docker-compose.dev.yml logs app

# View frontend logs
docker-compose -f docker-compose.dev.yml logs frontend

# Run tests inside container
docker-compose -f docker-compose.dev.yml exec app pnpm test

# Execute backend command
docker-compose -f docker-compose.dev.yml exec app pnpm run migrate
```

### 4. Stop Development

```bash
docker-compose -f docker-compose.dev.yml down
```

---

## Building Images

### Backend Image

**Production Multi-Stage Build:**

```dockerfile
# Stage 1: Dependencies
FROM node:18-alpine AS dependencies
- Installs pnpm
- Copies package files
- Performs full install (dev + prod)

# Stage 2: Runtime
FROM node:18-alpine
- Adds dumb-init for signal handling
- Creates non-root user (nodejs)
- Copies only production dependencies
- Runs as non-root for security
- Exposes port 5000
```

**Build Command:**

```bash
docker build -t psychology-assistant-api:latest .
```

**Image Size:** ~350MB

### Frontend Images

**Development Image:**

```dockerfile
FROM node:18-alpine
- Runs Angular dev server
- Hot reload with volumes
- Size: ~450MB
```

**Production Image:**

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
- Runs: pnpm install && pnpm build
- Output: dist/psychology-assistant/

# Stage 2: Runtime
FROM nginx:1.25-alpine
- Serves files from /usr/share/nginx/html
- Uses nginx.prod.conf for SPA routing
- Non-root user (nginx)
- Size: ~50MB (tiny!)
```

**Build Command:**

```bash
docker build -f frontend/Dockerfile.prod -t psychology-assistant-frontend:latest frontend/
```

---

## Resource Management

### Memory Limits (Production)

```yaml
Backend:
  Limit: 512MB
  Reservation: 256MB

MongoDB:
  Limit: 1GB
  Reservation: 512MB

Total: ~1.5GB
```

### Memory Limits (Development)

```yaml
Backend:
  Limit: 1024MB
  Reservation: 512MB

Frontend:
  Limit: 768MB
  Reservation: 384MB

MongoDB:
  Limit: 512MB
  Reservation: 256MB

Total: ~2.3GB
```

### CPU Limits

```yaml
# Production
Backend: 1 CPU (reserve 0.5)
MongoDB: 2 CPUs (reserve 1)

# Development
Backend: 1.5 CPUs (reserve 1)
Frontend: 1 CPU (reserve 0.5)
MongoDB: 1 CPU (reserve 0.5)
```

### View Resource Usage

```bash
docker stats                    # Real-time stats
docker stats --no-stream        # One-time snapshot
docker container inspect <id>   # Detailed info
```

---

## Security

### Best Practices Implemented

✅ **Non-root Users**

- Backend: runs as `nodejs` user (UID 1001)
- Frontend: runs as `nginx` user (UID 101)
- Never runs as root

✅ **Privilege Dropping**

```yaml
security_opt:
  - no-new-privileges:true
cap_drop:
  - ALL
cap_add:
  - NET_BIND_SERVICE # Only needed capability
```

✅ **Read-only Filesystem**

```yaml
# Critical in production
read_only: true
# Plus explicit writable tmpfs for logs
tmpfs:
  - /tmp
  - /app/logs
```

✅ **Secret Management**

```bash
# Use .env file (never committed)
# Pass as environment variables
# Never hardcode secrets in Dockerfile
```

✅ **Network Isolation**

```bash
# Containers only communicate via internal Docker network
# No external network access by default
# Ports explicitly exposed only when needed
```

### Environment Variables

**Never commit:**

- `.env`
- Secrets in docker-compose.yml

**Use `.env.example`:**

```bash
# Copy to .env and fill in values
cp .env.example .env
# Edit with your actual secrets
```

---

## Troubleshooting

### Container Won't Start

```bash
# View detailed logs
docker-compose logs app
docker-compose logs mongodb

# Check resource constraints
docker stats
docker inspect <container_id>

# Verify environment variables
docker-compose exec app env | grep NODE_ENV
```

### Connection Refused

```bash
# Wait for services to be healthy
docker-compose ps  # Check STATUS column

# Test connectivity between containers
docker-compose exec app curl http://mongodb:27017

# Check Docker network
docker network ls
docker inspect psychology-network
```

### Performance Issues

```bash
# Monitor resource usage
docker stats --no-stream

# Check container logs for errors
docker-compose logs -f --tail=100

# Verify volumes are mounted correctly
docker inspect <container_id> | grep -A 10 Mounts
```

### Reset Development Environment

```bash
# Stop and remove everything
docker-compose -f docker-compose.dev.yml down -v

# Clean Docker system
docker system prune -a

# Restart from scratch
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml up -d
```

---

## Performance Optimization

### Image Size Optimization

| Stage           | Before | After | Saved |
| --------------- | ------ | ----- | ----- |
| Backend         | 950MB  | 350MB | 63%   |
| Frontend (Prod) | 1.2GB  | 50MB  | 95%   |

### Techniques Used

✅ **Multi-stage Builds**

- Separates build dependencies from runtime
- Only production dependencies in final image
- See `Dockerfile` and `frontend/Dockerfile.prod`

✅ **Alpine Base Images**

- `node:18-alpine` (154MB) vs `node:18` (1GB)
- `nginx:1.25-alpine` (40MB) vs `nginx:latest` (130MB)

✅ **Dependency Management**

```bash
# Only production dependencies in final image
pnpm install --production=true

# Frozen lockfile for reproducible builds
pnpm install --frozen-lockfile
```

✅ **Layer Caching**

- Dockerfile layer order: package files → install → source code
- Package changes don't rebuild entire image

✅ **Health Checks**

```yaml
healthcheck:
  interval: 30s # Check every 30 seconds
  timeout: 10s # Wait 10s for response
  start_period: 40s # Wait 40s before first check
  retries: 3 # Fail after 3 failures
```

### Docker Compose Optimization

```yaml
# Use named volumes (better performance than bind mounts)
volumes:
  mongodb_data:
    driver: local

# Resource constraints prevent runaway containers
deploy:
  resources:
    limits:
      memory: 512M
    reservations:
      memory: 256M
```

---

## Commands Reference

### Image Operations

```bash
# Build image
docker build -t image-name:tag .

# List images
docker image ls

# Remove image
docker image rm image-name:tag

# Tag image
docker tag image-name:tag registry/image:tag

# Push to registry (if configured)
docker push registry/image:tag
```

### Container Operations

```bash
# Start container
docker run -d --name container-name image:tag

# Execute command in container
docker exec container-name command

# View container logs
docker logs container-name
docker logs -f container-name  # Follow logs

# Stop container
docker stop container-name

# Remove container
docker rm container-name
```

### Docker Compose Operations

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes too
docker-compose down -v

# Rebuild images
docker-compose build --no-cache

# Scale service
docker-compose up -d --scale app=3
```

---

## CI/CD Integration

### GitHub Actions

Docker images are automatically built on:

- Push to `main` branch
- Pull requests to `main`

**Build Workflow**: `.github/workflows/build.yml`

```yaml
# Builds both backend and frontend
# Validates bundle sizes
# Creates Docker images ready for deployment
```

---

## Next Steps

1. **Staging Deployment**

   ```bash
   docker-compose -f docker-compose.yml up -d
   # Verify at http://localhost:5000
   ```

2. **Production Deployment**

   - Push images to registry (Docker Hub, ECR, etc.)
   - Configure Kubernetes or Docker Swarm
   - Setup monitoring with Prometheus + Grafana

3. **Advanced Configuration**
   - Add reverse proxy (Nginx/HAProxy)
   - Enable HTTPS/TLS
   - Configure secrets management
   - Setup log aggregation

---

## FAQ

**Q: Can I run frontend and backend on separate machines?**  
A: Yes, update docker-compose to use IP addresses instead of service names for CORS_ORIGIN and API_URL.

**Q: How do I persist data between runs?**  
A: Named volumes (`mongodb_data`) persist automatically. Use `docker-compose down` (not `-v` flag) to keep data.

**Q: Can I use Docker without Docker Compose?**  
A: Yes, use individual `docker run` commands, but Compose is recommended for multi-service setup.

**Q: How do I update secrets in production?**  
A: Update `.env` file and run `docker-compose up -d` - containers will restart with new values.

---

## Support

For issues or questions:

1. Check logs: `docker-compose logs`
2. Review this documentation
3. Open GitHub issue with error output

---

**Last Updated**: March 12, 2026  
**Maintainer**: Psychology Assistant Team  
**Version**: 0.3.0
