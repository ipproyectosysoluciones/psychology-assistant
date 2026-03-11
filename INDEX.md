# 📑 Psychology Assistant - Project Index

**Navigation / Navegación:**

- [🇬🇧 English](#english) | [🇪🇸 Español](#español)

---

## 🇪🇸 Español

> Para desarrolladores nuevos en el proyecto Psychology Assistant

### 🚀 Comenzar Aquí

1. **[README.md](./README.md)** - Introducción y características del proyecto (5 min)
2. **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** - Configuración del ambiente de desarrollo (10 min)
3. **[docs/guides/QUICK_START.md](./docs/guides/QUICK_START.md)** - Setup paso a paso (10 min)

### 📚 Documentación Completa

Toda la documentación está centralizada en **[docs/README.md](./docs/README.md)**

**Guías rápidas:**

- **[Docker](./docs/guides/docker/)** 🐳 - Desarrollo y deployment
- **[Backend](./docs/backend/README.md)** 🔧 - API REST, endpoints, autenticación
- **[Frontend](./docs/frontend/README.md)** 🎨 - Angular, TypeScript, Components
- **[Contributing](./docs/CONTRIBUTING.md)** 🤝 - Estándares de código y proceso

### 📊 Estado del Proyecto

- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Métricas, tests, cobertura actual
- **[DOCUMENTATION_STATUS.md](./DOCUMENTATION_STATUS.md)** - Estado de documentación

### 🐳 Docker Quick Commands

```bash
# Desarrollo - Ocho servicios completos
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Tests
docker-compose -f docker-compose.dev.yml exec app pnpm test

# Parar todo
docker-compose -f docker-compose.dev.yml down
```

**Más comandos:** [docs/guides/docker/QUICK_REFERENCE.md](./docs/guides/docker/QUICK_REFERENCE.md)

---

## 🇬🇧 English

> For developers new to Psychology Assistant project

### 🚀 Start Here

1. **[README.md](./README.md)** - Project introduction and features (5 min)
2. **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** - Development environment setup (10 min)
3. **[docs/guides/QUICK_START.md](./docs/guides/QUICK_START.md)** - Step-by-step setup (10 min)

### 📚 Complete Documentation

All documentation is centralized in **[docs/README.md](./docs/README.md)**

**Quick guides:**

- **[Docker](./docs/guides/docker/)** 🐳 - Development and deployment
- **[Backend](./docs/backend/README.md)** 🔧 - REST API, endpoints, authentication
- **[Frontend](./docs/frontend/README.md)** 🎨 - Angular, TypeScript, Components
- **[Contributing](./docs/CONTRIBUTING.md)** 🤝 - Code standards and process

### 📊 Project Status

- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Metrics, tests, current coverage
- **[DOCUMENTATION_STATUS.md](./DOCUMENTATION_STATUS.md)** - Documentation status

### 🐳 Docker Quick Commands

```bash
# Development - Full stack services
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Run tests
docker-compose -f docker-compose.dev.yml exec app pnpm test

# Stop everything
docker-compose -f docker-compose.dev.yml down
```

**More commands:** [docs/guides/docker/QUICK_REFERENCE.md](./docs/guides/docker/QUICK_REFERENCE.md)

---

## 📋 Project Structure

```
psychology-assistant/
├── README.md                    # Project overview (START HERE)
├── DEVELOPMENT_GUIDE.md         # Setup for development
├── PROJECT_STATUS.md            # Current status & metrics
├── DOCUMENTATION_STATUS.md      # Documentation overview
│
├── src/                         # Backend Node.js code
├── frontend/                    # Angular application
├── docs/                        # Centralized documentation
│   ├── README.md               # Documentation index (go here for guides)
│   ├── guides/
│   │   ├── QUICK_START.md      # Step-by-step setup
│   │   ├── DOCKER.md           # Docker general guide
│   │   ├── PROJECT_OVERVIEW.md # Project details
│   │   ├── ORCHESTRATOR.md     # Task orchestration
│   │   └── docker/             # Docker guides
│   │       ├── QUICK_REFERENCE.md
│   │       ├── SETUP_DEPLOYMENT.md
│   │       └── TECHNICAL_VERIFICATION.md
│   ├── backend/                # Backend documentation
│   ├── frontend/               # Frontend documentation
│   ├── audit/                  # Technical audit
│   ├── CONTRIBUTING.md         # Contributing guidelines
│   └── ...
│
├── docker-compose.yml          # Production Docker
├── docker-compose.dev.yml      # Development Docker
├── Dockerfile                  # Production backend image
└── package.json                # Backend dependencies
```

---

## 🎯 Quick Navigation by Role

### 👨‍💻 Backend Developer

1. Read: [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)
2. Setup: [docs/guides/QUICK_START.md](./docs/guides/QUICK_START.md)
3. Code: [docs/backend/README.md](./docs/backend/README.md)
4. Tests: Run `pnpm test`

### 🎨 Frontend Developer

1. Read: [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)
2. Setup: [docs/guides/QUICK_START.md](./docs/guides/QUICK_START.md)
3. Code: [docs/frontend/README.md](./docs/frontend/README.md)
4. Types: [docs/frontend/FRONTEND_TYPE_SAFETY.md](./docs/frontend/FRONTEND_TYPE_SAFETY.md)

### 🚀 DevOps / Deployment

1. Read: [docs/guides/docker/README.md](./docs/guides/docker/README.md)
2. Setup: [docs/guides/docker/SETUP_DEPLOYMENT.md](./docs/guides/docker/SETUP_DEPLOYMENT.md)
3. Config: [docs/backend/ENVIRONMENT_SETUP.md](./docs/backend/ENVIRONMENT_SETUP.md)
4. Verify: [docs/guides/docker/TECHNICAL_VERIFICATION.md](./docs/guides/docker/TECHNICAL_VERIFICATION.md)

### 👨‍💼 Project Manager

1. Status: [PROJECT_STATUS.md](./PROJECT_STATUS.md)
2. Overview: [docs/guides/PROJECT_OVERVIEW.md](./docs/guides/PROJECT_OVERVIEW.md)
3. Docs: [DOCUMENTATION_STATUS.md](./DOCUMENTATION_STATUS.md)

---

## ✨ Key Features

✅ **100% Type Safe** - Zero `any` types in frontend  
✅ **97.8% Test Coverage** - Backend tests passing  
✅ **Bilingual Documentation** - Spanish & English  
✅ **Production Ready** - Docker, security, monitoring  
✅ **Clean Architecture** - Organized code structure  
✅ **Best Practices** - ESLint, Prettier, conventional commits

---

## 🔗 Quick Links

| Need                       | Link                                                                             | Time   |
| -------------------------- | -------------------------------------------------------------------------------- | ------ |
| **Set up dev environment** | [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)                                   | 10 min |
| **Docker commands**        | [docs/guides/docker/QUICK_REFERENCE.md](./docs/guides/docker/QUICK_REFERENCE.md) | 5 min  |
| **Contribute code**        | [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md)                                   | 15 min |
| **Full documentation**     | [docs/README.md](./docs/README.md)                                               | 30 min |
| **Project status**         | [PROJECT_STATUS.md](./PROJECT_STATUS.md)                                         | 5 min  |

---

**Last Updated**: March 11, 2026  
**Language Support**: English & Español  
**Repository**: [ipproyectosysoluciones/psychology-assistant](https://github.com/ipproyectosysoluciones/psychology-assistant)
