# AGENTS.md — Psychology Assistant

## Stack

| Layer           | Tech                                                                 |
| --------------- | -------------------------------------------------------------------- |
| Backend         | Node.js 18+ · Express 5 · MongoDB/Mongoose · Vanilla JS (ES modules) |
| Frontend        | Angular 21 · TypeScript strict · Angular Material                    |
| Testing         | Jest (backend) · Karma+Jasmine (frontend) · Cypress (E2E)            |
| Package manager | **pnpm** (v10.32.1 pinned in frontend)                               |

## Key Commands

```bash
# Backend (root)
pnpm install              # Install deps
pnpm test                 # Run all tests (92/93 passing as of Apr 2026)
pnpm run lint             # ESLint + semistandard
pnpm run dev              # nodemon (port 5000)
pnpm start                # Production (node src/server.js)

# Frontend
cd frontend && pnpm install
cd frontend && ng serve --port 4200

# Docker dev (root)
docker-compose -f docker-compose.dev.yml up -d

# Pre-commit (both layers run via husky)
pnpm run precommit        # lint → test
```

## CI Pipeline Order (enforceable)

```
test → lint → build
```

Tests must pass before lint. Lint must pass before build. See `.github/workflows/ci-cd.yml`.

## Architecture

```
src/                     # Backend
  controllers/           # Route handlers + business logic
  models/                # Mongoose schemas
  routes/                # Express routers
  middlewares/           # Auth, rate-limit, sanitization
  services/              # External integrations (email, QR, etc.)
  utils/                 # Helpers, error handler
  config/                # Configuration (logger, database, env)
  __tests__/             # Jest setup, mocks
  app.js                 # Express app (all routes mounted here)
  server.js              # Entry point

frontend/src/app/         # Angular app
  core/                  # Singleton services, guards, interceptors
  shared/                # Shared components, pipes, directives
  features/              # Feature modules

docs/                    # Full documentation (ES/EN bilingual)
tests/                   # Integration tests (disabled in jest.config.js)
```

## Logging

The backend uses **pino** for structured logging. See `src/config/logger.ts`:

```javascript
// API pattern: OBJECT first, MESSAGE second
logger.info({ userId: 123 }, 'User logged in');
logger.error({ error: err.message }, 'Error occurred');

// ❌ WRONG - causes TypeScript error TS2769
logger.info('User logged in', { userId: 123 });
```

- **Development**: Logs are formatted with `pino-pretty` (colored, readable timestamps)
- **Production**: Logs are JSON structured
- **Log level**: Controlled via `LOG_LEVEL` env var (default: `info`)

## Important Configs

- **ESLint**: Extends `semistandard`. Rules: no trailing commas, eol-last enforced.
- **Prettier**: `semi: true`, `singleQuote: true`, `trailingComma: "es5"`, `printWidth: 80`
- **Jest** (`jest.config.js`): Uses babel-jest, mongodb-memory-server, otplib mock at `src/__tests__/mock-otplib.js`
- **Backend is vanilla JS** — no TypeScript, no type checking. Type safety via `class-validator`.
- **ES modules** — all backend files use `.js` extension in imports and `"type": "module"` in package.json.
- **Logging**: Uses `pino` + `pino-pretty` — always import logger from `src/config/logger.js`

## Testing Gotchas

- `NODE_ENV=test` skips MongoDB connection in `app.js` line 28. Tests use `mongodb-memory-server`.
- Integration tests in `tests/` folder are **disabled** in jest.config.js (`testMatch` only picks `src/**`).
- Frontend uses **Karma+Jasmine** (active), not Vitest despite being in devDependencies.
- Test timeout: 10s (configured in jest.config.js).
- otplib v13 API break: production code uses `totp.keyuri()` and `totp.check()` but otplib v13 dropped the `{ totp }` singleton. The mock at `src/__tests__/mock-otplib.js` provides these functions to maintain compatibility.

## Known Bugs (recently discovered)

1. **Express 5 + path-to-regexp v8**: Wildcard `*` in routes no longer valid — use `/(.*)/` instead.
2. **Mongoose 9 middleware**: Auto-populate `pre(/^find/)` hooks cause "Query was already executed" errors — removed from appointment model.
3. **Query sanitization**: `sanitizeObject(req.query)` breaks integer query params — only sanitize string values.
4. **Status enum mismatch**: Route validation used `['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled']` but model only has `['scheduled', 'completed', 'cancelled', 'no-show']`.

## Env Variables (required)

```env
JWT_SECRET=<min 32 chars>      # Required in production
MONGO_URI=mongodb://...          # Falls back to DATABASE_URL
DATABASE_URL=mongodb://...       # Primary DB env var
CORS_ORIGIN=http://localhost:4200  # Frontend dev
PORT=5000
LOG_LEVEL=debug
```

## Known Issues (non-critical)

1. Duplicate schema indexes warnings (invoiceNumber, email, licenseNumber) — multiple `index: true` declarations.
2. Rate limiters are **in-memory** — reset on server restart.
3. Frontend docs reference `frontend/README.md` and `frontend/FRONTEND_TASKS.md`.

## Conventions

- **Comments/docs**: Bilingual ES/EN
- **Code identifiers**: English only
- **Commits**: Conventional commits (`feat:`, `fix:`, `docs:`, `test:`, `chore:`)
- **API routes**: Mounted in `src/app.js` — no new routes without updating app.js
