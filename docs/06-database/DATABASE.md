# Base de Datos - Psychology Assistant / Database

**Documentación / Documentation:**

- [🇪🇸 Español](#español-documentación-de-base-de-datos)
- [🇬🇧 English](#english-database-documentation)

---

## ESPAÑOL: Documentación de Base de Datos

### 📋 Resumen

La base de datos de Psychology Assistant está diseñada con **MongoDB** usando **Mongoose ODM** para esquemas type-safe. La arquitectura soporta:

- ✅ 9 colecciones principales
- ✅ Relaciones entre entidades
- ✅ Validación de esquema
- ✅ Índices automáticos
- ✅ Auditoría y timestamps
- ✅ Soporte GDPR (eliminación de datos)

### 🗄️ Entidades Principales

#### 1. **Users** (Usuarios)

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  profilePicture: String (optional),
  bio: String (optional),
  twoFAEnabled: Boolean (default: false),
  twoFASecret: String (encrypted),
  lastLogin: DateTime,
  isActive: Boolean (default: true),
  role: Enum ['user', 'therapist', 'admin'] (default: 'user'),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

#### 2. **Sessions** (Sesiones)

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  token: String,
  expiresAt: DateTime,
  createdAt: DateTime
}
```

#### 3. **Therapists** (Terapeutas)

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  licenseNumber: String (unique),
  specializations: Array<String>,
  clinicIds: Array<ObjectId> (ref: Clinics),
  availableSlots: Array<{
    day: Enum ['Monday', ..., 'Sunday'],
    startTime: Time,
    endTime: Time
  }>,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

#### 4. **Clinics** (Clínicas)

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  zipCode: String,
  country: String,
  operatingHours: {
    monday: { open, close },
    tuesday: { open, close },
    ...
  },
  therapists: Array<ObjectId> (ref: Therapists),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

#### 5. **Appointments** (Citas)

```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: Patients),
  therapistId: ObjectId (ref: Therapists),
  clinicId: ObjectId (ref: Clinics),
  appointmentDate: DateTime (required),
  duration: Number (minutes, default: 60),
  status: Enum ['scheduled', 'completed', 'cancelled'],
  notes: String,
  qrCode: String (unique),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

#### 6. **Patients** (Pacientes)

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  clinicId: ObjectId (ref: Clinics),
  dateOfBirth: DateTime,
  gender: Enum ['M', 'F', 'Other'],
  phone: String,
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  medicalConditions: Array<String>,
  allergies: Array<String>,
  medications: Array<String>,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

#### 7. **Medical Records** (Registros Médicos)

```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: Patients),
  appointmentId: ObjectId (ref: Appointments, optional),
  recordType: Enum ['diagnosis', 'treatment', 'test_result', 'prescription'],
  description: String,
  files: Array<{ filename, url }>,
  createdBy: ObjectId (ref: Therapists),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

#### 8. **Clinical Reports** (Reportes Clínicos)

```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: Patients),
  therapistId: ObjectId (ref: Therapists),
  appointmentId: ObjectId (ref: Appointments),
  sessionDate: DateTime,
  diagnosis: String,
  treatmentPlan: String,
  notes: String,
  reviewed: Boolean (default: false),
  reviewedBy: ObjectId (ref: Therapists, optional),
  reviewDate: DateTime,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

#### 9. **Billings** (Facturación)

```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: Patients),
  appointmentIds: Array<ObjectId> (ref: Appointments),
  invoiceNumber: String (unique),
  amount: Number (decimal),
  currency: String (default: 'USD'),
  status: Enum ['unpaid', 'paid', 'overdue'],
  dueDate: DateTime,
  paidDate: DateTime,
  notes: String,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

#### 10. **Refresh Tokens** (Tokens de Actualización)

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  token: String (unique),
  expiresAt: DateTime,
  createdAt: DateTime
}
```

### 🔗 Diagrama de Relaciones

```txt
Users (1) --- (1) Sessions
      |
      +--- (1) Therapists (M) --- (M) Clinics
      |          |
      |          +--- (M) Appointments
      |          |         |
      |          |         +--- (1) Patients
      |          |         |         |
      |          |         |         +--- (M) Medical Records
      |          |         |         +--- (M) Billings
      |          |         |         +--- (M) Clinical Reports
      |          |
      |          +--- (M) Medical Records
      |          +--- (M) Clinical Reports
      |
      +--- (1) Patients
             |
             +--- (M) Appointments
             +--- (M) Medical Records
             +--- (M) Clinical Reports
             +--- (M) Billings

Therapists (M) --- (M) Clinics
```

### 📊 Índices Creados

```javascript
// Users
- email (unique)
- createdAt

// Therapists
- licenseNumber (unique)
- clinicIds

// Clinics
- name
- email

// Appointments
- patientId
- therapistId
- clinicId
- appointmentDate
- qrCode (unique)
- status

// Patients
- userId (unique)
- clinicId

// Medical Records
- patientId
- appointmentId
- createdBy

// Clinical Reports
- patientId
- therapistId
- appointmentId
- reviewed

// Billings
- patientId
- invoiceNumber (unique)
- status

// Sessions
- userId
- expiresAt (TTL 24 horas)

// Refresh Tokens
- userId
- token (unique)
- expiresAt (TTL 7 días)
```

### 🔐 Validación y Constraints

#### Validaciones de Esquema

