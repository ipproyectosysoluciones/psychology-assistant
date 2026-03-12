# 🗄️ Database

**Psychology Assistant | v0.4.0** | Database schema, models, relationships, and data management.

## 📋 Table of Contents

1. [DATABASE.md](./DATABASE.md) - Schema & migrations
2. [MODELS.md](./MODELS.md) - Data models reference & validation rules
3. [RELATIONSHIPS.md](./RELATIONSHIPS.md) - Entity relationships & cardinality

---

## Database Technology

**MongoDB 6.0+** - Document-oriented database with flexible schema, transactions, and replication.

```
Why MongoDB:
✅ Flexible schema (adapt to psych domain changes)
✅ Horizontal scaling (patient growth)
✅ ACID transactions (v4.0+) for financial data
✅ Aggregation pipeline (complex analytics)
✅ Geospatial queries (clinics by location)
✅ Full-text search (patient records)
✅ Automatic sharding (enterprise scale)
```

---

## Core Collections

### All Collections Overview

| Collection | Purpose | Docs | Indexes | Growth |
| --- | --- | --- | --- | --- |
| `users` | User accounts, auth, roles | ~100k | 4 | Fast |
| `patients` | Patient profiles, demographics | ~50k | 3 | Medium |
| `therapists` | Therapist profiles, specialties | ~5k | 3 | Slow |
| `appointments` | Scheduling, session tracking | ~500k | 5 | Very Fast |
| `medicalrecords` | Patient health history | ~50k | 4 | Medium |
| `clinicalreports` | Assessment reports | ~30k | 3 | Medium |
| `billings` | Invoices, payments, ledger | ~100k | 4 | Fast |
| `sessions` | JWT session tokens | ~500k | 2 | Very Fast |
| `refreshtokens` | Token refresh records | ~500k | 2 | Very Fast |
| `clinics` | Clinic organization data | ~500 | 2 | Very Slow |

---

## Data Model Hierarchy

```
├─ __base_entities__
│  └─ User (Abstract)
│     ├─ fields: id, email, password, role, createdAt, updatedAt
│     ├─ indexes: email(unique), role
│     └─ responsibilities: auth, GDPR
│
├─ patients (extends User)
│  │  ├─ demographics: firstName, lastName, DOB, phone, address
│  │  ├─ medical: bloodType, allergies, medications, conditions
│  │  ├─ clinic_id (FK → clinics)
│  │  └─ indexes: clinic_id, email(unique)
│  │
│  ├─ medicalrecords (1:N relationship)
│  │  ├─ patient_id (FK → patients)
│  │  ├─ fields: vitals, symptoms, diagnosis, prescriptions
│  │  └─ index: patient_id, createdAt
│  │
│  └─ clinicalreports (1:N relationship)
│     ├─ patient_id (FK → patients)
│     ├─ therapist_id (FK → therapists)
│     ├─ fields: assessment, observations, recommendations
│     └─ index: patient_id, therapist_id
│
├─ therapists (extends User)
│  │  ├─ professional: license, specialties, certifications, experience
│  │  ├─ schedule: availability_slots, working_hours
│  │  ├─ clinic_id (FK → clinics)
│  │  └─ indexes: clinic_id, license(unique)
│  │
│  └─ appointments (M:N relationship via appointments collection)
│
├─ appointments (M:M junction)
│  │  ├─ patient_id (FK → patients)
│  │  ├─ therapist_id (FK → therapists)
│  │  ├─ fields: dateTime, duration, type, notes, status
│  │  ├─ indexes: patient_id, therapist_id, dateTime, status
│  │  └─ business rules: no conflicts, proper duration
│  │
│  └─ sessions (tracking)
│
├─ billings (Transactional)
│  │  ├─ patient_id (FK → patients)
│  │  ├─ appointment_id (FK → appointments)
│  │  ├─ fields: amount, currency, status, date, description
│  │  ├─ indexes: patient_id, appointment_id, status, date
│  │  └─ constraints: always positive, audit trail
│  │
│  └─ _billing_ledger (audit)
│
├─ sessions (Authentication)
│  │  ├─ user_id (FK → users)
│  │  ├─ fields: token_hash, expires_at, ip_address, user_agent
│  │  ├─ indexes: token_hash, user_id, expires_at
│  │  └─ TTL: 24 hours
│  │
│  └─ automatic cleanup (TTL index)
│
├─ refreshtokens (Token Management)
│  │  ├─ user_id (FK → users)
│  │  ├─ fields: token_hash, expires_at, revoked
│  │  ├─ indexes: token_hash, user_id, expires_at
│  │  └─ TTL: 30 days
│  │
│  └─ automatic cleanup (TTL index)
│
└─ clinics (Organization)
   ├─ owner_id (FK → users)
   ├─ fields: name, address, phone, website, specialties
   ├─ relationships: (1:N) → therapists, patients
   └─ indexes: owner_id, name
```

