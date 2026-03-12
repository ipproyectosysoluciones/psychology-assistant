# 🔐 GitHub Secrets Configuration Guide

This guide explains how to configure the required GitHub secrets for the Psychology Assistant project deployment.

## Quick Setup (5 minutes)

### 1. Go to GitHub Repository Settings

Navigate to: `https://github.com/ipproyectosysoluciones/psychology-assistant/settings/secrets/actions`

### 2. Create Required Secrets

Click "New repository secret" and add each:

| Secret Name            | Value                                | Example            |
| ---------------------- | ------------------------------------ | ------------------ |
| `MONGO_ROOT_PASSWORD`  | MongoDB root password (min 8 chars)  | `MySecurePass123!` |
| `JWT_SECRET`           | JWT signing secret (32+ chars hex)   | `a1b2c3d4e5f6...`  |
| `REFRESH_TOKEN_SECRET` | Refresh token secret (32+ chars hex) | `f1e2d3c4b5a6...`  |

### 3. Verify Secrets

Click "Repository secrets" to see all configured secrets ✅

---

## Detailed Setup

### Generate Secure Values

**Linux/Mac:**

```bash
# Generate MongoDB password (16 chars, base64)
openssl rand -base64 16

# Generate JWT_SECRET (32 bytes = 64 hex chars)
openssl rand -hex 32

# Generate REFRESH_TOKEN_SECRET
openssl rand -hex 32
```

**Windows (PowerShell):**

```powershell
# Generate random password
-join ((1..16) | ForEach-Object { [char]([byte]::RandomBytes(1)) })

# Or use online generator: https://passwordsgenerator.net/
```

### Environment-Specific Secrets (Optional)

For **staging** and **production** environments, you can set environment-level secrets:

1. Go to: **Settings → Environments**
2. Select environment (staging or production)
3. Click "Add secret"
4. Follow same process as above

---

## Available Secrets

### Core Secrets (Required)

```
MONGO_ROOT_PASSWORD
  Used by: docker-compose.yml
  Purpose: MongoDB root user authentication
  Min length: 8 characters
  Rotate: Every 6 months
```

```
JWT_SECRET
  Used by: Backend authentication middleware
  Purpose: JWT token signing/verification
  Min length: 32 characters (recommended 64)
  Format: Hexadecimal (preferred) or random string
  Rotate: Every 3 months
```

```
REFRESH_TOKEN_SECRET
  Used by: Backend refresh token service
  Purpose: Refresh token signing/verification
  Min length: 32 characters (recommended 64)
  Format: Hexadecimal (preferred) or random string
  Rotate: Every 3 months
  Note: Must differ from JWT_SECRET
```

### Optional Secrets (Docker Registry)

```
DOCKER_REGISTRY_URL (optional)
  Used by: Deploy workflow (deploy.yml)
  Purpose: Docker registry endpoint
  Default: ghcr.io (GitHub Container Registry)
  Examples:
    - ghcr.io (GitHub)
    - docker.io (Docker Hub)
    - registry.example.com (Private registry)
```

```
DOCKER_REGISTRY_USER (optional)
  Used by: Deploy workflow authentication
  Purpose: Registry login username
  For GitHub: Use your GitHub username
  For Docker Hub: Use Docker Hub username
```

```
DOCKER_REGISTRY_PASSWORD (optional)
  Used by: Deploy workflow authentication
  Purpose: Registry login token/password
  Important: Use Personal Access Token (PAT), not password
  For GitHub: Create at https://github.com/settings/tokens
  For Docker Hub: Create at https://app.docker.com/settings/personal-access-tokens
```

### Code Coverage (Optional)

```
CODECOV_TOKEN (optional)
  Used by: test.yml workflow (codecov reporting)
  Purpose: Upload coverage reports to codecov.io
  Where: Create at https://app.codecov.io/
  Note: Only needed for coverage reporting
```

---

## Workflow Access to Secrets

Secrets are automatically available to workflows as environment variables:

