# 📚 Psychology Assistant - Documentation Index

> 🌐 **English** | [📖 **Español**](#español)

---

## Quick Navigation

**Welcome to the Psychology Assistant project documentation!** This is your central hub for all project information.

### 🚀 New to the Project?
Start here → [Getting Started Guide](./01-getting-started/README.md)

### 🏗️ Want to understand the Architecture?
→ [Architecture Overview](./02-architecture/README.md)

### 💻 Building the API?
→ [API Documentation](./03-api/README.md)

### 📖 Need Implementation Guides?
→ [Development Guides](./04-guides/README.md)

### 🐳 Setting up Docker/CI-CD?
→ [Infrastructure Setup](./05-infrastructure/README.md)

### 🗄️ Working with the Database?
→ [Database Schema](./06-database/README.md)

### 🧪 Testing & Quality Assurance?
→ [Testing Reports](./07-testing/README.md)

---

## 📋 Documentation Structure

```
docs/
├── 01-getting-started/     🚀 Setup, versions & beginning
│   ├── README.md          - Quick Start Guide
│   ├── INSTALLATION.md    - Installation & Setup
│   ├── REQUIREMENTS.md    - System Requirements
│   ├── CHANGELOG.md       - Version History & Changes
│   ├── RELEASE_NOTES.md   - v0.4.0 Release Details
│   ├── CONTRIBUTING.md    - Contribution Guidelines
│   └── README_MAIN.md     - Main README copy
│
├── 02-architecture/        🏗️ System design & environment
│   ├── README.md          - Architecture Overview
│   ├── ENVIRONMENT_SETUP.md - Environment Variables
│   ├── ENVIRONMENT_CONFIG.md - Configuration Reference
│   └── audit/             - Technical Audit Reports
│
├── 03-api/                💻 API Reference & Frontend
│   ├── README.md          - API Overview
│   ├── API_ENDPOINTS.md   - Complete Endpoint Reference
│   ├── CRM_SPECIFICATION.md - CRM System Details
│   └── FRONTEND_TYPE_SAFETY.md - TypeScript Patterns
│
├── 04-guides/             📖 How-to guides & procedures
│   ├── README.md          - Guides Overview
│   ├── QUICK_START.md     - 5-minute Setup
│   ├── ORCHESTRATOR.md    - Agent System Guide
│   ├── PROJECT_OVERVIEW.md - Project Structure
│   └── DOCKER.md          - Docker Best Practices
│
├── 05-infrastructure/      🐳 Docker, CI/CD & Deployment
│   ├── README.md          - Infrastructure Overview
│   ├── DEPLOYMENT.md      - Complete Deployment Guide
│   └── DOCKER.md          - Docker Setup & Optimization
│
├── 06-database/           🗄️ Database & Data Models
│   ├── README.md          - Database Overview
│   └── DATABASE.md        - Schema & Model Reference
│
├── 07-testing/            🧪 Testing & Quality Assurance
│   ├── README.md          - Testing Overview
│   └── TESTING_REPORT.md  - v0.4.0 Test Validation
│
└── INDEX.md               (This file)
```

---

## 🌟 Key Documents at a Glance

| Document | Purpose | Status |
|----------|---------|--------|
| [Getting Started](./01-getting-started/README.md) | Environment setup & first run | ✅ Ready |
| [Architecture](./02-architecture/README.md) | System design overview | ✅ Complete |
| [API Reference](./03-api/API_ENDPOINTS.md) | All endpoints documented | ✅ Current |
| [Deployment Guide](./05-infrastructure/DEPLOYMENT.md) | Production deployment | ✅ Ready v0.4.0 |
| [Docker Setup](./05-infrastructure/DOCKER.md) | Containerization guide | ✅ Optimized |
| [Release Notes](./01-getting-started/RELEASE_NOTES.md) | v0.4.0 release details | ✅ Released |
| [Database Schema](./06-database/DATABASE.md) | MongoDB schema & models | ✅ Complete |
| [Testing Report](./07-testing/TESTING_REPORT.md) | v0.4.0 test results | ✅ 97.4% Pass |

---

## 📖 Key Features Overview

### Authentication & Security
- [JWT Authentication](./03-api/AUTHENTICATION.md) | 2FA with TOTP | Rate Limiting | Audit Logging

### Core Functionality
- [Patient Management](./03-api/API_ENDPOINTS.md#patients) | [Therapist Management](./03-api/API_ENDPOINTS.md#therapists) | [Appointments](./03-api/API_ENDPOINTS.md#appointments) | [Medical Records](./03-api/API_ENDPOINTS.md#medical-records)

### Infrastructure
- [Docker Optimization](./05-infrastructure/DOCKER.md) | [CI/CD Pipelines](./05-infrastructure/CI_CD.md) | [GitHub Container Registry](./05-infrastructure/CI_CD.md#registry)

### Quality
- [97.4% Test Coverage](./07-testing/TESTING_REPORT_v0.4.0.md) | [Zero Lint Errors](./07-testing/TESTING_REPORT_v0.4.0.md#code-quality) | [TypeScript Strict Mode](./07-testing/TESTING_REPORT_v0.4.0.md#typescript)

---

## 🔄 Project Lifecycle

```
Development Branch
       ↓
    Testing & QA
       ↓
    Create PR
       ↓
    Code Review
       ↓
    Merge to Main
       ↓
Release (v0.x.0)
       ↓
Deploy Staging
       ↓
Deploy Production
```

See: [Development Guide](./04-guides/DEVELOPMENT.md) → [Deployment](./04-guides/DEPLOYMENT.md)

---

## 📊 Current Project Status

**Version**: v0.4.0  
**Release Date**: March 12, 2026  
**Status**: ✅ **PRODUCTION READY**

| Component | Status |
|-----------|--------|
| Backend | ✅ 37/38 tests (97.4%) |
| Frontend | ✅ Build OK, components functional |
| Docker | ✅ Images optimized (63-95% reduction) |
| CI/CD | ✅ 5 workflows automated |
| Documentation | ✅ 1600+ lines |
| Security | ✅ Hardened (non-root, caps drop) |

See [Complete Release Notes](../v0.4.0_RELEASE_NOTES.md)

---

## 🎯 Getting Help

### Common Questions?
→ See [Contributors Guide](./01-getting-started/CONTRIBUTING.md)

### How to Deploy?
→ See [Deployment Guide](./05-infrastructure/DEPLOYMENT.md)

### Understanding the API?
→ Read [API Reference](./03-api/README.md)

### Report an Issue?
→ See [Contributing Guide](./01-getting-started/CONTRIBUTING.md)

---

## 🔗 Important Links

- **GitHub Repository**: ipproyectosysoluciones/psychology-assistant
- **Project Version**: v0.4.0
- **Node.js Version**: 18.x, 20.x
- **MongoDB**: 6.0+
- **Angular**: 21+

---

## 📝 Documentation Versions

| Doc Version | Project Version | Date | Status |
|-------------|-----------------|------|--------|
| 2.0 | v0.4.0 | Mar 12, 2026 | Current ✅ |
| 1.0 | v0.3.0 | Mar 11, 2026 | Previous |

---

<h2 id="español">📖 Español</h2>

# 📚 Psychology Assistant - Índice de Documentación

> [**English**](#quick-navigation) | 📖 **Español**

---

## Navegación Rápida

**¡Bienvenido a la documentación de Psychology Assistant!** Este es tu centro de información.

### 🚀 ¿Nuevo en el Proyecto?
Comienza aquí → [Guía de Inicio](./01-getting-started/README.md)

### 🏗️ ¿Quieres entender la Arquitectura?
→ [Vista General de Arquitectura](./02-architecture/README.md)

### 💻 ¿Construyendo la API?
→ [Documentación de API](./03-api/README.md)

### 📖 ¿Necesitas Guías de Implementación?
→ [Guías de Desarrollo](./04-guides/README.md)

### 🐳 ¿Configurando Docker/CI-CD?
→ [Configuración de Infraestructura](./05-infrastructure/README.md)

### 🗄️ ¿Trabajando con la Base de Datos?
→ [Schema de Base de Datos](./06-database/README.md)

### 🧪 ¿Testing y Aseguramiento de Calidad?
→ [Reportes de Testing](./07-testing/README.md)

---

## 📊 Estado Actual del Proyecto

**Versión**: v0.4.0  
**Fecha de Lanzamiento**: 12 de Marzo de 2026  
**Estado**: ✅ **LISTO PARA PRODUCCIÓN**

| Componente | Estado |
|------------|--------|
| Backend | ✅ 37/38 tests (97.4%) |
| Frontend | ✅ Build OK, componentes funcionales |
| Docker | ✅ Imágenes optimizadas (63-95% reducción) |
| CI/CD | ✅ 5 workflows automatizados |
| Documentación | ✅ 1600+ líneas |
| Seguridad | ✅ Endurecida (non-root, caps drop) |

Ver: [Notas Completas de Lanzamiento](../v0.4.0_RELEASE_NOTES.md)

---

## 💡 Preguntas Frecuentes?

### ¿Cómo empiezo?
→ Lee [Guía de Inicio Rápido](./01-getting-started/README.md)

### ¿Cómo hago deploy?
→ Consulta [Guía de Deployment](./04-guides/DEPLOYMENT.md)

### ¿Cómo entiendo la API?
→ Lee [Referencia de API](./03-api/README.md)

### ¿Cómo reporto un issue?
→ Mira [Guía de Contribución](./04-guides/CONTRIBUTING.md)

---

*Last Updated: March 12, 2026*  
*Documentation Version: 2.0*  
*Project Version: v0.4.0*
