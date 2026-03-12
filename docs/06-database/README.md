# 🗄️ Database

Database schema, models, and data relationships.

## 📋 Table of Contents

1. [DATABASE.md](./DATABASE.md) - Schema & migrations
2. [MODELS.md](./MODELS.md) - Data models reference
3. [RELATIONSHIPS.md](./RELATIONSHIPS.md) - Entity relationships

---

## Database Overview

Psychology Assistant uses **MongoDB 6.0+** with the following collections:

### Core Collections

| Collection | Purpose |
|-----------|---------|
| users | User accounts & auth |
| patients | Patient data |
| therapists | Therapist profiles |
| appointments | Appointment scheduling |
| medicalRecords | Medical history |
| clinicalReports | Clinical assessments |
| billings | Invoices & payments |
| sessions | JWT session tracking |
| refreshTokens | Token storage |

---

## Data Model Overview

```
User (Base entity for auth)
├── Patient (Extends User)
│   ├── Medical Records
│   ├── Clinical Reports
│   └── Appointments
├── Therapist (Extends User)
│   └── Appointments
└── Clinic Owner (Role)
    └── Clinic (Admin relationship)
```

---

## Key Features

✅ **Validation** - Schema validation on all fields  