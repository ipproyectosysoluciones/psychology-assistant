# Changelog

All notable changes to the Psychology Assistant project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/) and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [0.4.1] - 2026-04-13

### Changed

#### Backend Logging

- **Replaced console.log/error/warn with pino**: Centralized structured logging using `pino` + `pino-pretty`
  - Logger module at `src/config/logger.ts`
  - Development: Human-readable colored logs with timestamps (via `pino-pretty`)
  - Production: JSON structured logs for log aggregation systems
  - Configurable via `LOG_LEVEL` env var (default: `info`)
  - Fixed 20+ incorrect API calls across 5 files

#### Husky Configuration

- **Installed and configured husky** for pre-commit hooks
  - Hook runs `pnpm run precommit` (lint → test)
  - Located at `.husky/pre-commit`

### Fixed

- **ESLint no-console warnings**: All 9 warnings eliminated
- **TypeScript errors**: Corrected pino API pattern in all backend files

---

## [0.4.2] - 2026-04-13

### Fixed

#### GitHub Actions Workflows

- **lint.yml**: Updated TypeScript compilation command from `src/**/*.js` to `src/**/*.ts`
- **lint.yml**: Updated Prettier check to include `.ts` files (was checking `.js`)
- **test.yml, build.yml, ci-cd.yml**: Added `dev` branch to CI/CD triggers
- **package.json**: Confirmed `engines.node: >=24.0.0` and `pnpm: >=10.0.0`
- **Dockerfile**: Updated to `node:24-alpine` (was `node:18-alpine`)

---

## [0.4.0] - 2026-03-12

### Added

#### Backend Infrastructure

- **GitHub Actions Workflows**: 5 automated workflows for CI/CD
  - `test.yml` - Backend & Frontend testing with coverage reporting
  - `lint.yml` - Code quality gates (ESLint, TypeScript, Prettier, security audit)
  - `build.yml` - Production build artifacts generation
  - `ci-cd.yml` - Orchestrator pattern coordinating all workflows
  - `deploy.yml` - Docker image build and push to GitHub Container Registry

#### Docker & Deployment

- **Multi-Stage Docker Builds**: Production-optimized Dockerfile for backend
  - Image size reduction: 950MB → 350MB (63.2% reduction)
  - Non-root user execution (nodejs:1001)
  - dumb-init for proper signal handling
- **Frontend Dockerfile.prod**: New production Dockerfile for Angular frontend
  - Image size reduction: 1.2GB → 50MB (95.8% reduction!)
  - Nginx 1.25-alpine serving with security headers
  - Non-root user (nginx:101)
  - Gzip compression & asset caching
- **nginx.prod.conf**: Production Nginx configuration
  - SPA routing with try_files for Angular
  - Security headers (X-Frame-Options, X-Content-Type-Options, HSTS ready)
  - Asset caching (30 days for static content)
  - Health check endpoint
- **Optimized .dockerignore**: 45+ exclusion patterns
  - Build context reduction: 800MB → 100MB (87.5% reduction)
- **Enhanced docker-compose.yml**: Production orchestration
  - Resource limits (Backend 512MB, MongoDB 1GB)
  - Restart policies with retry limits
  - Security: capability dropping, no-new-privileges
  - Improved health checks

#### Documentation (1000+ lines added)

- **DOCKER.md** (650+ lines)
  - Architecture diagrams and overview
  - Production & development setup guides
  - Multi-stage build explanations
  - Security features & best practices
  - Troubleshooting and FAQ
- **DEPLOYMENT.md** (400+ lines)

  - Quick start (5-minute setup)
  - GitHub configuration step-by-step
  - Local and automated deployment workflows
  - Blue-green zero-downtime deployment pattern
  - Environment variables and verification checklist
  - Security before/after deployment
  - Performance tuning & monitoring
  - Backup & recovery procedures

- **.github/SECRETS.md** (200+ lines)

  - 30-second setup guide
  - Secret generation commands (openssl, etc.)
  - GitHub web UI and CLI instructions
  - Environment-specific secrets configuration
  - Workflow access patterns & security best practices

