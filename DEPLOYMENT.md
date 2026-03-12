# 🚀 Deployment Setup & Configuration

## GitHub Secrets Configuration

Configure these secrets in your GitHub repository settings: **Settings → Secrets and variables → Actions**

### Required Secrets

#### Authentication & Database

```
MONGO_ROOT_PASSWORD
  - MongoDB root password
  - Min 8 characters
  - Use strong, random password
  - Example: MySecurePassword123!
```

#### JWT & Session

```
JWT_SECRET
  - JWT signing secret
  - Min 32 characters
  - Use: openssl rand -hex 32
  - Example: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

```
REFRESH_TOKEN_SECRET
  - Refresh token signing secret
  - Min 32 characters
  - Different from JWT_SECRET
  - Use: openssl rand -hex 32
```

#### Registry (Optional - for Docker Hub/ECR)

```
DOCKER_REGISTRY_URL (optional)
  - Docker registry URL
  - Example: docker.io or registry.hub.docker.com
```

```
DOCKER_REGISTRY_USER (optional)
  - Docker registry username
  - For authentication
```

```
DOCKER_REGISTRY_PASSWORD (optional)
  - Docker registry token/password
  - Use personal access token (PAT) instead of password
```

#### Code Coverage (Optional)

```
CODECOV_TOKEN (optional)
  - Codecov.io integration token
  - For coverage reporting
```

### How to Create Secrets

**Option 1: GitHub Web Interface**

1. Go to: `https://github.com/ipproyectosysoluciones/psychology-assistant/settings/secrets/actions`
2. Click "New repository secret"
3. Enter name and value
4. Click "Add secret"

**Option 2: GitHub CLI**

```bash
# Install GitHub CLI (if not already installed)
# https://cli.github.com/

# Login to GitHub
gh auth login

# Create secrets
gh secret set MONGO_ROOT_PASSWORD --repo ipproyectosysoluciones/psychology-assistant
gh secret set JWT_SECRET --repo ipproyectosysoluciones/psychology-assistant
gh secret set REFRESH_TOKEN_SECRET --repo ipproyectosysoluciones/psychology-assistant

# Verify secrets are created
gh secret list --repo ipproyectosysoluciones/psychology-assistant
```

**Option 3: Generate Secure Passwords**

```bash
# Generate JWT_SECRET (32 bytes = 64 hex chars)
openssl rand -hex 32

# Generate REFRESH_TOKEN_SECRET (32 bytes)
openssl rand -hex 32

# Generate MONGO_ROOT_PASSWORD (16 bytes)
openssl rand -base64 16
```

---

## GitHub Environments Setup

### Create Staging Environment

1. Go to: **Settings → Environments**
2. Click: **"New environment"**
3. Name: `staging`
4. Configure protection rules (optional):
   - Required reviewers: yourself or team
   - Deployment branches: `development/*` or `staging`

### Create Production Environment

1. Go to: **Settings → Environments**
2. Click: **"New environment"**
3. Name: `production`
4. Configure protection rules (RECOMMENDED):
   - ✅ **Require reviewers**: Check this
   - ✅ Add yourself/team as required approvers
   - ✅ **Deployment branches**: Select `main`

### Environment-Specific Secrets (Optional)

For each environment, you can override secrets:

**Staging Environment Secrets:**

- Optional: Different `MONGO_ROOT_PASSWORD` for staging DB
- Optional: Different `JWT_SECRET` for staging

**Production Environment Secrets:**

- MONGO_ROOT_PASSWORD (production database)
- JWT_SECRET (production tokens)
- REFRESH_TOKEN_SECRET (production refresh tokens)

---

## Branch Protection Rules

### Protect Main Branch

1. Go to: **Settings → Branches**
2. Click: **"Add rule"**
3. Pattern: `main`
4. Enable:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date
   - ✅ Require pull request reviews before merging (min 1)
   - ✅ Require code review dismissal when new commits pushed
   - ✅ Require conversation resolution before merging
   - ✅ Require status checks: `ci-cd` (or all CI workflows)
   - ✅ Include administrators in restrictions
   - ✅ Auto-delete head branches on merge

