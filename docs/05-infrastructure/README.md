# 🐳 Infrastructure & DevOps

Infrastructure setup, containerization, and CI/CD configuration.

## 📋 Table of Contents

1. [DOCKER.md](./DOCKER.md) - Docker containerization guide
2. [CI_CD.md](./CI_CD.md) - GitHub Actions workflows
3. [SECRETS.md](./SECRETS.md) - Secrets management
4. [MONITORING.md](./MONITORING.md) - Health checks & monitoring

---

## Infrastructure Overview

Psychology Assistant uses modern DevOps practices:

### 🐳 Docker
- Multi-stage builds
- Production optimization (63-95% size reduction)
- Non-root users for security
- Health checks on all services

### ⚙️ CI/CD
- 5 GitHub Actions workflows
- Automated testing & linting
- Docker image building & registry push
- One-click deployment

### 🔐 Security
- GitHub secrets management
- Branch protection rules
- Non-root container execution
- Capability dropping

---

## Quick Setup

### 1️⃣ Local Development (Docker)

```bash
docker-compose up -d
npm run dev
```

### 2️⃣ Production Deployment

```bash
# Push to main
git push origin main

# GitHub Actions auto-builds & deploys
# Monitor at: GitHub Actions tab
```

### 3️⃣ Configure Secrets

```bash