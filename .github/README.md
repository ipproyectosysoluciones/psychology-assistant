# 🚀 GitHub Deployment & CI/CD Documentation

Complete guides for setting up GitHub secrets, branch protection, and automated deployment.

## 📋 Quick Navigation

### 🔐 GitHub Secrets (.github/SECRETS.md)

**5-minute setup** - How to configure required secrets

```bash
# Required secrets:
MONGO_ROOT_PASSWORD      # Database root password
JWT_SECRET               # JWT token secret (32+ chars)
REFRESH_TOKEN_SECRET     # Refresh token secret (32+ chars)
```

**[→ Complete Secrets Guide](./.github/SECRETS.md)**

### 🛡️ Branch Protection (.github/BRANCH_PROTECTION.md)

**5-minute setup** - How to protect main branch from accidents

```
Protection covers:
✅ Require PR reviews (min 1)
✅ Require CI/CD to pass
✅ Require conversation resolution
✅ Auto-cleanup merged branches
```

**[→ Complete Branch Protection Guide](./.github/BRANCH_PROTECTION.md)**

### 🚀 Deployment (../DEPLOYMENT.md)

**Complete deployment guide** - Local, staging, and production

```
Topics covered:
✓ Quick start (5 min)
✓ Local deployment with docker-compose
✓ Automated GitHub Actions deployment
✓ Verification checklist
✓ Troubleshooting
```

**[→ Complete Deployment Guide](../DEPLOYMENT.md)**

---

## 🚀 Deployment Workflows

### Automated Workflows (in .github/workflows/)

#### 1. **test.yml** - Automated Testing ✅

- **Trigger**: Push to main, PR to main
- **Tests**: Backend (Jest) + Frontend (Vitest)
- **Coverage**: Codecov integration
- **Status**: Ready to use

#### 2. **lint.yml** - Code Quality ✅

- **Trigger**: Push to main, PR to main
- **Checks**: ESLint, TypeScript, Prettier, npm audit
- **Status**: Ready to use

#### 3. **build.yml** - Build Artifacts ✅

- **Trigger**: Push to main, PR to main
- **Builds**: Backend + Frontend + Docker images
- **Status**: Ready to use

#### 4. **ci-cd.yml** - Orchestrator ✅

- **Purpose**: Coordinated CI/CD pipeline
- **Orchestrates**: test.yml + lint.yml + build.yml
- **Status**: Ready to use

#### 5. **deploy.yml** - Production Deployment ✨ NEW

- **Trigger**: Push to main OR manual (workflow_dispatch)
- **Actions**: Build & push Docker images to ghcr.io
- **Environments**: Staging or Production
- **Status**: Ready for GitHub Actions

---

## 📊 Setup Checklist

### ✅ Phase 1: GitHub Configuration (15 min)

**1. Configure Secrets**

- [ ] Create MONGO_ROOT_PASSWORD
- [ ] Create JWT_SECRET
- [ ] Create REFRESH_TOKEN_SECRET
- [ ] Verify all 3 secrets created

**[Detailed Instructions →](./.github/SECRETS.md)**

**2. Setup Environments**

- [ ] Create "staging" environment
- [ ] Create "production" environment
- [ ] Add reviewers to production (yourself)

**3. Branch Protection**

- [ ] Enable main branch protection
- [ ] Require PR reviews (min 1)
- [ ] Require CI/CD to pass
- [ ] Include administrators

**[Detailed Instructions →](./.github/BRANCH_PROTECTION.md)**

### ⏳ Phase 2: Local Verification (10 min)

**1. Local Deployment**

```bash
docker-compose build
docker-compose up -d
curl http://localhost:5000/health
```

**2. Verify Services**

- [ ] Backend API responding
- [ ] Frontend accessible
- [ ] Database connected
- [ ] No error logs

### ⏳ Phase 3: Automated Deployment (5 min)

**1. Trigger GitHub Actions**

- [ ] Push to main branch
- [ ] Watch CI/CD run in Actions tab
- [ ] All workflows pass ✅

**2. Deploy via Actions**

- [ ] Go to "Deploy to Production" workflow
- [ ] Click "Run workflow"
- [ ] Select environment (staging/production)
- [ ] Images built & pushed to ghcr.io

---

## 🔄 Common Workflows

### Deploy New Version

```bash
# 1. Make changes and commit
git add .
git commit -m "feat: new feature"

# 2. Push to main
git push origin main

# 3. GitHub Actions automatically:
# - Runs tests (test.yml)
# - Checks code quality (lint.yml)
# - Builds images (build.yml)
# - Orchestrates workflow (ci-cd.yml)
# - Builds & pushes images (deploy.yml)

# 4. Check deployment
Actions tab → Workflows → Latest run
```

