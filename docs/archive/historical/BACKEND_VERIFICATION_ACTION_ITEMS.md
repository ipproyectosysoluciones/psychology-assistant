# Backend Verification - Action Items

> **Versión** | [📖 Español](#spanish-section) | **Status**: Planning Phase

## Critical Issues Requiring Fixes

### 1. API Route Versioning Inconsistency (🔴 CRITICAL)

**Issue**: Routes are inconsistently versioned between auth/user endpoints and resource endpoints.

**Current State**:

```
✓ /api/auth/...          (Authentication - NO version)
✓ /api/users/...         (User profile - NO version)
✓ /api/appointments/...  (Appointments - NO version)
✗ /api/v1/clinics/...    (Clinics - WITH version)
✗ /api/v1/therapists/... (Therapists - WITH version)
✗ /api/v1/patients/...   (Patients - WITH version)
```

**Files to Update**:

- [src/app.js](src/app.js#L83-L91) - Lines 83-91 (route registration)
- [docs/API_ENDPOINTS.md](docs/API_ENDPOINTS.md) - Update all documented paths
- docs/psychology-assistant.postman_collection.json - Update collection if paths change

**Recommended Solution**:
Option A (Recommended): Remove `v1` from all routes

```javascript
// src/app.js - Lines 83-91
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/clinics', clinicRoutes); // Remove /v1/
app.use('/api/therapists', therapistRoutes); // Remove /v1/
app.use('/api/patients', patientRoutes); // Remove /v1/
app.use('/api/medical-records', medicalrecordRoutes); // Remove /v1/
app.use('/api/billings', billingRoutes); // Remove /v1/
app.use('/api/clinical-reports', clinicalreportRoutes); // Remove /v1/
```

Option B: Add v1 to all routes (more work)

```javascript
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
// ... etc
```

**Effort**: 30-45 minutes (fix code + update docs + test)

---

### 2. HTTP Status Code Issue (🟠 MEDIUM)

**Issue**: POST /api/auth/register returns 200 instead of 201 (Created)

**Current File**: [src/controllers/authController.js](src/controllers/authController.js)

**Current Code** (Approximate line 160):

```javascript
const response = ApiResponse.success(
  {
    user: {
      /* ... */
    },
    accessToken,
    refreshToken,
  },
  'User registered successfully',
);

sendResponse(res, response); // This uses default status
```

**Fix**: Update sendResponse call to specify 201

```javascript
sendResponse(res, response, 201); // Add 201 status code
```

**Also Check**:

- Other POST endpoints that create resources should also return 201
- Review all controller files in [src/controllers/](src/controllers/)

**Files to Check**:

- [src/controllers/authController.js](src/controllers/authController.js)
- [src/controllers/appointmentController.js](src/controllers/appointmentController.js)
- [src/controllers/clinicController.js](src/controllers/clinicController.js)
- [src/controllers/patientController.js](src/controllers/patientController.js)
- [src/controllers/medicalrecordController.js](src/controllers/medicalrecordController.js)
- [src/controllers/billingController.js](src/controllers/billingController.js)

**Effort**: 15 minutes (find and update all POST create methods)

---

### 3. Development Stack Traces in Error Responses (🟠 MEDIUM)

**Issue**: Stack traces are visible in error responses. Good for development, but should be hidden inproduction.

**Current**:

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Invalid credentials",
  "stack": "Error: Invalid credentials\n    at AppError.badRequest ..."
}
```

**Files to Update**:

- [src/utils/errorHandler.js](src/utils/errorHandler.js) - Error response formatting

**Fix**: Add NODE_ENV check

```javascript
// In errorHandler.js
if (environment.isProduction()) {
  // Hide stack trace in production
  delete errorResponse.stack;
}
```

**Effort**: 10 minutes (simple environment check)

---

## Testing Plan

After fixes are applied:

1. **Run Unit Tests**

   ```bash
   npm test
   ```

   - Should maintain 92+ passed tests
   - Coverage should remain ≥80%

2. **Verify Endpoints**

   ```bash
   ./scripts/verify-api.sh
   ```

   - All endpoints should respond correctly
   - Status codes should match specification

3. **Test with Postman Collection**
   - Import updated collection
   - Run full test suite
   - Verify auth flows work

---

## Implementation Order

1. **Fix Route Versioning** (HIGH PRIORITY) - Do this first
2. **Fix Status Codes** (MEDIUM PRIORITY) - Depends on #1
3. **Hide Error Stacks** (MEDIUM PRIORITY) - Independent

---

## Not Issues - Clarifications

### ✅ Rate Limiting Works Correctly

- 5 attempts per 15-minute window as designed
- Returns proper error response
- **No fix needed**

### ✅ CORS Configuration Works

- Properly allows http://localhost:3000
- Security headers present
- **No fix needed**

### ✅ API Response Format

- Standard ApiResponse<T> format implemented
- statusCode, success, data, message fields present
- **No fix needed** (already meets specification)

---

## Documentation to Update

After making code fixes:

1. **docs/API_ENDPOINTS.md** - Update all paths if versioning changes
2. **DEVELOPMENT_GUIDE.md** - Add section on versioning strategy
3. **README.md** - Update API base URL examples if needed
4. **docs/psychology-assistant.postman_collection.json** - Import and update if paths change

---

<a id="spanish-section"></a>

# Verificación del Backend - Elementos de Acción

> [📖 English](#critical-issues-requiring-fixes) | **Español**

## Problemas Críticos que Requieren Correcciones

### 1. Inconsistencia en Versionado de Rutas de API (🔴 CRÍTICO)

**Problema**: Las rutas no están versionadas consistentemente.

**Estado Actual**:

- `/api/auth/...` (Sin versión)
- `/api/users/...` (Sin versión)
- `/api/v1/clinics/...` (CON versión)

**Solución Recomendada**: Remover `/v1/` de todas las rutas y documentar la estrategia.

### 2. Código de Estado HTTP (🟠 MEDIO)

**Problema**: POST `/api/auth/register` devuelve 200 en lugar de 201 Created

**Archivo**: [src/controllers/authController.js](src/controllers/authController.js)

**Corrección**: Actualizar `sendResponse()` para usar estado 201 en endpoints POST que creen recursos.

### 3. Stack Traces en Respuestas de Error (🟠 MEDIO)

**Problema**: Los stack traces son visibles en las respuestas de error.

**Solución**: Grabar un check de NODE_ENV para no incluir stack traces en producción.

---

## Próximos Pasos

1. Aplicar las 3 correcciones en orden de prioridad
2. Ejecutar suite de pruebas completa
3. Validar con colección de Postman
4. Crear PR con todas las correcciones
5. Solicitar revisión de cambios

---

**Created**: March 11, 2026  
**Last Updated**: March 11, 2026  
**Status**: Planning Phase
