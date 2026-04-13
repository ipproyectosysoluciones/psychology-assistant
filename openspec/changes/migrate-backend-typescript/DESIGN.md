# Design: Migrate Backend to TypeScript

## Technical Approach

Incremental migration using `tsx` for development and `tsc` for production builds. Files are renamed `.js` → `.ts` bottom-up (leaves first, entry points last) so the app compiles at every checkpoint. The existing ES module system (`"type": "module"`) is preserved — TypeScript emits ESM output. Tests migrate alongside source files using `ts-jest`.

## Architecture Decisions

| Decision                   | Choice                                                         | Alternatives Rejected        | Rationale                                                                                                                                 |
| -------------------------- | -------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Build tool                 | `tsc` (compile) + `tsx` (dev)                                  | esbuild, tsup, swc           | Project is a backend API, not a library. `tsc` gives full type checking; `tsx` gives instant dev reload. No bundling needed.              |
| Module system              | ESM (`"module": "NodeNext"`)                                   | CommonJS                     | Project already uses `"type": "module"` with ES imports. Staying ESM avoids rewriting every import.                                       |
| Strictness                 | `strict: true` from day one                                    | Gradual strictness           | 47 source files — small enough for strict. Catch real bugs now, not later. `any` escape hatch where needed during migration.              |
| Type strategy for Mongoose | Typed schemas with `HydratedDocument<T>` + interface per model | `mongoose.InferSchemaType`   | Explicit interfaces give control over virtuals, methods, statics. `InferSchemaType` struggles with custom methods like `comparePassword`. |
| Test runner                | Keep Jest + switch `babel-jest` → `ts-jest`                    | Vitest                       | 92+ tests already passing in Jest. `ts-jest` supports ESM with `useESM: true`. Switching runners adds migration risk for zero gain.       |
| Migration approach         | In-place rename (`.js` → `.ts`)                                | Parallel `src-ts/` directory | In-place keeps git history, avoids duplicate code, and the app stays deployable at every commit.                                          |

## Data Flow

No runtime data flow changes. The migration is compile-time only:

    src/**/*.ts ──→ tsc ──→ dist/**/*.js ──→ node dist/server.js
         │                                         │
         └── tsx (dev) ── direct execution ────────┘

## File Changes

### Phase 0 — Tooling Setup (no source changes)

| File                         | Action | Description                                             |
| ---------------------------- | ------ | ------------------------------------------------------- |
| `tsconfig.json`              | Create | TypeScript config (see Interfaces section)              |
| `package.json`               | Modify | Add `typescript`, `tsx`, `ts-jest`, update scripts      |
| `jest.config.ts`             | Create | Replace `jest.config.js` — switch to ts-jest with ESM   |
| `babel.config.js`            | Delete | Replaced by ts-jest; no longer needed                   |
| `src/types/express.d.ts`     | Create | Augment `Express.Request` with `user` and `appointment` |
| `src/types/environment.d.ts` | Create | Type the `environment` config object                    |

### Phase 1 — Leaf Modules (no imports from other src files)

| File                        | Action | Description                                             |
| --------------------------- | ------ | ------------------------------------------------------- |
| `src/utils/appError.ts`     | Rename | Add types to `AppError` class, `asyncHandler`           |
| `src/utils/apiResponse.ts`  | Rename | Type `ApiResponse` class, `sendResponse`                |
| `src/utils/errorHandler.ts` | Rename | Type Express error middleware signature                 |
| `src/utils/validators.ts`   | Rename | Type validation rules and `validateRequest`             |
| `src/config/environment.ts` | Rename | Export typed config object with `Environment` interface |
| `src/config/database.ts`    | Rename | Type `connectDB` return                                 |
| `src/config/logger.ts`      | Rename | Type Winston logger instance                            |
| `src/config/swagger.ts`     | Rename | Type swagger setup exports                              |
| `src/config/validateEnv.ts` | Rename | Type validation function                                |

### Phase 2 — Models (depend on utils/config)

| File                           | Action | Description                                  |
| ------------------------------ | ------ | -------------------------------------------- |
| `src/models/user.ts`           | Rename | Add `IUser` interface + typed schema methods |
| `src/models/appointment.ts`    | Rename | Add `IAppointment` interface                 |
| `src/models/billing.ts`        | Rename | Add `IBilling` interface                     |
| `src/models/clinic.ts`         | Rename | Add `IClinic` interface                      |
| `src/models/clinicalreport.ts` | Rename | Add `IClinicalReport` interface              |
| `src/models/medicalrecord.ts`  | Rename | Add `IMedicalRecord` interface               |
| `src/models/patient.ts`        | Rename | Add `IPatient` interface                     |
| `src/models/refreshToken.ts`   | Rename | Add `IRefreshToken` interface                |
| `src/models/session.ts`        | Rename | Add `ISession` interface                     |
| `src/models/therapist.ts`      | Rename | Add `ITherapist` interface                   |
| `src/models/index.ts`          | Rename | Re-export with types                         |

### Phase 3 — Services & Middlewares (depend on models + utils)

| File                                        | Action | Description                                 |
| ------------------------------------------- | ------ | ------------------------------------------- |
| `src/services/validationService.ts`         | Rename | Type all validation functions, return types |
| `src/services/qrService.ts`                 | Rename | Type QR generation                          |
| `src/services/twoFAService.ts`              | Rename | Type 2FA operations                         |
| `src/middlewares/authMiddleware.ts`         | Rename | Type `protect`, `authorize`, `require2FA`   |
| `src/middlewares/auditMiddleware.ts`        | Rename | Type audit events enum and `auditLog`       |
| `src/middlewares/rateLimitMiddleware.ts`    | Rename | Type rate limiter exports                   |
| `src/middlewares/sanitizationMiddleware.ts` | Rename | Type sanitization middleware                |
| `src/middlewares/clinicOwnerMiddleware.ts`  | Rename | Type clinic ownership check                 |

