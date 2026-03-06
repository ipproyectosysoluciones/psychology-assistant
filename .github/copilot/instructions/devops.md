# 🐳 DevOps Agent — Instructions

## Docker Rules

1. Always multi-stage builds for production images
2. Never run as root — create dedicated non-root user
3. Always define health checks for all services
4. Pin base image versions: `node:20-alpine` not `node:latest`

## Dockerfile (Node.js multi-stage)

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 appuser
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
USER appuser
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "dist/main"]
```

## GitHub Actions — CI

```yaml
on: { push: { branches: [main, develop] }, pull_request: { branches: [main] } }
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run test:cov
      - run: npm run build
```

## GitHub Actions — Release

Uses `semantic-release` triggered on push to `main`.
Automates: version bump + CHANGELOG + GitHub Release + git tag.

## .env Rules

- Always commit `.env.example` — never `.env`
- All secrets via GitHub Secrets in workflows
- Never hardcode credentials in docker-compose.yml — use `env_file: .env`
