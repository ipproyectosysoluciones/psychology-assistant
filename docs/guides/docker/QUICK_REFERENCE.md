# Docker Quick Reference - Referencia Rápida de Docker

**Last Updated**: March 11, 2026

---

## 🚀 Quick Start / Inicio Rápido

### Development (Full Stack)

```bash
# Start all services (frontend + backend + mongodb)
docker-compose -f docker-compose.dev.yml up -d

# Check status
docker-compose -f docker-compose.dev.yml ps

# View logs (all services)
docker-compose -f docker-compose.dev.yml logs -f

# Stop all services
docker-compose -f docker-compose.dev.yml down

# Stop and remove volumes
docker-compose -f docker-compose.dev.yml down -v
```

### Access Services

| Service  | URL                       | Port  |
| -------- | ------------------------- | ----- |
| Frontend | http://localhost:4200     | 4200  |
| Backend  | http://localhost:5000/api | 5000  |
| MongoDB  | mongodb://localhost:27017 | 27017 |

---

## 🔧 Service Management

### View Logs

```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Specific service
docker-compose -f docker-compose.dev.yml logs -f app        # Backend
docker-compose -f docker-compose.dev.yml logs -f frontend   # Angular
docker-compose -f docker-compose.dev.yml logs -f mongodb    # Database

# Last 100 lines
docker-compose -f docker-compose.dev.yml logs --tail=100 app
```

### Restart Services

```bash
# Restart all
docker-compose -f docker-compose.dev.yml restart

# Restart specific service
docker-compose -f docker-compose.dev.yml restart app
docker-compose -f docker-compose.dev.yml restart frontend

# Restart and rebuild
docker-compose -f docker-compose.dev.yml restart && docker-compose -f docker-compose.dev.yml up -d --build
```

### Execute Commands

```bash
# Run backend tests
docker-compose -f docker-compose.dev.yml exec app pnpm test

# Run specific test file
docker-compose -f docker-compose.dev.yml exec app pnpm test -- userController.test.js

# Run linter
docker-compose -f docker-compose.dev.yml exec app pnpm lint

# Install package
docker-compose -f docker-compose.dev.yml exec app pnpm add <package-name>

# Backend shell
docker-compose -f docker-compose.dev.yml exec app sh

# Frontend shell
docker-compose -f docker-compose.dev.yml exec frontend sh

# MongoDB shell
docker-compose -f docker-compose.dev.yml exec mongodb mongosh
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
lsof -ti:5000   # Backend
lsof -ti:4200   # Frontend
lsof -ti:27017  # MongoDB

# Kill process
lsof -ti:5000 | xargs kill -9

# Or change port in docker-compose.dev.yml
# Change "5000:5000" to "5001:5000"
```

### Services Won't Start

```bash
# Check service status
docker-compose -f docker-compose.dev.yml ps

# View detailed logs
docker-compose -f docker-compose.dev.yml logs

# Force rebuild
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d --build

# Remove dangling images/volumes
docker system prune -a --volumes
```

### MongoDB Connection Issues

```bash
# Check MongoDB health
docker-compose -f docker-compose.dev.yml exec mongodb mongosh

# Show databases
docker-compose -f docker-compose.dev.yml exec mongodb mongosh --eval "db.adminCommand('ping')"

# Restart MongoDB
docker-compose -f docker-compose.dev.yml restart mongodb
```

### Frontend Not Loading

```bash
# Check frontend logs
docker-compose -f docker-compose.dev.yml logs -f frontend

# Verify API URL
docker-compose -f docker-compose.dev.yml exec frontend printenv | grep API_URL

# Check backend health
curl http://localhost:5000/api/health

# Clear Angular cache
docker-compose -f docker-compose.dev.yml exec frontend rm -rf .angular
```

---

## 📊 Monitoring

### Health Status

```bash
# Check all services
docker-compose -f docker-compose.dev.yml ps

# Expected output:
# STATUS: Up X seconds, healthy

# If unhealthy, check logs:
docker-compose -f docker-compose.dev.yml logs <service-name>
```