---

## Indexing Strategy

### Critical Indexes (Performance)

```javascript
// users collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// appointments collection (most queried)
db.appointments.createIndex({ patient_id: 1, dateTime: 1 });
db.appointments.createIndex({ therapist_id: 1, dateTime: 1 });
db.appointments.createIndex({ status: 1 });
db.appointments.createIndex({ dateTime: 1 }); // For date range scans

// sessions (TTL auto-cleanup)
db.sessions.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 });

// financial (audit integrity)
db.billings.createIndex({ patient_id: 1, createdAt: -1 });
```

### Index Statistics

```
Total Indexes: 24
- Unique: 2 (email, license)
- Compound: 8 (multi-field)
- TTL: 2 (automatic cleanup)
- Full-text: Optional (future)
```

---

## Key Features

### ✅ Data Validation
- Schema validation on all collections
- Field type enforcement (date, number, string)
- Required field constraints
- Email format validation
- Phone number validation
- Enum constraints (role, status)

### ✅ Data Integrity
- Foreign key relationships
- Unique constraints (email, license)
- Check constraints (billing > 0)
- Referential integrity via application logic
- Audit trails on sensitive data

### ✅ Performance
- Strategic indexing (24 indexes)
- Query optimization queries
- Connection pooling
- Caching layer (Redis optional)
- Aggregation pipelines for reporting

### ✅ Security
- Encrypted password storage (bcrypt)
- JWT token hashing
- SQL/NoSQL injection prevention
- GDPR data deletion support
- Audit logging on sensitive operations

### ✅ Scalability
- Horizontal scaling ready
- Sharding support planned
- Multi-region replication
- Automated backups (daily)
- Point-in-time recovery

---

## Common Queries

### Find Patient Appointments
```javascript
db.appointments.find({
  patient_id: ObjectId("..."),
  dateTime: { $gte: new Date("2026-01-01") }
}).sort({ dateTime: -1 });
```

### Therapist Schedule
```javascript
db.appointments.find({
  therapist_id: ObjectId("..."),
  status: "confirmed"
}).project({ dateTime: 1, patient_id: 1 });
```

### Billing Report by Clinic
```javascript
db.billings.aggregate([
  { $match: { clinic_id: ObjectId("...") } },
  { $group: { _id: "$status", total: { $sum: "$amount" } } }
]);
```

---

## Backup & Recovery

### Automated Backups
- **Frequency**: Daily at 2:00 AM UTC
- **Retention**: 30 days
- **Method**: MongoDB native backup
- **Location**: AWS S3

### Manual Backup
```bash
# Backup specific database
mongodump --uri "mongodb://localhost:27017/psychology-assistant"

# Restore from backup
mongorestore --uri "mongodb://localhost:27017" dump/psychology-assistant
```

---

## 🇪🇸 Español

### Tecnología Base de Datos

**MongoDB 6.0+** - Base de datos orientada a documentos con esquema flexible.

### Colecciones Principales

```
- users: Cuentas y autenticación
- patients: Perfiles de pacientes
- therapists: Perfiles de terapeutas
- appointments: Programación de citas
- medicalrecords: Historial médico
- clinicalreports: Reportes clínicos
- billings: Facturación y pagos
- sessions & refreshtokens: Gestión de tokens
```

### Características Clave

✅ Validación de datos en todas las colecciones  
✅ Integridad referencial  
✅ Costo-beneficio optimizado (24 índices)  
✅ Seguridad de datos GDPR  
✅ Escalabilidad horizontal  

---

**Last Updated**: March 12, 2026  
**Version**: v0.4.0  
**Status**: ✅ Production Ready
