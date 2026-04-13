# Tasks: Migrate Backend to TypeScript

**Change**: migrate-backend-typescript
**Artifact store**: openspec
**TDD mode**: enabled ✅ — 93 tests must stay green after each phase

---

## Phase 1: Setup — tsconfig, build, ESLint, jest ✅ COMPLETADO

- [x] 1.1 Install `typescript`: `pnpm add -D typescript` — verify `tsc --version`
- [x] 1.2 Install ESLint TS packages: `pnpm add -D @typescript-eslint/parser @typescript-eslint/eslint-plugin`
- [x] 1.3 Create `tsconfig.json` at root: `target ES2022`, `module NodeNext`, `moduleResolution NodeNext`, `strict true`, `outDir dist/`, `rootDir src/`, `allowJs true`, `esModuleInterop true`, `skipLibCheck true`, `resolveJsonModule true`, `sourceMap true`
- [x] 1.4 Create `src/types/express.d.ts` — extend `Express.Request` with `user?: IUser`, `clinic?: IClinic`
- [x] 1.5 Create `src/types/env.d.ts` — declare `process.env` shape for all vars from `config/environment.js`
- [x] 1.6 Update `package.json` scripts: `"build": "tsc"`, `"start": "node dist/server.js"`, `"dev": "nodemon --exec ts-node-esm src/server.ts"`
- [x] 1.7 Add `dist/` to `.gitignore`
- [x] 1.8 Update `jest.config.js`: add `transform: { '^.+\\.tsx?$': 'ts-jest', '^.+\\.jsx?$': 'babel-jest' }`, extend `testMatch` to include `**/*.test.ts`
- [x] 1.9 Update `.eslintrc.cjs` (or `.eslintrc.js`): switch to `@typescript-eslint/parser`, extend `plugin:@typescript-eslint/recommended`
- [x] 1.10 Verify: `pnpm run build` exits 0 (compiles empty types); `pnpm test` still 92/93 passing

---

## Phase 2: Models (foundation layer) ✅ COMPLETADO

Migration order per SPEC §2: types → **models** → utils → services → middlewares → controllers → routes → config/entry

- [x] 2.1 Rename `src/models/user.js` → `user.ts`; export `IUser` interface + `IUserDocument extends IUser, Document`
- [x] 2.2 Rename `src/models/therapist.js` → `therapist.ts`; export `ITherapist` + `ITherapistDocument`
- [x] 2.3 Rename `src/models/patient.js` → `patient.ts`; export `IPatient` + `IPatientDocument`
- [x] 2.4 Rename `src/models/appointment.js` → `appointment.ts`; export `IAppointment` + `AppointmentStatus` enum matching model: `'scheduled' | 'completed' | 'cancelled' | 'no-show'`
- [x] 2.5 Rename `src/models/clinic.js` → `clinic.ts`; export `IClinic` + `IClinicDocument`
- [x] 2.6 Rename `src/models/billing.js` → `billing.ts`; export `IBilling` + `IBillingDocument`
- [x] 2.7 Rename `src/models/clinicalreport.js` → `clinicalreport.ts`; export `IClinicalReport` + document type
- [x] 2.8 Rename `src/models/medicalrecord.js` → `medicalrecord.ts`; export `IMedicalRecord` + document type
- [x] 2.9 Rename `src/models/refreshToken.js` → `refreshToken.ts`; export `IRefreshToken`
- [x] 2.10 Rename `src/models/session.js` → `session.ts`; export `ISession`
- [x] 2.11 Rename `src/models/index.js` → `index.ts`; re-export all typed models
- [x] 2.12 Verify: `pnpm run build` — 0 errors on models layer; `pnpm test` ≥ 92 passing

---

## Phase 3: Utils & Services ✅ COMPLETADO

- [x] 3.1 Rename `src/utils/appError.js` → `appError.ts`; add `AppError` class with `statusCode: number`, `isOperational: boolean`
- [x] 3.2 Rename `src/utils/apiResponse.js` → `apiResponse.ts`; add `ApiResponse<T>` generic type
- [x] 3.3 Rename `src/utils/errorHandler.js` → `errorHandler.ts`; type Express 4-arg error handler `(err: AppError, req, res, next)`
- [x] 3.4 Rename `src/utils/validators.js` → `validators.ts`; type all validation functions
- [x] 3.5 Rename `src/services/twoFAService.js` → `twoFAService.ts`; type `keyuri()` and `check()` return values explicitly
- [x] 3.6 Rename `src/services/qrService.js` → `qrService.ts`; type `generateQR(data: string): Promise<string>`
- [x] 3.7 Rename `src/services/validationService.js` → `validationService.ts`; type all return shapes
- [x] 3.8 Verify: `pnpm run build` — 0 errors on utils + services; `pnpm test` ≥ 92 passing

---

## Phase 4: Middlewares, Controllers & Routes ✅ COMPLETADO