### Resource Usage

```bash
# View container stats
docker stats

# Limit in compose file (optional):
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

---

## 🔒 Production Deployment

```bash
# Ensure .env exists with production values
cp .env.example .env
nano .env

# Start production services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app

# Scale services (if needed)
docker-compose up -d --scale app=2
```

### Production Environment Variables

```bash
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=<cryptographically strong random string>
SESSION_SECRET=<cryptographically strong random string>
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=warn
```

---

## 🧹 Cleanup

```bash
# Remove stopped containers
docker-compose -f docker-compose.dev.yml down

# Remove with volumes
docker-compose -f docker-compose.dev.yml down -v

# Remove images
docker-compose -f docker-compose.dev.yml down --rmi all

# Full cleanup (careful!)
docker system prune -a --volumes
```

---

## 📈 Performance Tips

1. **Use `--build` only when needed**

   ```bash
   # Don't: docker-compose up --build (every time)
   # Do: docker-compose up (use existing images)
   # Only: docker-compose up --build (when dependencies change)
   ```

2. **Leverage volumes for dependencies**

   - Volumes already configured in docker-compose.dev.yml
   - node_modules persisted between restarts

3. **Use frozen lockfile**

   - pnpm install --frozen-lockfile in Dockerfile
   - Prevents unexpected version changes

4. **Health checks enabled**
   - Services automatically restart if unhealthy
   - Reduces manual intervention

---

## 💡 Common Workflows

### Daily Development

```bash
# Start of day
docker-compose -f docker-compose.dev.yml up -d

# Work on code (live reload enabled)
# Edit files in src/ or frontend/src/

# Run tests
docker-compose -f docker-compose.dev.yml exec app pnpm test

# End of day (optional)
docker-compose -f docker-compose.dev.yml down
```

### Testing New Dependencies

```bash
# Install package
docker-compose -f docker-compose.dev.yml exec app pnpm add <newpkg>

# Run tests to verify
docker-compose -f docker-compose.dev.yml exec app pnpm test

# Commit changes
git add pnpm-lock.yaml package.json
git commit -m "chore: add new dependency"
```

### Debugging Database

```bash
# Connect to MongoDB
docker-compose -f docker-compose.dev.yml exec mongodb mongosh

# Switch database
use psychology-assistant-dev

# Show collections
show collections

# Query data
db.users.find()
db.appointments.find()
```

---

## 🎯 Environment Variables Reference

### Backend Services

| Variable       | Dev Value                   | Prod Value        | Notes                 |
| -------------- | --------------------------- | ----------------- | --------------------- |
| NODE_ENV       | development                 | production        | Execution environment |
| PORT           | 5000                        | 5000              | Server port           |
| MONGO_URI      | mongodb://mongodb:27017/... | mongodb+srv://... | Database URL          |
| JWT_SECRET     | dev_secret                  | 32+ random chars  | Token signing         |
| SESSION_SECRET | dev_secret                  | 32+ random chars  | Session encryption    |
| CORS_ORIGIN    | http://localhost:4200       | https://domain    | CORS policy           |
| LOG_LEVEL      | debug                       | warn              | Logging level         |

### Frontend Services

| Variable | Value                 | Notes                 |
| -------- | --------------------- | --------------------- |
| NODE_ENV | development           | Execution environment |
| API_URL  | http://localhost:5000 | Backend API endpoint  |

---

## 🔗 Related Documentation

- **Full Docker Guide**: [docs/guides/DOCKER.md](./docs/guides/DOCKER.md)
- **Verification Report**: [DOCKER_VERIFICATION.md](./DOCKER_VERIFICATION.md)
- **Project Status**: [PROJECT_STATUS.md](./PROJECT_STATUS.md)
- **Development Guide**: [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)

---

**Version**: 1.0.0  
**Language Support**: ES / EN  
**Last Updated**: March 11, 2026