```yaml
# In GitHub Actions workflows:
env:
  MONGO_ROOT_PASSWORD: ${{ secrets.MONGO_ROOT_PASSWORD }}
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
  REFRESH_TOKEN_SECRET: ${{ secrets.REFRESH_TOKEN_SECRET }}
```

Workflows can then pass them to services:

```yaml
services:
  mongodb:
    environment:
      MONGO_INITDB_ROOT_PASSWORD: ${{ secrets.MONGO_ROOT_PASSWORD }}
  backend:
    environment:
      JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

---

## Security Best Practices

### ✅ DO

- Use **GitHub Secrets** for sensitive data
- Generate **random, strong passwords** (min 32 chars)
- Use **environment-specific secrets** for staging/production
- **Rotate secrets quarterly**
- Use **Personal Access Tokens** (PAT) instead of passwords
- **Audit** secret access regularly

### ❌ DON'T

- Commit `.env` files to repository
- Hardcode secrets in code
- Share secrets via Slack/Email
- Use same secret across environments
- Commit `docker-compose.yml` with real secrets
- Log secrets in CI/CD output

---

## Verification Checklist

- [ ] MONGO_ROOT_PASSWORD created
- [ ] JWT_SECRET created (32+ chars)
- [ ] REFRESH_TOKEN_SECRET created (32+ chars, different from JWT_SECRET)
- [ ] All secrets are strong & random
- [ ] `.env` file in `.gitignore`
- [ ] No secrets in git history
- [ ] Secrets rotated within last quarter

---

## Troubleshooting

### Secret Not Found in Workflow

```
Error: "Secret 'MONGO_ROOT_PASSWORD' not found"
```

**Solution:**

1. Verify secret name matches exactly (case-sensitive)
2. Check secret is in correct repository (not organization secret)
3. Refresh browser and try again

### Secrets Exposed in Logs

```
❌ DANGER: Secret logged in job output
```

**Solution:**

1. GitHub automatically masks secret values in logs
2. If exposed, **regenerate secret immediately**
3. Review how secret is used (avoid `echo $SECRET`)

### Can't Create Secret - Permission Denied

```
Error: "You do not have permission to..."
```

**Solution:**

- Must have "Admin" or "Maintain" access to repository
- Contact repository administrator
- Or self-host the secret locally for testing

---

## Testing Secret Configuration

### Test in Workflow

Add this job to any workflow to verify secrets are accessible:

```yaml
- name: Verify Secrets
  run: |
    test -n "$MONGO_ROOT_PASSWORD" && echo "✅ MONGO_ROOT_PASSWORD is set"
    test -n "$JWT_SECRET" && echo "✅ JWT_SECRET is set"
    test -n "$REFRESH_TOKEN_SECRET" && echo "✅ REFRESH_TOKEN_SECRET is set"
  env:
    MONGO_ROOT_PASSWORD: ${{ secrets.MONGO_ROOT_PASSWORD }}
    JWT_SECRET: ${{ secrets.JWT_SECRET }}
    REFRESH_TOKEN_SECRET: ${{ secrets.REFRESH_TOKEN_SECRET }}
```

### Test Locally

```bash
# Create .env file with local values (NOT committed)
cat > .env << EOF
MONGO_ROOT_PASSWORD=local_test_password
JWT_SECRET=test_jwt_secret_min_32_chars_needed_here
REFRESH_TOKEN_SECRET=test_refresh_token_secret_min_32_chars
EOF

# Test with docker-compose
docker-compose config --quiet

# Verify services start
docker-compose up -d
docker-compose ps
```

---

## Related Documentation

- [DEPLOYMENT.md](../DEPLOYMENT.md) - Full deployment guide
- [DOCKER.md](../DOCKER.md) - Docker setup & configuration
- [GitHub Actions Secrets Docs](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)

---

**Last Updated:** March 12, 2026  
**Version:** 0.3.0  
**Status:** 🟢 Production Ready