### Phase 4 — Controllers (depend on everything above)

| File                                          | Action | Description                   |
| --------------------------------------------- | ------ | ----------------------------- |
| `src/controllers/authController.ts`           | Rename | Type all auth handlers        |
| `src/controllers/userController.ts`           | Rename | Type user CRUD handlers       |
| `src/controllers/appointmentController.ts`    | Rename | Type appointment handlers     |
| `src/controllers/clinicController.ts`         | Rename | Type clinic handlers          |
| `src/controllers/therapistController.ts`      | Rename | Type therapist handlers       |
| `src/controllers/patientController.ts`        | Rename | Type patient handlers         |
| `src/controllers/medicalrecordController.ts`  | Rename | Type medical record handlers  |
| `src/controllers/billingController.ts`        | Rename | Type billing handlers         |
| `src/controllers/clinicalreportController.ts` | Rename | Type clinical report handlers |

### Phase 5 — Routes & Entry Points

| File              | Action           | Description                         |
| ----------------- | ---------------- | ----------------------------------- |
| `src/routes/*.ts` | Rename (9 files) | Type router setup — minimal changes |
| `src/app.ts`      | Rename           | Type Express app creation           |
| `src/server.ts`   | Rename           | Type server bootstrap               |

### Phase 6 — Tests

| File                                  | Action           | Description      |
| ------------------------------------- | ---------------- | ---------------- |
| `src/__tests__/setup.ts`              | Rename           | Type test setup  |
| `src/__tests__/mock-otplib.ts`        | Rename           | Type mock        |
| `src/controllers/__tests__/*.test.ts` | Rename (9 files) | Type test files  |
| `src/models/__tests__/*.test.ts`      | Rename (1 file)  | Type model tests |

## Interfaces / Contracts

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": false,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@config/*": ["src/config/*"],
      "@models/*": ["src/models/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "frontend", "coverage"]
}
```

### Express Request Augmentation (`src/types/express.d.ts`)

```typescript
import { HydratedDocument } from 'mongoose';
import { IUser } from '../models/user.js';
import { IAppointment } from '../models/appointment.js';

declare global {
  namespace Express {
    interface Request {
      user?: HydratedDocument<IUser>;
      appointment?: HydratedDocument<IAppointment>;
    }
  }
}
```

### Model Interface Pattern (example: User)

```typescript
export interface IUser {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'psychologist' | 'admin';
  twoFAEnabled: boolean;
  twoFASecret?: string;
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  toJSON(): Omit<IUser, 'password' | 'twoFASecret'>;
}

export type UserModel = Model<IUser, {}, IUserMethods>;
```

## Testing Strategy

| Layer       | What to Test                                | Approach                                                     |
| ----------- | ------------------------------------------- | ------------------------------------------------------------ |
| Compilation | All `.ts` files compile with `strict: true` | `tsc --noEmit` in CI after each phase                        |
| Unit        | Existing 92+ tests keep passing             | `ts-jest` with `useESM: true`; rename tests alongside source |
| Type safety | `req.user` typed, model methods typed       | Compiler catches — no extra tests needed                     |
| Regression  | Full suite green at every phase boundary    | Run `pnpm test` as checkpoint gate                           |

## Migration / Rollout

### Phase Checkpoints

| Phase            | Checkpoint                                | Gate Criteria                                             |
| ---------------- | ----------------------------------------- | --------------------------------------------------------- |
| 0 - Tooling      | `tsc --noEmit` runs (even with errors)    | tsconfig valid, ts-jest works on a trivial test           |
| 1 - Leaf modules | `tsc --noEmit` passes for converted files | All 9 leaf files compile, existing tests pass             |
| 2 - Models       | Model interfaces defined and compile      | All 11 model files compile, model tests pass              |
| 3 - Services/MW  | Middleware chain typed                    | All 8 files compile, auth tests pass                      |
| 4 - Controllers  | All business logic typed                  | All 9 controllers compile, 92+ tests pass                 |
| 5 - Routes/Entry | Full app compiles                         | `tsc` builds to `dist/`, app starts from `dist/server.js` |
| 6 - Tests        | All test files are `.ts`                  | Full `pnpm test` green, `pnpm run build` produces `dist/` |

### Script Changes in `package.json`

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "tsx watch src/server.ts",
    "test": "NODE_OPTIONS='--experimental-vm-modules' jest",
    "typecheck": "tsc --noEmit"
  }
}
```

### Package Additions

```
devDependencies:
  typescript: ^5.8
  tsx: ^4.19
  @types/express-session: ^1.18
  @types/passport: ^1.0
  @types/passport-jwt: ^4.0
  @types/swagger-jsdoc: ^6.0
  @types/swagger-ui-express: ^4.1
  @types/xss: ^1.0 (if available, else declare module)
```

Note: `@types/bcryptjs`, `@types/cors`, `@types/express`, `@types/jest`, `@types/jsonwebtoken`, `@types/qrcode`, `@types/supertest` already exist in `devDependencies`.

## Open Questions

- [ ] Should path aliases (`@config/*`, `@models/*`) be adopted now, or deferred to avoid scope creep? (Recommendation: defer — use relative imports like current code)
- [ ] The `otplib` mock (`src/__tests__/mock-otplib.js`) needs careful migration since it patches module resolution — verify `ts-jest` moduleNameMapper still works with `.ts` extension