```javascript
// Emails válidos
email: {
  type: String,
  match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
}

// Contraseña mínimo 8 caracteres
password: {
  minlength: 8,
  validate: function(v) {
    // 1 mayúscula, 1 número, 1 carácter especial
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(v);
  }
}

// Número de teléfono
phone: {
  match: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
}

// Código postal
zipCode: {
  match: /^[0-9]{5}(-[0-9]{4})?$/
}
```

### ✅ Middleware de Mongoose

```javascript
// Pre-save: hashear contraseña
User.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Post-save: eliminar campo de contraseña en respuesta
User.post('find', function(docs) {
  docs.forEach(doc => {
    doc.password = undefined;
  });
});

// TTL Index: eliminar sesiones expiradas automáticamente
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

### 📝 Consultas Comunes

```javascript
// Obtener usuario con sus citas
User.findById(userId)
  .populate('appointments')
  .populate('medicalRecords');

// Obtener citas de un terapeuta en una fecha
Appointment.find({
  therapistId: therapistId,
  appointmentDate: {
    $gte: startOfDay,
    $lte: endOfDay
  }
});

// Obtener reportes clínicos sin revisar
ClinicalReport.find({ reviewed: false })
  .populate('patientId', 'name email')
  .populate('therapistId', 'name licenseNumber');

// Obtener facturas vencidas
Billing.find({
  status: 'unpaid',
  dueDate: { $lt: new Date() }
});
```

### 🗑️ GDPR: Eliminación de Datos

When user requests data deletion:

```javascript
// 1. Eliminar usuario
await User.deleteOne({ _id: userId });

// 2. Eliminar sesiones
await Session.deleteMany({ userId });

// 3. Eliminar tokens de actualización
await RefreshToken.deleteMany({ userId });

// 4. Para pacientes: anonimizar o eliminar citas
await Appointment.updateMany(
  { patientId: userId },
  { $set: { notes: '[Deleted per GDPR]' } }
);

// 5. Eliminar datos médicos
await MedicalRecord.deleteMany({ patientId: userId });

// 6. Anonimizar reportes clínicos
await ClinicalReport.updateMany(
  { patientId: userId },
  { $set: { notes: '[Deleted per GDPR]' } }
);
```

---

## ENGLISH: Database Documentation

### 📋 Overview

The Psychology Assistant database is designed with **MongoDB** using **Mongoose ODM** for type-safe schemas. Architecture supports:

- ✅ 9 main collections
- ✅ Entity relationships
- ✅ Schema validation
- ✅ Automatic indexes
- ✅ Audit and timestamps
- ✅ GDPR support (data deletion)

### 🗄️ Main Entities

See Spanish section above for detailed entity structures and field definitions.

### 🔗 Relationship Diagram

```txt
Users --- Sessions
Users --- Therapists --- Clinics
Users --- Patients --- Appointments
          |         --- Medical Records
          |         --- Clinical Reports
          |         --- Billings
          |
Therapists --- Appointments
Therapists --- Clinical Reports
Therapists --- Medical Records

Clinics --- Therapists
Clinics --- Appointments
```

### 💾 Connection Setup

**Connection String Format:**

```env
mongodb://[username:password@]host[:port]/database
```

**Environment Variable:**

```env
MONGO_URI=mongodb://localhost:27017/psychology-assistant
```

**Connection Code:**

```javascript
const mongoose = require('mongoose');
const connection = await mongoose.connect(process.env.MONGO_URI);
console.log('MongoDB Connected:', connection.connection.host);
```

### 🚀 Database Operations

#### Common Queries

```javascript
// Create
const user = await User.create({ name, email, password });

// Read
const user = await User.findById(userId);
const users = await User.find({ isActive: true });

// Update
const updated = await User.findByIdAndUpdate(id, data, { new: true });

// Delete
await User.deleteOne({ _id: userId });

// Populate references
const patient = await Patient.findById(id)
  .populate('userId')
  .populate('clinicId');
```

#### Aggregation Example

```javascript
// Get appointment statistics by therapist
const stats = await Appointment.aggregate([
  { $match: { status: 'completed' } },
  { $group: {
    _id: '$therapistId',
    totalAppointments: { $sum: 1 },
    avgDuration: { $avg: '$duration' }
  }},
  { $lookup: {
    from: 'therapists',
    localField: '_id',
    foreignField: '_id',
    as: 'therapist'
  }}
]);
```

### 📊 Performance Optimization

**Index Strategy:**

- Index frequently searched fields (patientId, therapistId, appointmentDate)
- Use compound indexes for common filter combinations
- TTL indexes for temporary data (sessions, tokens)

**Query Optimization:**

- Use `.lean()` for read-only queries
- Batch operations when possible
- Use aggregation pipeline for complex queries

### ✅ Data Backup & Recovery

**Backup Schedule:**

```bash
# Daily backup
mongodump --uri $MONGO_URI --out ./backups/$(date +%Y-%m-%d)

# Restore from backup
mongorestore --uri $MONGO_URI ./backups/2026-03-11
```

### 📋 Schema Validation Rules

- **Required fields**: name, email, password (Users)
- **Unique fields**: email, licenseNumber, invoiceNumber, qrCode
- **Date fields**: Always use `DateTime` type with auto-timestamps
- **Enum fields**: Use strict Enum validation
- **Reference fields**: Always use ObjectId with proper refs

---

**Last Updated**: March 11, 2026  
**Database Version**: MongoDB 4.0+  
**Connection Driver**: Mongoose 7.0+