**Result:** Only approved PRs with passing CI/CD can merge to main

### Protect Development Branch (Optional)

1. Pattern: `development/**` or `development`
2. Less strict than main:
   - ✅ Require pull request reviews (min 1)
   - ✅ Require status checks to pass
   - ✅ Auto-delete head branches

---

## Deployment Workflows

### Current Workflows

#### 1. **test.yml** - Automated Tests

- Trigger: PR to main, push to main
- Tests: Backend (Node 18/20) + Frontend (Angular)
- Coverage: Codecov integration
- **Status**: ✅ Ready

#### 2. **lint.yml** - Code Quality

- Trigger: PR to main, push to main
- Checks: ESLint, TypeScript, Prettier, npm audit
- **Status**: ✅ Ready

#### 3. **build.yml** - Build Artifacts

- Trigger: PR to main, push to main
- Builds: Backend App + Frontend App + Docker images
- **Status**: ✅ Ready

#### 4. **ci-cd.yml** - Orchestrator

- Coordinates: test.yml + lint.yml + build.yml
- **Status**: ✅ Ready

#### 5. **deploy.yml** - Production Deployment ✨ NEW

- Trigger: Manual (workflow_dispatch) or push to main
- Actions: Build & push images to GitHub Container Registry
- Environments: Staging or Production
- **Status**: ✅ Ready

---

## Manual Deployment

### Prerequisites

```bash
# Ensure you have Docker and Docker Compose
docker --version    # >= 20.10
docker-compose --version  # >= 2.0

# Clone repository
git clone https://github.com/ipproyectosysoluciones/psychology-assistant.git
cd psychology-assistant
```

### Staging Deployment (Development-like)

```bash
# 1. Create .env.staging file (or update .env)
cp .env.example .env
# Edit .env with staging values

# 2. Pull latest code
git pull origin main

# 3. Build images
docker-compose build

# 4. Start services
docker-compose up -d

# 5. Verify services
docker-compose ps
curl http://localhost:5000/health
curl http://localhost:4200/
```

### Production Deployment

```bash
# 1. Create .env.production file
cat > .env.production << EOF
NODE_ENV=production
MONGO_ROOT_PASSWORD=<your_secure_password>
JWT_SECRET=<your_32char_secret>
REFRESH_TOKEN_SECRET=<your_32char_secret>
CORS_ORIGIN=https://yourdomain.com
EOF

# 2. Export variables
export $(cat .env.production | xargs)

# 3. Pull latest code
git pull origin main

# 4. Build images (or pull from registry)
docker-compose build

# 5. Start services
docker-compose up -d

# 6. Verify services
docker-compose ps
curl http://localhost:5000/health

# 7. Monitor logs
docker-compose logs -f
```

### Rolling Deployment (Zero-Downtime)

```bash
# 1. Build new images
docker-compose build

# 2. Pull latest images (if using registry)
docker-compose pull

# 3. Start new containers alongside old ones
docker-compose up -d --scale app=2

# 4. Wait for health checks to pass
sleep 30

# 5. Remove old containers
docker-compose down

# 6. Ensure only new containers running
docker-compose up -d
```

---

## Automated Deployment with GitHub Actions

### Trigger Manual Deployment

1. Go to: **Actions → Deploy to Production**
2. Click: **"Run workflow"**
3. Select: Environment (staging or production)
4. Click: **"Run workflow"**
5. Wait for deployment to complete

### Automated on Push to Main

The `deploy.yml` workflow automatically:

1. Builds backend and frontend images
2. Pushes to GitHub Container Registry (ghcr.io)
3. Notifies deployment status
4. Provides pull commands for deployment

### View Deployment Status

1. Go to: **Actions → Deploy to Production**
2. Check latest workflow run
3. Click run to see detailed logs
4. Download artifacts if needed

---

## Verification Checklist

### Before Deployment

