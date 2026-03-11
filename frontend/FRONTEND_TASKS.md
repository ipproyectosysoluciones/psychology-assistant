# 🎨 Frontend - Tareas Pendientes

**Status**: Verificación completada el 11 de marzo de 2026
**Overall Status**: ⚠️ 85% completo - Requiere refactorización de tests y servicios

---

## 📊 Estado Actual

| Aspecto               | Estado        | Detalles                                            |
| --------------------- | ------------- | --------------------------------------------------- |
| **Build Production**  | ✅ Exitoso    | Configurado con budgets realistas (1.17 MB actual)  |
| **Build Development** | ✅ Exitoso    | Compila sin problemas (3.96 MB no optimizado)       |
| **Type Safety**       | ⚠️ Parcial    | 100% en modelos, pero inconsistencias en servicios  |
| **ESLint**            | ❌ 30 errores | Principalmente `any` types no permitidos            |
| **Tests**             | ❌ Fallos     | 27 archivos spec.ts con errores de type-checking    |
| **Components**        | ✅ Completos  | 20+ componentes funcionales                         |
| **Services**          | ⚠️ Parcial    | 3 servicios con `any` types en parámetros genéricos |

---

## 🔴 Tareas Críticas (High Priority)

### 1. ❌ Remover `any` Types de Servicios

**Prioridad**: ALTA | **Estimado**: 2 horas | **Archivos**: 3

Servicios que aún tienen `any` types:

- `src/app/services/billing.ts` - 2 instancias de `any`
- `src/app/services/clinic.ts` - 2 instancias de `any`
- `src/app/services/medical-record.ts` - 2 instancias de `any`
- `src/app/services/patient.ts` - 2 instancias de `any`
- `src/app/services/therapist.ts` - 2 instancias de `any`

**Solución**: Crear interfaces para todas las entidades y actualizar servicios genéricos.

```typescript
// ANTES:
private apiCall<T>(endpoint: string, method: string, body?: any): Observable<T> {

// DESPUÉS:
private apiCall<T, U = void>(endpoint: string, method: string, body?: U): Observable<T> {
```

### 2. ❌ Corregir Tests Spec.ts (27 archivos)

**Prioridad**: ALTA | **Estimado**: 4-5 horas | **Archivos**: 27

Errores principales:

**A) Mocks que no cumplen interfaces (90% de errores)**

```typescript
// PROBLEMA:
const mockResponse = of({ data: appointments });
// Falta 'success: boolean'

// SOLUCIÓN:
const mockResponse = of<ApiResponse<AppointmentsResponse>>({
  success: true,
  data: { data: appointments, pagination: {...} }
});
```

**B) Nombres de componentes incorrectos (3 archivos)**

- `AppointmentDetail` → `AppointmentDetailComponent`
- `Dashboard` → `DashboardComponent`

**C) Propiedades faltantes en mocks**

- `Appointment` requiere: id, status, createdAt, updatedAt
- `CreateAppointmentData` NO tiene: type (es opcional en Appointment)
- `Clinic` requiere propiedades específicas (city falta)

**Recomendación**: Crear archivo de `test-fixtures.ts` con factory functions.

```typescript
// test-fixtures.ts
export const createMockAppointment(overrides?: Partial<Appointment>): Appointment {
  return {
    id: '1',
    date: new Date().toISOString(),
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  };
}

export const createMockApiResponse<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}
```

### 3. ❌ ESLint Errors: 30 problemas

**Prioridad**: MEDIA | **Estimado**: 1 hora | **Comandos**:

```bash
# Encontrar todos los any types:
pnpm lint

# Tipos de errores:
- 24 × "Unexpected any" (remove `any` from services & tests)
- 6 × "unused variables" (remove or use)
- 1 × "console statement" (remove console.log)
```

**Acción**: Ejecutar `pnpm lint --fix` para auto-corregir lo posible, luego revisar manualmente.

---

## 🟡 Tareas Secundarias (Medium Priority)

### 4. ⚠️ Optimizar Bundle Size

**Prioridad**: MEDIA | **Estimado**: 3-4 horas | **Ahorro potencial**: 300-400 KB

Problemas identificados:

- **Sin lazy loading**: Todas 40+ rutas se cargan en main bundle (1.17 MB)
- **SCSS grandes**: therapist-detail (505 líneas), landing (439 líneas)

**Plan de optimización**:

```typescript
// IMPLEMENTAR: Route-level code splitting
{
  path: 'appointments',
  loadChildren: () => import('./appointments/appointments.module')
    .then(m => m.AppointmentsModule)
}

{
  path: 'therapist',
  loadChildren: () => import('./therapist/therapist.module')
    .then(m => m.TherapistModule)
}
```