- [x] 4.1 Rename `src/middlewares/authMiddleware.js` → `authMiddleware.ts`; use `AuthRequest extends Request` with typed `user` from `IUser`
- [x] 4.2 Rename `src/middlewares/auditMiddleware.js` → `auditMiddleware.ts`; type `(req, res, next): void`
- [x] 4.3 Rename `src/middlewares/clinicOwnerMiddleware.js` → `clinicOwnerMiddleware.ts`
- [x] 4.4 Rename `src/middlewares/rateLimitMiddleware.js` → `rateLimitMiddleware.ts`
- [x] 4.5 Rename `src/middlewares/sanitizationMiddleware.js` → `sanitizationMiddleware.ts`; fix bug: add `typeof value === 'string'` guard before calling `xss()` — resolves AGENTS.md bug #3
- [x] 4.6 Rename `src/controllers/authController.js` → `authController.ts`; type all `Request`/`Response` params
- [x] 4.7 Rename `src/controllers/userController.js` → `userController.ts`
- [x] 4.8 Rename `src/controllers/therapistController.js` → `therapistController.ts`
- [x] 4.9 Rename `src/controllers/patientController.js` → `patientController.ts`
- [x] 4.10 Rename `src/controllers/appointmentController.js` → `appointmentController.ts`
- [x] 4.11 Rename `src/controllers/billingController.js` → `billingController.ts`
- [x] 4.12 Rename `src/controllers/clinicController.js` → `clinicController.ts`
- [x] 4.13 Rename `src/controllers/clinicalreportController.js` → `clinicalreportController.ts`
- [x] 4.14 Rename `src/controllers/medicalrecordController.js` → `medicalrecordController.ts`
- [x] 4.15 Rename all `src/routes/*.js` → `*.ts` (9 files: auth, user, therapist, patient, appointment, billing, clinic, clinicalreport, medicalrecord)
- [x] 4.16 Verify: `pnpm run build` — 0 errors on middlewares + controllers + routes; `pnpm test` ≥ 92 passing

---

## Phase 5: Config, Entry Points & Final Verification ✅ COMPLETADO

- [x] 5.1 Rename `src/config/environment.js` → `environment.ts`; explicit return types for all getters
- [x] 5.2 Rename `src/config/database.js` → `database.ts`; type `connectDB(): Promise<void>`
- [x] 5.3 Rename `src/config/logger.js` → `logger.ts`; type Winston logger instance
- [x] 5.4 Rename `src/config/swagger.js` → `swagger.ts`
- [x] 5.5 Rename `src/config/validateEnv.js` → `validateEnv.ts`
- [x] 5.6 Rename `src/app.js` → `app.ts`; confirm wildcard route uses `/(.*)/` — resolves AGENTS.md bug #1
- [x] 5.7 Rename `src/server.js` → `server.ts`; type `startServer(): Promise<void>`
- [x] 5.8 Rename `src/__tests__/mock-otplib.js` → `mock-otplib.ts`; type `totp` mock object explicitly
- [x] 5.9 Rename `src/__tests__/setup.js` → `setup.ts`; type MongoMemoryServer instance
- [x] 5.10 Rename `src/__tests__/verify-otplib-mock.test.js` → `verify-otplib-mock.test.ts`
- [x] 5.11 Rename all `src/controllers/__tests__/*.test.js` → `*.test.ts` (9 controller test files)
- [x] 5.12 Rename `src/models/__tests__/user.test.js` → `user.test.ts`
- [x] 5.13 Run `pnpm test` — **all 93 tests must pass** (zero regressions)
- [x] 5.14 Run `pnpm run build` — `tsc` compiles `dist/` with **0 errors**; `tsc --noEmit` also exits 0
- [x] 5.15 Run `pnpm run lint` — 0 ESLint errors with `@typescript-eslint` rules
- [x] 5.16 Verify `<10` instances of `any` in codebase: `grep -r ': any' src/ | wc -l`

---

## Dependencies Map

```
Phase 1 (tsconfig + tooling)
  └─► Phase 2 (models) — need tsconfig + types/express.d.ts
        └─► Phase 3 (utils + services) — need model interfaces
              └─► Phase 4 (middlewares + controllers + routes) — need utils + model types
                    └─► Phase 5 (config + entry + tests) — need all layers migrated
```

## File Count

| Phase     | Files renamed                            | New files                                               |
| --------- | ---------------------------------------- | ------------------------------------------------------- |
| 1         | 3 (jest, eslint, gitignore)              | `tsconfig.json`, `types/express.d.ts`, `types/env.d.ts` |
| 2         | 11 models                                | —                                                       |
| 3         | 4 utils + 3 services                     | —                                                       |
| 4         | 5 middlewares + 9 controllers + 9 routes | —                                                       |
| 5         | 5 config + 2 entry + 12 tests            | —                                                       |
| **Total** | **~60 files**                            | **3 new**                                               |
