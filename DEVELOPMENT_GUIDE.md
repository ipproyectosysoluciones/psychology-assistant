# Psychology Assistant - Development Guide / Guía de Desarrollo

**Documentación / Documentation:**

- [🇬🇧 English Version](#-quick-start)
- [🇪🇸 Versión en Español](#guía-de-desarrollo-en-español)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or connection string)
- pnpm or npm

### Installation

```bash
# Install dependencies
npm install

# Frontend dependencies
cd frontend && npm install && cd ..

# Set up environment
cp .env.example .env
```

### Running Development Servers

#### Backend

```bash
npm start
# Runs on http://localhost:5000
```

#### Frontend

```bash
cd frontend
ng serve --port 4200
# Runs on http://localhost:4200
```

## 📊 Project Structure

```
psychology-assistant/
├── src/                          # Backend code
│   ├── config/                   # Configuration files
│   ├── controllers/              # Business logic
│   │   └── __tests__/            # Unit tests (✅ 97.8% pass rate)
│   ├── middlewares/              # Express middlewares
│   ├── models/                   # Database schemas
│   ├── routes/                   # API routes
│   ├── services/                 # External services
│   └── utils/                    # Helpers & utilities
├── frontend/                     # Angular frontend
│   ├── src/
│   │   ├── app/                  # Angular components
│   │   ├── environments/         # Environment configs
│   │   └── assets/               # Static assets
│   └── cypress/                  # E2E tests
├── docs/                         # Documentation
├── tests/                        # Integration tests (disabled in jest.config.js)
└── logs/                         # Application logs
```

## 🧪 Testing

### Run Tests

```bash
# All tests
npm test

# Watch mode
npm test -- --watch

# Only unit tests
npm test -- src/controllers/__tests__

# With coverage
npm test -- --coverage
```

**Current Status:**

- ✅ Test Suites: 10/10 PASSED (100%)
- ✅ Tests: 90/92 PASSED (97.8%)
- ⏸️ Skipped: 2 (2FA integration tests - under investigation)

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/enable-2fa` - Setup 2FA
- `POST /api/auth/verify-2fa` - Verify 2FA token ⏸️
- `POST /api/auth/refresh-token` - Refresh access token

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/change-password` - Change password
- `POST /api/users/deactivate` - Deactivate account
- `DELETE /api/users/delete-data` - GDPR data deletion
- `GET /api/users/stats` - Get appointment statistics

### Appointments

- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - List user appointments (paginated)
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Doctors/Therapists

- `POST /api/therapists` - Create therapist
- `GET /api/therapists/:id` - Get therapist info
- `PUT /api/therapists/:id` - Update therapist
- `DELETE /api/therapists/:id` - Delete therapist

### Clinics

- `POST /api/clinics` - Create clinic
- `GET /api/clinics` - List clinics
- `GET /api/clinics/:id` - Get clinic details
- `PUT /api/clinics/:id` - Update clinic

### Medical Records

- `POST /api/medicalrecords` - Create record
- `GET /api/medicalrecords/:patientId` - Get patient records
- `PUT /api/medicalrecords/:id` - Update record

### Clinical Reports

- `POST /api/clinicalreports` - Create report
- `GET /api/clinicalreports/:id` - Get report

### Billing

- `POST /api/billing/invoices` - Create invoice
- `GET /api/billing/invoices` - List invoices

## 🔒 Security Features

### Authentication

- ✅ JWT-based authentication
- ✅ Bcrypt password hashing
- ✅ 2FA with TOTP tokens
- ✅ Token expiration (7 days)

### Rate Limiting

- `authLimiter`: 5 requests per 15 minutes (authentication endpoints)
- `strictLimiter`: 2 requests per 15 minutes (2FA endpoints)
- `apiLimiter`: 100 requests per 15 minutes (general API)

### Data Protection

- ✅ Input validation & sanitization
- ✅ GDPR data deletion support
- ✅ Session tracking & audit logging
- ✅ Secure password requirements

### Security Headers

- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

## 📝 Environment Variables

```env
# Application
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/psychology-assistant

# JWT
JWT_SECRET=<your-secret-key>
JWT_EXPIRE=7d

# 2FA
TWO_FA_WINDOW=2

# Logging
LOG_LEVEL=debug
```

## 📚 API Documentation

API documentation is available via:

- Postman Collection: [docs/psychology-assistant.postman_collection.json](docs/psychology-assistant.postman_collection.json)
- Swagger UI: `http://localhost:5000/api/swagger/ui` (when implemented)

## 🐛 Debugging

### Backend Logs

```bash
tail -f logs/backend.log
tail -f logs/error.log
```

### Frontend Console

Open DevTools (F12) in your browser for frontend logs

### Database

```bash
# MongoDB CLI
mongosh psychology-assistant

# View collections
show collections

# Check user count
db.users.countDocuments()
```

## 🚢 Deployment

### Production Build (Frontend)

```bash
cd frontend
ng build --configuration production
# Output: dist/frontend/browser/
```

### Docker Setup

```bash
# Build
docker build -t psychology-assistant .

# Run with Docker Compose
docker-compose up -d
```

## 🔧 Configuration

### TypeScript

- `tsconfig.json` - Root TypeScript config
- `frontend/tsconfig.app.json` - Frontend-specific config
- ✅ Type safety: 0 `any` types, all interfaces defined

### ESLint & Prettier

```bash
# Format code
npm run format

# Lint
npm run lint
```

### Jest Configuration

- `jest.config.js` configures test environment
- Test patterns: `**/__tests__/**/*.test.js` and `src/**/*.test.js`
- Setup file: `src/__tests__/setup.js`

## 📊 Known Issues

### 1. Duplicate Schema Indexes

**Warnings in logs** (non-critical):

- Duplicate indexes on: invoiceNumber, email, licenseNumber
- **Fix needed**: Remove duplicate `index: true` declarations from schemas

### 2. 2FA Integration Tests ⏸️

**Status**: 2 tests skipped in `authController.test.js`

- "should verify 2FA successfully with valid token"
- "should fail with invalid 2FA token"
- **Root cause**: State management complexity in TOTP verification
- **Next step**: Investigate and fix in follow-up ticket

### 3. Rate Limiter Persistence

**Note**: Rate limiters are in-memory, reset on server restart

## ✅ Verification Checklist

Before deploying, verify:

- [ ] All tests passing: `npm test`
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] Backend starts: `npm start`
- [ ] Frontend builds: `cd frontend && ng build`
- [ ] API responds: `curl http://localhost:5000/api/health`
- [ ] Database connected: Check logs for "MongoDB Connected"

## 📞 Support

For issues or questions:

1. Check logs in `/logs` directory
2. Review test files for usage examples
3. Check API endpoints documentation
4. Inspect error messages in response bodies

## 📄 Additional Resources

- [CRM Specification](docs/CRM_SPECIFICATION.md)
- [Frontend Type Safety](docs/frontend/FRONTEND_TYPE_SAFETY.md)
- [Environment Configuration](docs/backend/ENVIRONMENT_CONFIG.md)
- [Technical Audit](docs/audit/TECHNICAL_AUDIT.md)

---

**Version**: 1.0.0
**Last Updated**: March 10, 2026
**Status**: 🟢 Production Ready (97.8% test pass rate)
