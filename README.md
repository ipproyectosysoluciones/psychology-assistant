# Psychology Assistant - Asistente de Psicología

[![Version](https://img.shields.io/badge/version-v0.2.0-blue.svg)](#)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-92%20passed-brightgreen.svg)](#)
[![Build](https://img.shields.io/badge/build-1.17%20MB-brightgreen.svg)](#)

**Start Here / Comienza Aquí:**

- [🇪🇸 Guías en Español](#guías-en-español)
- [🇬🇧 English Guides](#english-guides)

---

## 🇪🇸 Guías en Español

Una plataforma completa para gestión de citas psicológicas con **100% type safety**, **100% test pass rate** (92 passed, 1 skipped) y documentación bilingual (ES/EN).

**v0.2.0 Released**: Frontend refactoring complete with all tests passing ✅

### 🚀 Inicio Rápido

**Para nuevos desarrolladores:**

1. Lee **[INDEX.md](./INDEX.md)** ← Empieza aquí (navegación central)
2. Configura: **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)**
3. Explora: **[docs/README.md](./docs/README.md)** (documentación completa)

**Acceso rápido por rol:**

- 👨‍💻 **Backend**: [Backend Guide](./docs/backend/README.md) | [API Endpoints](./docs/API_ENDPOINTS.md)
- 🎨 **Frontend**: [Frontend Guide](./docs/frontend/README.md) | [Type Safety](./docs/frontend/FRONTEND_TYPE_SAFETY.md)
- 🚀 **DevOps**: [Docker Guides](./docs/guides/docker/) | [Quick Start](./docs/guides/QUICK_START.md)
- 🤝 **Contributing**: [Code Standards](./docs/CONTRIBUTING.md)

### 📚 Documentación

Toda la documentación está centralizada en **[docs/README.md](./docs/README.md)**

Características principales:

- ✅ Autenticación JWT + 2FA (TOTP)
- ✅ Gestión de Citas con QR codes
- ✅ GDPR compliance con data deletion
- ✅ 100% TypeScript type safety (0 `any`)
- ✅ 97.8% test coverage (Jest + Supertest)
- ✅ Docker for dev/production
- ✅ CI/CD con GitHub Actions
- ✅ API Swagger/OpenAPI

---

## 🇬🇧 English Guides

Complete platform for psychology appointment management with **100% type safety**, **100% test pass rate** (92 passed, 1 skipped), and bilingual documentation (ES/EN).

**v0.2.0 Released**: Frontend refactoring complete with all tests passing ✅

### 🚀 Quick Start

**For new developers:**

1. Read **[INDEX.md](./INDEX.md)** ← Start here (central navigation)
2. Setup: **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)**
3. Explore: **[docs/README.md](./docs/README.md)** (complete documentation)

**Quick access by role:**

- 👨‍💻 **Backend**: [Backend Guide](./docs/backend/README.md) | [API Endpoints](./docs/API_ENDPOINTS.md)
- 🎨 **Frontend**: [Frontend Guide](./docs/frontend/README.md) | [Type Safety](./docs/frontend/FRONTEND_TYPE_SAFETY.md)
- 🚀 **DevOps**: [Docker Guides](./docs/guides/docker/) | [Quick Start](./docs/guides/QUICK_START.md)
- 🤝 **Contributing**: [Code Standards](./docs/CONTRIBUTING.md)

### 📚 Documentation

All documentation is centralized in **[docs/README.md](./docs/README.md)**

Key features:

- ✅ JWT Authentication + 2FA (TOTP)
- ✅ Appointment Management with QR codes
- ✅ GDPR compliance with data deletion
- ✅ 100% TypeScript type safety (0 `any`)
- ✅ 97.8% test coverage (Jest + Supertest)
- ✅ Docker for dev/production
- ✅ CI/CD with GitHub Actions
- ✅ API Swagger/OpenAPI

---

## 📋 Project Structure

```
psychology-assistant/
├── INDEX.md                     ← Central navigation (new developers)
├── DEVELOPMENT_GUIDE.md         ← Setup guide
├── PROJECT_STATUS.md            ← Current metrics
├── README.md                    ← This file
│
├── docs/                        ← Centralized documentation
│   ├── README.md               ← Documentation index
│   ├── guides/                 ← Quick guides
│   │   ├── QUICK_START.md     ← Step-by-step setup
│   │   ├── DOCKER.md          ← Docker general guide
│   │   └── docker/            ← Docker-specific docs
│   │       ├── QUICK_REFERENCE.md
│   │       ├── SETUP_DEPLOYMENT.md
│   │       └── TECHNICAL_VERIFICATION.md
│   ├── backend/               ← Backend documentation
│   ├── frontend/              ← Frontend documentation
│   ├── CONTRIBUTING.md        ← Contribution guidelines
│   └── ...
│
├── src/                        ← Backend Node.js code
├── frontend/                   ← Angular application
├── docker-compose.yml          ← Production Docker
└── package.json                ← Dependencies
```

│ ├── models/ # Esquemas Mongoose
│ ├── routes/ # Endpoints API
│ ├── middlewares/ # Auth, logging, rate limiting
│ ├── services/ # Lógica reutilizable
│ └── **tests**/ # Tests unitarios
├── frontend/ # Angular application
│ ├── src/
│ └── public/
├── docs/ # Documentación completa
├── docker-compose.yml # Orquestación
└── package.json

````

### Stack Tecnológico

**Backend:** Node.js 18+ | Express.js | MongoDB | Mongoose
**Frontend:** Angular 17+ | TypeScript | Material Design
**Testing:** Jest | Supertest | Cypress
**DevOps:** Docker | Docker Compose | GitHub Actions
**Seguridad:** JWT | bcryptjs | 2FA (TOTP)

### Inicio Rápido

```bash
# 1. Instalar
pnpm install

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Iniciar Docker
docker-compose -f docker-compose.dev.yml up -d

# 4. Backend
npm run dev  # Puerto 5000

# 5. Frontend (en otra terminal)
cd frontend && ng serve --port 4200
````

### Testing

```bash
pnpm test              # Ejecutar tests
pnpm run test:watch   # Watch mode
pnpm run test:coverage # Con cobertura
```

---

## English Documentation

A complete REST API for managing psychology clinic appointments, built with Node.js, Express, and MongoDB. Includes JWT authentication, 2FA, data validation, logging, testing, and automatic documentation.

### Centralized Documentation

Complete project documentation is in the [`docs/`](docs/) folder

**Guides by Role:**

- 👨‍💻 **Backend Developer**: [Backend Guide](docs/backend/README.md)
- 🎨 **Frontend Developer**: [Frontend Guide](frontend/README.md)
- 🏗️ **Architect**: [Technical Audit](docs/audit/TECHNICAL_AUDIT.md)
- 🧪 **QA/Tester**: [Testing Guide](docs/backend/features/TESTING.md)
- 🚀 **DevOps**: [Quick Setup](docs/guides/QUICK_START.md)

**→ [View complete documentation](docs/README.md)**

### Features

- JWT + 2FA authentication with TOTP
- Appointment Management with QR codes
- Robust validation with express-validator
- MongoDB database with Mongoose
- Complete Testing: Jest + Supertest (97.8% pass rate)
- API Documentation with Swagger/OpenAPI
- Docker for development and production
- CI/CD with GitHub Actions
- GDPR compliance with audit trail
- Rate Limiting anti-DDoS protection

### Project Structure

```dir
psychology-assistant/
├── src/                    # Node.js Backend
│   ├── controllers/       # Business logic
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── middlewares/      # Auth, logging, rate limiting
│   ├── services/         # Reusable services
│   └── __tests__/        # Unit tests
├── frontend/             # Angular application
│   ├── src/
│   └── public/
├── docs/                 # Complete documentation
├── docker-compose.yml    # Orchestration
└── package.json
```

### Tech Stack

**Backend:** Node.js 18+ | Express.js | MongoDB | Mongoose  
**Frontend:** Angular 17+ | TypeScript | Material Design  
**Testing:** Jest | Supertest | Cypress  
**DevOps:** Docker | Docker Compose | GitHub Actions  
**Security:** JWT | bcryptjs | 2FA (TOTP)

### Quick Start

```bash
# 1. Install
pnpm install

# 2. Configure environment variables
cp .env.example .env

# 3. Start Docker
docker-compose -f docker-compose.dev.yml up -d

# 4. Backend
npm run dev  # Port 5000

# 5. Frontend (in another terminal)
cd frontend && ng serve --port 4200
```

### Testing

```bash
pnpm test              # Run tests
pnpm run test:watch   # Watch mode
pnpm run test:coverage # With coverage
```

---

## License & Contributing

MIT License - See [LICENSE](LICENSE) for details

Contributions welcome! Please create a pull request.

Las contribuciones son bienvenidas! Por favor crea un pull request.