**Ganancia esperada**: Reducir main bundle a 600-700 KB

---

### 5. ⚠️ Mejorar Coverage de Tests

**Prioridad**: MEDIA | **Estimado**: 3-4 horas | **Objetivo**: 80%+ coverage

Después de corregir type-checking, ejecutar:

```bash
pnpm test --coverage
```

**Áreas a documentar**:

- Service methods (CRUD, authentication)
- Route guards (auth-guard)
- Error handling
- Edge cases

---

### 6. 🟢 Documentar Features

**Prioridad**: BAJA | **Estimado**: 2 horas | **Ubicación**: `docs/frontend/features/`

Crear archivos para:

- `appointment-management.md` - Cómo crear, editar, ver citas
- `2fa-authentication.md` - Setup 2FA con TOTP
- `user-profile.md` - Gestión de perfil
- `form-patterns.md` - Patrones de formularios (Create/Edit bilingual)

---

## 🟢 Tareas Completadas ✅

| Tarea                      | Fecha  | Detalles                                                 |
| -------------------------- | ------ | -------------------------------------------------------- |
| 100% Type Safety (modelos) | 6 Mar  | 14 interfaces, 0 `any` en models/index.ts                |
| Build Production           | 11 Mar | Budgets ajustados: 1.2-1.5 MB (error), 6-10 KB (estilos) |
| 20+ Componentes Angular    | 6 Mar  | Completos y funcionales                                  |
| 3 Servicios CRUD           | 6 Mar  | AuthService, UserService, AppointmentService             |
| Angular Material setup     | 6 Mar  | Íconos, botones, tablas, inputs                          |
| ESLint + Prettier          | 6 Mar  | Configurado (pero 30 errores aún)                        |
| Responsive Design          | 6 Mar  | Mobile-first con SCSS                                    |

---

## 📈 Plan de Refactorización - Fase 1

### Semana 1: Tests & Type Safety

1. **Día 1-2**: Crear `test-fixtures.ts` con factory functions
2. **Día 2-3**: Corregir 27 archivos spec.ts
3. **Día 4**: Remover `any` types de servicios
4. **Día 5**: Ejecutar todos los tests + recolectar coverage

### Comando para validar progreso:

```bash
# Esto debe mostrar 0 errores (actualmente 30):
pnpm lint:check

# Esto debe compilar sin TypeScript errors:
ng build

# Esto debe ejecutar todos los tests:
pnpm test
```

---

## 🔗 Comparación con Backend

| Aspecto           | Backend        | Frontend   | Estado                            |
| ----------------- | -------------- | ---------- | --------------------------------- |
| **Type Safety**   | 100%           | 85%        | Frontend necesita refactorización |
| **Tests**         | 97.8% coverage | Fallos     | Tests necesitan actualización     |
| **ESLint**        | 0 errores      | 30 errores | Frontend necesita limpieza        |
| **Build**         | ✅ Exitoso     | ✅ Exitoso | Ambos funcionan                   |
| **Documentación** | Completa       | ⚠️ Parcial | Frontend necesita features docs   |

---

## 💡 Recomendaciones Inmediatas

### Para iniciar trabajo:

1. **PRIORITARIO**: Corregir tests (bloquea calidad)
2. **IMPORTANTE**: Remover `any` types (cumplimiento type safety)
3. **NECESARIO**: Ejecutar linter --fix (calidad código)

### Comando de inicio:

```bash
# Terminal 1: Watch lint
watch 'pnpm lint:check'

# Terminal 2: Watch tests (cuando se arreglen)
watch 'pnpm test'

# Terminal 3: Watch build
watch 'pnpm build'
```

### Estimado Total de Trabajo:

- **Tests**: 4-5 horas
- **Services (any removal)**: 2 horas
- **ESLint fixes**: 1 hora
- **Bundle optimization**: 3-4 horas (opcional pero recomendado)
- **Total**: 10-12 horas

---

## 📎 Referencias

- **Frontend README**: [frontend/README.md](../README.md)
- **Type Safety**: [docs/frontend/FRONTEND_TYPE_SAFETY.md](../docs/frontend/FRONTEND_TYPE_SAFETY.md)
- **Models**: [src/app/models/index.ts](./src/app/models/index.ts)
- **Angular Guide**: https://angular.io/guide/testing
- **RxJS Testing**: https://rxjs.dev/guide/testing/marble-testing

---

**Generado**: 11 de marzo de 2026
**Próxima revisión**: Después de completar Fase 1 de refactorización