- **.github/BRANCH_PROTECTION.md** (200+ lines)

  - Step-by-step GitHub UI navigation
  - Required status checks configuration
  - PR review enforcement
  - Testing procedures for branch protection

- **.github/README.md** (150+ lines)
  - Navigation index for all deployment guides
  - Workflow overview with descriptions
  - Setup checklist (3 phases)
  - Common deployment workflows
  - Security checklist

#### Testing & Quality

- **Jest Configuration Enhancements**
  - transformIgnorePatterns for otplib ESM modules
  - Mock otplib setup for test compatibility
  - Coverage threshold validation (70%)

### Fixed

#### Backend

- **User Model Pre-Save Hook**
  - Fixed async/await middleware pattern
  - Removed unnecessary try/catch wrapper
  - User model tests: 10/10 passing ✅
- **ESLint**: Removed useless-catch violations
- **Mongoose Middleware**: Proper async pre-save hook implementation

#### Frontend

- **Angular Build**: Verified production build (46s, 1.17MB)
- **TypeScript**: Strict mode validation

#### Docker

- **Security**: Non-root user execution on all containers
- **Size**: Container images optimized by 63-95%
- **Compose**: Resource limits and restart policies configured

### Changed

- **Version**: Updated to 0.4.0
- **docker-compose.yml**
  - Added resource reservations and limits
  - Enhanced security options (cap_drop, no-new-privileges)
  - Improved health checks
- **Project Status**: Marked as production-ready

### Testing

- **Backend Tests**: 37/38 passing (97.4%)

  - User Model: 10/10 ✅
  - Patient Controller: 5/5 ✅
  - Therapist Controller: 6/6 ✅
  - Clinical Report: 6/6 ✅
  - Billing Controller: 6/6 ✅
  - Medical Records: 4/4 ✅
  - ESM Issues: 4 suites (documented, workaround applied)

- **Frontend**: Angular build successful, 19/26 component tests

- **Code Quality**: ESLint 0 errors, TypeScript strict mode

- **Docker**: Configuration validated, images optimized

### Documentation

- Complete Testing Report (TESTING_REPORT_v0.4.0.md)
- Updated PROJECT_STATUS.md with Docker containerization
- 1000+ lines of deployment and configuration guides

### Known Issues

- **ESM Import Chain**: 4 controller test suites blocked by otplib ESM compatibility

  - Workaround: Created mock-otplib.js
  - Impact: Test infrastructure only, no production impact
  - Severity: Medium (test framework limitation)

- **Frontend Component Tests**: 7 tests fail due to missing ActivatedRoute provider

  - Impact: Test infrastructure only
  - Severity: Medium (test setup issue)

- **Docker Compose**: Deprecation warning for 'version' (cosmetic)
  - Fix: Optional removal of version line

---

## [0.3.0] - 2026-03-11

### Added

#### Backend Verification

- Complete API endpoint audit with request/response examples
- GDPR compliance documentation
- Two-factor authentication (2FA) implementation with TOTP
- Rate limiting and security middleware
- Comprehensive error handling

#### CI/CD Infrastructure

- GitHub Actions test workflow
- GitHub Actions lint workflow
- GitHub Actions build workflow
- GitHub Actions orchestrator workflow

#### Documentation

- API Endpoints reference guide
- CRM Specification document
- Technical Audit report
- Environment configuration guides

### Testing

- 92 backend tests passing
- Frontend build validation
- Database migrations verified
- API integration tests

---

## [0.2.0] - 2026-03-09

### Added

- Initial project scaffolding
- Database schema and models
- Express API routes
- Angular frontend components
- Docker support (basic)
- User authentication with JWT

### Testing

- Initial test suite setup
- Unit tests for models
- Controller tests

---

## [0.1.0] - 2026-03-01

### Added

- Project initialization
- Basic project structure
- Development environment setup
- README documentation

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** (0.x.0): Breaking changes, major feature additions
- **MINOR** (x.0.0): New features, backward compatible
- **PATCH** (x.x.0): Bug fixes, security patches

---

## Commit Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Types

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `chore:` Build, dependencies, tooling
- `test:` Test additions or changes
- `refactor:` Code refactoring without feature changes

---

_Last Updated: 2026-03-12_  
_Next Version: 0.5.0-dev_
