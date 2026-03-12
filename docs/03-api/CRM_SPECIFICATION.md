# 📋 PLAN EJECUTIVO - CRM PSYCHOLOGY CONSULTANT SYSTEM

**Versión**: 0.1.1 → 0.2.0 (será)  
**Fecha**: 6 de marzo, 2026  
**Estado**: En planificación

---

## 🎯 OBJETIVOS

Crear un **CRM completo para Consultorios Psicológicos y Clínicas** con:

- ✅ 6 nuevas entidades de datos
- ✅ 30+ endpoints RESTful CRUD
- ✅ Sistema de roles jerárquico (Admin Global → Clínica → Profesional → Paciente)
- ✅ Autorización basada en clinic ownership
- ✅ Facturación y reportes
- ✅ Tests (80%+ cobertura)
- ✅ Documentación tecn ica bilingual (ES/EN)

---

## 📊 ARQUITECTURA DEL CRM

### Modelo Jerárquico

```
Admin Global
  ├── Clinic A (Consultorio/Clínica)
  │   ├── Therapist 1 (Psicólogo/Terapeuta)
  │   │   ├── Patient 1 → MedicalRecord
  │   │   │            → Appointment
  │   │   │            → Billing
  │   │   └── Patient 2
  │   └── Therapist 2
  └── Clinic B
      ├── Therapist 3
      └── Receptionist
          └── (Gestiona pacientes/citas para psicólogos)
```

### Roles Implementados

| Rol | Permisos | Acceso |
|-----|----------|--------|
| **Admin Global** | Admin + todas las clínicas | System-wide |
| **Clinic Admin** | Gestionar clínica, usuarios locales | Su clínica |
| **Therapist** | Ver citas, pacientes, expedientes propios | Solo sus pacientes |
| **Receptionist** | CRUD citas y pacientes | Clínica asignada |
| **Billing User** | Facturación y pagos | Clínica asignada |
| **Patient** | Ver citas propias, expediente | Solo sus datos |

---

## 🗄️ ENTIDADES A CREAR

### 1. **Clinic** (Consultorio/Clínica)
```javascript
{
  _id: ObjectId,
  name: String,           // Ej: "Consultorio Psicológico Mental Care"
  description: String,
  address: String,
  phone: String,
  email: String,
  country: String,        // "Colombia"
  currency: String,       // "COP" (default)
  owner: ObjectId (User), // Admin que la crea
  admins: [ObjectId],     // Otros admins de clínica
  createdAt: Date,
  updatedAt: Date
}
```

### 2. **Therapist** (Psicólogo/Terapeuta)
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  specialties: [String],  // ["depresión", "ansiedad", "terapia familiar"]
  licenseNumber: String,
  clinic: ObjectId (Clinic),
  user: ObjectId (User),  // Associated User para login
  availability: {
    monday: [{start: "08:00", end: "17:00"}],
    // ... resto de días
  },
  patients: [ObjectId],
  createdAt: Date
}
```

### 3. **Patient** (Paciente/Cliente - MEJORADO)
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  dateOfBirth: Date,
  documentType: String,   // "CC", "Pasaporte", etc
  documentNumber: String,
  address: String,
  clinic: ObjectId (Clinic),
  therapists: [ObjectId], // Múltiples psicólogos
  user: ObjectId (User),  // Para portal del paciente
  emergencyContact: {
    name: String,
    phone: String
  },
  insuranceInfo: {
    provider: String,
    policyNumber: String
  },
  status: "active" | "inactive",
  createdAt: Date
}
```

### 4. **MedicalRecord** (Historial Clínico)
```javascript
{
  _id: ObjectId,
  patient: ObjectId (Patient),
  clinic: ObjectId (Clinic),
  therapist: ObjectId (Therapist),
  diagnoses: [String],     // ["F32", "F41"] - CIE-10
  presentingIssues: String,
  medicalHistory: String,
  medications: [String],
  notes: String,
  confidential: Boolean,
  lastUpdated: Date,
  updatedBy: ObjectId (User),
  createdAt: Date
}
```

### 5. **Appointment** (Cita - MEJORADO)
```javascript
{
  _id: ObjectId,
  clinic: ObjectId (Clinic),
  therapist: ObjectId (Therapist),
  patient: ObjectId (Patient),
  date: Date,
  duration: Number,        // minutos
  type: "consultation" | "follow-up" | "assessment",
  status: "scheduled" | "completed" | "cancelled" | "no-show",
  notes: String,
  medicalRecord: ObjectId (MedicalRecord),
  sessionNotes: String,    // Post-sesión
  nextAppointment: Date,
  reminderSent: Boolean,
  qrCode: String,          // Para check-in
  recording: String,       // URL a grabación (si aplica)
  createdAt: Date,
  updatedAt: Date
}
```

### 6. **Billing** (Facturación)
```javascript
{
  _id: ObjectId,
  clinic: ObjectId (Clinic),
  patient: ObjectId (Patient),
  therapist: ObjectId (Therapist),
  appointments: [ObjectId], // Citas relacionadas
  amount: Number,          // COP
  currency: String,        // "COP"
  status: "draft" | "invoiced" | "paid" | "overdue",
  invoiceNumber: String,
  issueDate: Date,
  dueDate: Date,
  paymentMethod: String,   // "cash", "card", "transfer"
  paymentDate: Date,
  notes: String,
  createdAt: Date
}
```

