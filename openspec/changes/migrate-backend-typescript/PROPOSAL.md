# Proposal: Migrate Backend from Vanilla JS to TypeScript

## Intent

The backend (48 source files, 11 test files) uses vanilla JS with `class-validator` for runtime checks but has **zero compile-time type safety**. Mongoose schemas duplicate type definitions that TypeScript could enforce statically. This migration adds type safety to catch bugs at build time, improve DX with autocompletion, and leverage the 7 `@types/*` packages already in devDependencies.

## Scope

### In Scope

- Add `tsconfig.json` with strict mode, ESM output (`NodeNext`)
- Rename 48 source `.js` → `.ts` files (gradual, layer-by-layer)
- Rename 11 test files `.test.js` → `.test.ts`
- Configure `ts-jest` (already installed) as Jest transformer
- Type Mongoose models with `HydratedDocument<T>` and schema interfaces
- Type Express handlers with `Request`, `Response`, `NextFunction`
- Update ESLint to `@typescript-eslint` parser
- Update `babel.config.js` → TypeScript-native build (`tsc` or `tsx`)

### Out of Scope

- Frontend changes (Angular is already TypeScript)
- Rewriting business logic or changing API contracts
- Adding new features during migration
- Switching test framework (Jest stays)

## Capabilities

### New Capabilities

- None (pure refactor — no new behavior)

### Modified Capabilities

- None (API contracts unchanged)

## Approach

**Gradual migration (layer-by-layer)** over 4 phases:

1. **Infrastructure** — `tsconfig.json`, `ts-jest`, ESLint TS parser, `allowJs: true`
2. **Foundation layer** — `utils/`, `config/`, `models/` (interfaces + typed schemas)
3. **Middle layer** — `middlewares/`, `services/`, `routes/`
4. **Application layer** — `controllers/`, `app.ts`, `server.ts`, tests

Each phase ships independently. `allowJs: true` enables JS/TS coexistence during migration.

## Affected Areas

| Area                             | Impact   | Description                        |
| -------------------------------- | -------- | ---------------------------------- |
| `src/config/` (5 files)          | Modified | Add types, rename to `.ts`         |
| `src/models/` (11 files)         | Modified | Add interfaces, typed schemas      |
| `src/utils/` (4 files)           | Modified | Type utility functions             |
| `src/middlewares/` (5 files)     | Modified | Type Express middleware signatures |
| `src/services/` (3 files)        | Modified | Type service functions             |
| `src/routes/` (9 files)          | Modified | Type Router setup                  |
| `src/controllers/` (9 files)     | Modified | Type request handlers              |
| `src/app.js`, `src/server.js`    | Modified | Rename, type Express app           |
| `src/__tests__/` (11 test files) | Modified | Rename, use ts-jest                |
| `jest.config.js`                 | Modified | Switch transform to ts-jest        |
| `.eslintrc.cjs`                  | Modified | Switch to @typescript-eslint       |
| `package.json`                   | Modified | Add typescript, update scripts     |

## Risks

| Risk                                          | Likelihood | Mitigation                                                        |
| --------------------------------------------- | ---------- | ----------------------------------------------------------------- |
| Mongoose type complexity (generics, virtuals) | High       | Use `HydratedDocument<T>` pattern; type models incrementally      |
| `otplib` mock breaks with TS transform        | Med        | Keep mock as `.js` with `allowJs`, update jest moduleNameMapper   |
| ESM + TypeScript interop issues               | Med        | Use `NodeNext` module resolution; test early with `tsx`           |
| Test regressions during rename                | Low        | Migrate one directory at a time; CI must pass per phase           |
| `express@5` types incomplete                  | Med        | Use `@types/express@5.0.6` (already installed); augment as needed |

## Rollback Plan

- Each phase is an independent PR — revert the PR if CI fails
- `allowJs: true` means partial migration is always valid state
- Git branch per phase: `feat/ts-migrate-phase-{N}`
- If fully blocked: revert `tsconfig.json` and rename `.ts` → `.js` back

## Dependencies

- `typescript` ≥ 5.5 (new devDependency to install)
- `ts-jest@29` (already in devDependencies)
- `@types/*` packages (7 already installed, may need `@types/passport`, `@types/passport-jwt`)
- `@typescript-eslint/parser` + `@typescript-eslint/eslint-plugin` (new devDependencies)

## Success Criteria

- [ ] `pnpm tsc --noEmit` passes with zero errors
- [ ] All 93 existing tests pass under `ts-jest`
- [ ] No `any` types except in justified escape hatches (counted, <10)
- [ ] CI pipeline (test → lint → build) passes with TS compilation step
- [ ] Developer experience: full autocompletion in controllers and models
