# TypeScript Backend Migration — Specification

## Change: migrate-backend-typescript

This is a NEW specification (no prior backend TypeScript spec exists).

---

## 1. TypeScript Configuration

### Requirement: Strict tsconfig.json

The project MUST have a `tsconfig.json` at the root with `strict: true`, `esModuleInterop: true`, targeting `ES2022`, and outputting to `dist/`.

| Field               | Required Value |
| ------------------- | -------------- |
| `target`            | `ES2022`       |
| `module`            | `NodeNext`     |
| `moduleResolution`  | `NodeNext`     |
| `strict`            | `true`         |
| `outDir`            | `./dist`       |
| `rootDir`           | `./src`        |
| `esModuleInterop`   | `true`         |
| `skipLibCheck`      | `true`         |
| `resolveJsonModule` | `true`         |

The project MUST also define `paths` aliases that mirror the current import structure (no barrel re-exports required).

#### Scenario: Valid tsconfig produces zero errors on baseline code

- GIVEN `tsconfig.json` with the required fields is present
- WHEN `tsc --noEmit` runs against `src/`
- THEN compilation exits with code `0` and emits no type errors

#### Scenario: Strict mode rejects implicit `any`

- GIVEN a new `.ts` file with an un-typed function parameter
- WHEN `tsc --noEmit` runs
- THEN TypeScript emits `TS7006` and exits non-zero

---

## 2. File Migration Priority Order

### Requirement: Layered Migration Sequence

Files MUST be migrated in the following order to minimise cascading type errors:

| Priority | Layer              | Files                                    |
| -------- | ------------------ | ---------------------------------------- |
| 1        | Types / Interfaces | `src/types/*.ts` (new files)             |
| 2        | Models             | `src/models/*.js → .ts`                  |
| 3        | Utils              | `src/utils/*.js → .ts`                   |
| 4        | Services           | `src/services/*.js → .ts`                |
| 5        | Middlewares        | `src/middlewares/*.js → .ts`             |
| 6        | Controllers        | `src/controllers/*.js → .ts`             |
| 7        | Routes             | `src/routes/*.js → .ts`                  |
| 8        | Config / Entry     | `src/config/*.js`, `app.js`, `server.js` |

Each Mongoose model MUST export an interface (e.g. `IUser`) and its Document type (e.g. `IUserDocument extends IUser, Document`).

#### Scenario: Model renamed successfully

- GIVEN `src/models/user.js` is renamed to `user.ts` with `IUser` interface
- WHEN `tsc --noEmit` runs
- THEN no errors originate from `user.ts`
- AND all controllers that import `User` resolve the type correctly

#### Scenario: Circular imports surface as type errors

- GIVEN a controller imports a model that imports back from the controller
- WHEN `tsc --noEmit` runs
- THEN TypeScript emits a diagnostic; the developer MUST resolve it before merging

---

## 3. Testing During Migration

### Requirement: Tests Remain Green Throughout Migration

The test suite MUST pass at every migration step. `jest` MUST be reconfigured to use `ts-jest` for `.ts` files while still supporting remaining `.js` files via `babel-jest`.

| Test command   | Expected result              |
| -------------- | ---------------------------- |
| `pnpm test`    | ≥ 92/93 tests passing        |
| `pnpm test:ci` | Exit 0, coverage not reduced |

`ts-jest` is already in `devDependencies` — no new package installs required for test runner changes.

`jest.config.js` MUST add a `transform` entry:

```js
transform: {
  '^.+\\.tsx?$': 'ts-jest',
  '^.+\\.jsx?$': 'babel-jest',
}
```

#### Scenario: Mixed JS/TS test run passes

- GIVEN the repo contains both `.js` and `.ts` source files
- WHEN `pnpm test` runs
- THEN all existing tests pass without modification

#### Scenario: New TS test enforces types

- GIVEN a test file ends in `.test.ts`
- WHEN a wrong argument type is passed to a controller
- THEN `ts-jest` reports a type error and the test run fails

---

## 4. Build Requirements

### Requirement: `tsc` Compilation to `dist/`

The project MUST produce a compiled output in `dist/` via `tsc`. The `package.json` `build` script MUST be updated from the no-op echo to `tsc`.

| Script  | New value                                                                 |
| ------- | ------------------------------------------------------------------------- |
| `build` | `tsc`                                                                     |
| `start` | `node dist/server.js`                                                     |
| `dev`   | `ts-node-esm src/server.ts` OR `nodemon --exec ts-node-esm src/server.ts` |

`dist/` MUST be added to `.gitignore`. Source maps SHOULD be enabled (`sourceMap: true`) for production debugging.

#### Scenario: Clean build emits all files

- GIVEN `dist/` is empty
- WHEN `pnpm run build` executes
- THEN `dist/` contains a `server.js` and mirrors the `src/` folder structure
- AND the process exits with code `0`

#### Scenario: `start` runs compiled output

- GIVEN a successful `pnpm run build`
- WHEN `pnpm start` executes
- THEN the server starts on `PORT` using `dist/server.js`
- AND the `/api/health` endpoint returns `200 OK`

---

## 5. Rollback Plan

### Requirement: Safe Rollback to Vanilla JS

The migration MUST be performed on a dedicated branch (`feat/migrate-backend-typescript`). At any point the branch MUST be droppable with zero impact to `main`.

| Rollback trigger          | Action                                |
| ------------------------- | ------------------------------------- |
| Test regression > 2 tests | Stop migration, open issue, revert PR |
| Build fails in CI         | Block merge, do not push to `main`    |
| Runtime error in staging  | `git revert` the merge commit         |

The `main` branch SHALL NOT merge this change until all 93 tests pass AND `tsc --noEmit` exits `0`.

#### Scenario: Branch rollback leaves main intact

- GIVEN the migration branch has uncommitted failures
- WHEN the branch is deleted
- THEN `main` continues running as vanilla JS with zero changes

#### Scenario: CI gate blocks broken migration

- GIVEN a PR from `feat/migrate-backend-typescript` has TypeScript errors
- WHEN the CI pipeline runs (`test → lint → build`)
- THEN the `build` step fails and merge is blocked
- AND no partial migration reaches `main`
