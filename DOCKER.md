# Docker Setup Guide

## Overview

Este proyecto incluye configuración completa de Docker para desarrollo y producción.

**Files:**

- `Dockerfile` - Production image for Node.js backend
- `docker-compose.yml` - Production stack with MongoDB
- `docker-compose.dev.yml` - Development stack with frontend and backend
- `frontend/Dockerfile.dev` - Development image for Angular frontend

## Quick Start

### Development Environment

Inicia todo el stack (backend + frontend + MongoDB):

```bash
# Build and start services
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
```

**Access points:**

- Frontend: http://localhost:4200
- Backend: http://localhost:5000
- MongoDB: mongodb://localhost:27017

### Production Environment

```bash
# Copy environment file
cp .env.example .env

# Configure .env with production values
# Important: Set JWT_SECRET, MONGO_ROOT_PASSWORD, etc.
nano .env

# Build and start
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app
```

## Environment Variables

### Development (.env)

```bash
NODE_ENV=development
JWT_SECRET=dev_secret_key
MONGO_ROOT_PASSWORD=dev_password
CORS_ORIGIN=http://localhost:4200
API_URL=http://localhost:5000
```

### Production (.env)

```bash
NODE_ENV=production
JWT_SECRET=<generate-with: openssl rand -base64 32>
MONGO_ROOT_PASSWORD=<strong-password>
CORS_ORIGIN=https://yourdomain.com
API_URL=https://api.yourdomain.com
```

## Common Commands

### Development

```bash
# Start all services
docker-compose -f docker-compose.dev.yml up -d

# Build images
docker-compose -f docker-compose.dev.yml build

# Restart a service
docker-compose -f docker-compose.dev.yml restart app

# Execute commands in container
docker-compose -f docker-compose.dev.yml exec app npm run seed

# View real-time logs
docker-compose -f docker-compose.dev.yml logs -f

# Remove everything
docker-compose -f docker-compose.dev.yml down -v
```

### Production Deployment

```bash
# Initialize stack (first time)
docker-compose up -d

# Update running services
docker-compose up -d --build

# Scale services
docker-compose up -d --scale app=2

# Health checks
docker-compose ps

# Restart failed services
docker-compose restart

# Access MongoDB
docker-compose exec mongodb mongosh -u admin -p
```

## Monitoring & Debugging

### View Service Status

```bash
# List all running containers
docker-compose ps

# Check service health
docker-compose ps

# View resource usage
docker stats

# View container logs
docker-compose logs -f [service-name]
```

### Access Container Shells

```bash
# Access backend container
docker-compose exec app sh

# Access MongoDB
docker-compose exec mongodb mongosh -u admin -p

# Access frontend (if running)
docker-compose -f docker-compose.dev.yml exec frontend sh
```

### Debug Issues

```bash
# Check network connectivity
docker-compose exec app curl http://mongodb:27017

# Test MongoDB connection
docker-compose exec mongodb mongosh -u admin -p

# View full logs for service
docker-compose logs app

# Inspect container
docker inspect <container-id>
```

## Database Backups

### Create Backup

```bash
docker-compose exec mongodb \
  mongodump --out=/backup \
  -u admin -p <password>

docker cp <container-id>:/backup ./local-backup
```

### Restore Backup

```bash
docker cp ./local-backup <container-id>:/restore

docker-compose exec mongodb \
  mongorestore /restore \
  -u admin -p <password>
```

## Security Notes

### Development

- Secrets in `docker-compose.dev.yml` are for LOCAL DEVELOPMENT only
- Never commit `.env` files with production secrets
- Use `.env.example` as template

### Production

- Use strong passwords for MONGO_ROOT_PASSWORD
- Generate random JWT_SECRET: `openssl rand -base64 32`
- Store secrets in:
  - AWS Secrets Manager
  - HashiCorp Vault
  - Docker Secrets (Swarm)
  - CI/CD platform
- Use HTTPS for CORS_ORIGIN
- Restrict MongoDB network access
- Enable authentication in MongoDB
- Use read-only volumes where possible

## Health Checks

Services include health checks that automatically restart on failure:

```bash
# View health status
docker-compose ps

# Manually trigger health check
docker-compose exec app node scripts/healthcheck.js

# View health logs
docker inspect --format='{{.State.Health}}' <container-id>
```

## Performance Optimization

### Development

```bash
# Use volumes instead of bind mounts for node_modules
docker-compose -f docker-compose.dev.yml up --build

# Enable Docker BuildKit for faster builds
DOCKER_BUILDKIT=1 docker build .
```

### Production

```bash
# Use multi-stage builds
docker build --target production .

# Enable layer caching
docker build --cache-from psychology-assistant:latest .
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :5000

# Change port in docker-compose.yml
# Or stop other services: kill -9 <pid>
```

### MongoDB Connection Issues

```bash
# Check MongoDB is healthy
docker-compose exec mongodb mongosh -u admin -p

# Verify network
docker-compose exec app ping mongodb

# Check logs
docker-compose logs mongodb
```

### Frontend Can't Connect to API

```bash
# Verify CORS_ORIGIN in backend
echo $CORS_ORIGIN

# Test from frontend container
docker-compose exec frontend curl http://app:5000/health

# Check API_URL in frontend environment
```

### Out of Disk Space

```bash
# Clean up unused images/volumes
docker system prune -a --volumes

# Check disk usage
docker system df
```

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Build Docker Images
  run: docker-compose build

- name: Start Services
  run: docker-compose up -d

- name: Wait for Health
  run: docker-compose exec -T app npm run health-check

- name: Run Tests
  run: docker-compose exec -T app npm test

- name: Push to Registry
  run: docker push myregistry/psychology-assistant:latest
```

## Further Reading

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [MongoDB in Docker](https://hub.docker.com/_/mongo)
- [Node.js Best Practices](https://github.com/nodejs/docker-node)