### Manual Deployment to Staging

```bash
1. Go to: GitHub → Actions
2. Select: "Deploy to Production" workflow
3. Click: "Run workflow"
4. Select: "staging" environment
5. Wait for images to build
6. Pull and run on server
```

### Manual Deployment to Production

```bash
1. Go to: GitHub → Actions
2. Select: "Deploy to Production" workflow
3. Click: "Run workflow"
4. Select: "production" environment
5. Wait for approval (if configured)
6. Images built & pushed
7. Deploy to server
```

---

## 📝 File Structure

```
.github/
├── workflows/
│   ├── test.yml          # Backend + Frontend tests
│   ├── lint.yml          # Code quality checks
│   ├── build.yml         # Build Docker images
│   ├── ci-cd.yml         # CI/CD orchestrator
│   └── deploy.yml        # Production deployment ✨ NEW
├── SECRETS.md            # GitHub secrets guide
├── BRANCH_PROTECTION.md  # Branch protection guide
└── README.md             # This file

Root/
├── DEPLOYMENT.md         # Complete deployment guide
├── DOCKER.md             # Docker setup & optimization
├── docker-compose.yml    # Production orchestration
└── docker-compose.dev.yml # Development orchestration
```

---

## 🔐 Security Checklist

### Secrets Management

- [ ] GitHub secrets configured
- [ ] `.env` file NOT in git
- [ ] Strong passwords generated (32+ chars)
- [ ] Different secrets per environment
- [ ] Secrets rotated quarterly

### Branch Protection

- [ ] Main branch protected
- [ ] Require reviews enabled
- [ ] CI/CD required before merge
- [ ] Administrators included

### Environment Security

- [ ] Production requires approval
- [ ] Staging accessible to team
- [ ] HTTPS/TLS configured
- [ ] CORS restricted to domain

---

## 🆘 Troubleshooting

### Workflow Failed

1. Check **Actions** tab for error messages
2. Review **job logs** for details
3. Common issues:
   - Secrets not configured → [Setup Secrets](./.github/SECRETS.md)
   - CI checks failing → Run locally: `npm test && pnpm lint`
   - Docker build failing → Check Dockerfile

### Deployment Won't Start

1. Verify services: `docker-compose ps`
2. Check logs: `docker-compose logs --tail=100`
3. Common issues:
   - Port conflict → Change port in docker-compose.yml
   - Database error → Check MONGO_ROOT_PASSWORD
   - Memory limit → Increase docker resources

### Can't Merge PR

1. Ensure "Deploy to Production" workflow passes
2. Get 1+ code review approval
3. Resolve all conversations
4. Select main branch as merge target

**[Detailed Troubleshooting →](../DEPLOYMENT.md#troubleshooting)**

---

## 📚 Related Documentation

| Document                                                       | Purpose                              |
| -------------------------------------------------------------- | ------------------------------------ |
| [DOCKER.md](../DOCKER.md)                                      | Docker containerization details      |
| [DEPLOYMENT.md](../DEPLOYMENT.md)                              | Complete deployment guide & commands |
| [.github/SECRETS.md](./.github/SECRETS.md)                     | GitHub secrets setup guide           |
| [.github/BRANCH_PROTECTION.md](./.github/BRANCH_PROTECTION.md) | Branch protection guide              |
| [README.md](../README.md)                                      | Project overview                     |
| [PROJECT_STATUS.md](../PROJECT_STATUS.md)                      | Current project status               |

---

## 🚀 Next Steps

**Estimated Total Time**: 30 minutes

1. **Config GitHub** (15 min)

   - Configure 3 secrets
   - Setup 2 environments
   - Enable branch protection

2. **Test Locally** (10 min)

   - Build Docker images
   - Start services
   - Verify endpoints

3. **Deploy** (5 min)
   - Push to main OR
   - Manually trigger workflow

---

## ✅ Success Criteria

- [ ] All GitHub secrets configured
- [ ] Branch protection enabled
- [ ] Workflows passing on main
- [ ] Docker images building
- [ ] Local deployment working
- [ ] Services responding to health checks
- [ ] Frontend accessible
- [ ] Database connected

---

## 📞 Support

- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Docker Docs**: https://docs.docker.com
- **Repository**: https://github.com/ipproyectosysoluciones/psychology-assistant

---

**Last Updated**: March 12, 2026  
**Version**: 0.3.0  
**Status**: 🟢 Production Ready