- [ ] All tests passing (CI workflow)
- [ ] Code quality checks passing (Lint workflow)
- [ ] Docker images build successfully
- [ ] GitHub secrets configured
- [ ] Environment variables validated
- [ ] MongoDB connection tested

### After Deployment

- [ ] Services started successfully: `docker-compose ps`
- [ ] API health check: `curl http://localhost:5000/health`
- [ ] Frontend accessible: `curl http://localhost:4200/`
- [ ] Database connected: Check MongoDB logs
- [ ] No error logs: `docker-compose logs | grep ERROR`
- [ ] Load tests (optional): Verify under load

### Health Check Endpoints

```bash
# Backend health
curl http://localhost:5000/health

# Frontend health
curl http://localhost:4200/health

# Both should return 200 OK
```

---

## Rollback Procedures

### Quick Rollback

```bash
# 1. Switch to previous version (if tagged)
git checkout v0.3.0

# 2. Restart containers
docker-compose down
docker-compose build
docker-compose up -d

# 3. Verify
docker-compose logs
```

### Database Rollback

```bash
# 1. Stop containers
docker-compose down

# 2. Restore from backup (if available)
# mongorestore --uri mongodb://admin:password@localhost:27017/psychology-assistant --archive=backup.archive

# 3. Restart
docker-compose up -d
```

---

## Monitoring & Logs

### View Real-time Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f mongodb
docker-compose logs -f frontend
```

### Key Logs to Monitor

**Backend Startup (app)**

```
✅ Server running on port 5000
✅ MongoDB connected
✅ Swagger API documentation at /api-docs
```

**Frontend Startup (frontend)**

```
✅ Angular development server running
✅ http://localhost:4200/
```

**MongoDB Startup (mongodb)**

```
✅ MongoDB server started successfully
```

### Disk Space

```bash
# Check Docker disk usage
docker system df

# Clean up unused images
docker image prune -a

# Clean up unused volumes
docker volume prune
```

---

## Troubleshooting Deployment

### Services Won't Start

```bash
# Check logs
docker-compose logs --tail=100

# Validate configuration
docker-compose config --quiet

# Check port conflicts
lsof -i :5000
lsof -i :4200
lsof -i :27017
```

### Database Connection Failed

```bash
# Test MongoDB connection
docker-compose exec mongodb mongosh -u admin -p

# Check MongoDB logs
docker-compose logs mongodb --tail=50

# Verify credentials
echo $MONGO_ROOT_PASSWORD
```

### Image Pull Failures

```bash
# Log in to registry
docker login ghcr.io -u <username> -p <token>

# Retry pull
docker-compose pull

# Build locally instead
docker-compose build --no-cache
```

---

## Security Best Practices

### Secrets Management

✅ **DO:**

- Use GitHub Secrets for sensitive data
- Rotate secrets regularly (quarterly)
- Use separate secrets for each environment
- Use strong, random passwords (min 32 chars)
- Never commit `.env` files to git

❌ **DON'T:**

- Hardcode secrets in code or configs
- Commit `.env` to repository
- Reuse same secret across environments
- Share secrets via Slack/Email
- Use simple passwords

### Network Security

✅ **Enable:**

- HTTPS/TLS in production
- Rate limiting on API endpoints
- CORS restrictions
- JWT token expiration
- 2FA for admin accounts

❌ **Don't expose:**

- MongoDB directly to internet
- Health endpoints in public
- Debug logs in production
- Sensitive error information

---

## Next Steps

1. ✅ Create GitHub secrets (5 min)
2. ✅ Setup GitHub environments (5 min)
3. ✅ Configure branch protection (5 min)
4. ⏳ Test deployment locally (10 min)
5. ⏳ Trigger GitHub Actions deployment (5 min)
6. ⏳ Verify production deployment (10 min)

---

## Support & Documentation

- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Docker Compose Docs**: https://docs.docker.com/compose/
- **GHCR Docs**: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry

---

**Last Updated**: March 12, 2026  
**Version**: 0.3.0  
**Status**: 🟢 Production Ready