### 7. **ClinicalReport** (Reportes/Estadísticas)
```javascript
{
  _id: ObjectId,
  clinic: ObjectId (Clinic),
  therapist: ObjectId (Therapist),
  period: {
    start: Date,
    end: Date
  },
  type: "therapist_summary" | "clinic_performance" | "patient_progress",
  data: {
    appointmentsCompleted: Number,
    patientsActive: Number,
    revenueGenerated: Number,
    averageSessionDuration: Number,
    noShowRate: Number
  },
  createdAt: Date
}
```

---

## 🔌 ENDPOINTS A CREAR (35 total)

### Clinic Endpoints (6)
```
POST   /api/v1/clinics              - Crear clínica
GET    /api/v1/clinics              - Listar mis clínicas
GET    /api/v1/clinics/:id          - Detalle clínica
PUT    /api/v1/clinics/:id          - Actualizar clínica
DELETE /api/v1/clinics/:id          - Eliminar clínica
GET    /api/v1/clinics/:id/stats    - Estadísticas clínica
```

### Therapist Endpoints (6)
```
POST   /api/v1/therapists           - Crear terapeuta
GET    /api/v1/therapists           - Listar terapeutas (por clínica)
GET    /api/v1/therapists/:id       - Detalle terapeuta
PUT    /api/v1/therapists/:id       - Actualizar perfil
DELETE /api/v1/therapists/:id       - Eliminar terapeuta
GET    /api/v1/therapists/:id/schedule - Horarios disponibles
```

### Patient Endpoints (6)
```
POST   /api/v1/patients             - Crear paciente
GET    /api/v1/patients             - Listar pacientes
GET    /api/v1/patients/:id         - Detalle paciente
PUT    /api/v1/patients/:id         - Actualizar perfil
DELETE /api/v1/patients/:id         - Inactivar paciente
GET    /api/v1/patients/:id/history - Historial citas
```

### MedicalRecord Endpoints (5)
```
POST   /api/v1/medical-records      - Crear registro
GET    /api/v1/medical-records      - Listar (paciente/terapeuta)
GET    /api/v1/medical-records/:id  - Detalle
PUT    /api/v1/medical-records/:id  - Actualizar
GET    /api/v1/medical-records/:id/timeline - Timeline de cambios
```

### Appointment Endpoints (6)
```
POST   /api/v1/appointments         - Crear cita (MEJORADO)
GET    /api/v1/appointments         - Listar citas
GET    /api/v1/appointments/:id     - Detalle cita
PUT    /api/v1/appointments/:id     - Actualizar cita
DELETE /api/v1/appointments/:id     - Cancelar cita
POST   /api/v1/appointments/:id/complete - Marcar como completada
```

### Billing Endpoints (4)
```
POST   /api/v1/billing              - Crear factura
GET    /api/v1/billing              - Listar facturas
GET    /api/v1/billing/:id          - Detalle
PUT    /api/v1/billing/:id/pay      - Registrar pago
```

### Reports Endpoints (3)
```
GET    /api/v1/reports/clinic/:id   - Reporte clínica
GET    /api/v1/reports/therapist/:id - Reporte psicólogo
GET    /api/v1/reports/patient/:id  - Progreso paciente
```

---

## 🔐 AUTORIZACIÓN - REGLAS

| Rol | Clinic Endpoints | Therapist Endpoints | Patient Endpoints | Billing | MedicalRecord |
|-----|------------------|-------------------|-------------------|---------|---------------|
| Admin Global | ✅ Todos | ✅ Todos | ✅ Todos | ✅ Todos | ✅ Todos |
| Clinic Admin | ✅ Su clínica | ✅ Su clínica | ✅ Su clínica | ✅ Su clínica | ✅ Su clínica |
| Therapist | ❌ Ver solo | ❌ Ver solo | ✅ Sus pacientes | ❌ Ver solo | ✅ Sus pacientes |
| Receptionist | ❌ Ver solo | ❌ Ver | ✅ Su clínica | ✅ Su clínica | ❌ Ver solo |
| Billing User | ❌ Ver solo | ❌ Ver | ❌ Ver | ✅ Ver/Pagar | ❌ No |
| Patient | ❌ No | ❌ No | ✅ Solo sí mismo | ❌ No | ✅ Solo suyo |

---

## 📅 TIMELINE & AGENTES

| FASE | Tarea | Agente Responsable | ETA |
|------|-------|-------------------|-----|
| 2 | Diseño modelos MongoDB | Backend Specialist | 30 min |
| 3 | Endpoints CRUD (todos) | Backend + DevOps | 120 min |
| 4 | Autenticación & Auth | Backend Specialist | 60 min |
| 5 | Tests unitarios | QA Agent | 90 min |
| 6 | Documentación & Swagger | Documentation Agent | 45 min |
| 7 | Frontend (Opcional) | Frontend Specialist | 180 min |

**Total estimado sin opcional**: ~5.5 horas

---

## 📝 NOTAS IMPORTANTES

- ✅ Moneda default: **COP (Colombia)**
- ✅ Estructura jerárquica con clinic ownership
- ✅ AuthMiddleware actualizado para validar clinic access
- ✅ Todos los endpoint responden con formato ApiResponse<T>
- ✅ Validaciones con express-validator
- ✅ Índices MongoDB para performance
- ✅ Documentación bilingüe (ES/EN)
- ✅ Seed data para testing

---

**Estado**: 🟢 Listo para implement action

Procede el Backend Specialist Agent cuando esté listo.
