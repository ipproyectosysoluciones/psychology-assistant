# 🐳 Docker Documentation - Documentación de Docker

**English / Español:**
- [🇬🇧 English Version](#-english-docker-guides)
- [🇪🇸 Versión en Español](#-guías-docker-en-español)

---

## 🇪🇸 Guías Docker en Español

Documentación completa sobre Docker para Psychology Assistant. Selecciona la guía que necesites según tu rol y necesidad.

### 📚 Guías Disponibles

#### 1. **[Guía General Docker](../DOCKER.md)** 🚀
   - **Para**: Todos los desarrolladores
   - **Propósito**: Entrada general a Docker en el proyecto
   - **Contenido**: Setup, configuración, ambiente dev/prod
   - **Tiempo de lectura**: 5-10 minutos

#### 2. **[Referencia Rápida](./QUICK_REFERENCE.md)** ⚡
   - **Para**: Desarrollo diario
   - **Propósito**: Comandos y troubleshooting rápido
   - **Contenido**: Comandos comunes, solución de problemas, flujos típicos
   - **Tiempo de lectura**: 3-5 minutos (referencia)

#### 3. **[Setup & Deployment](./SETUP_DEPLOYMENT.md)** 🚀
   - **Para**: DevOps, Setup inicial
   - **Propósito**: Detalles de implementación y mejoras
   - **Contenido**: Cambios realizados, antes/después, métricas
   - **Tiempo de lectura**: 10-15 minutos

#### 4. **[Verificación Técnica](./TECHNICAL_VERIFICATION.md)** 🔧
   - **Para**: Arquitectos, verificación exhaustiva
   - **Propósito**: Detalles técnicos completos
   - **Contenido**: Verificación, arquitectura, troubleshooting avanzado
   - **Tiempo de lectura**: 20-30 minutos

### 🎯 Elige por Tu Necesidad

| Necesidad | Leer | Tiempo |
|-----------|------|--------|
| **Iniciar desarrollo hoy** | Guía General + Referencia Rápida | 10 min |
| **Deploy a producción** | Setup & Deployment + Técnico | 30 min |
| **Solucionar problema** | Referencia Rápida (troubleshooting) | 5 min |
| **Entender completamente** | Todos los documentos en orden | 1 hora |
| **Verificar configuración** | Verificación Técnica | 20 min |

---

## 🇬🇧 English Docker Guides

Complete Docker documentation for Psychology Assistant. Choose the guide you need based on your role.

### 📚 Available Guides

#### 1. **[General Docker Guide](../DOCKER.md)** 🚀
   - **For**: All developers
   - **Purpose**: General Docker introduction for the project
   - **Content**: Setup, configuration, dev/prod environment
   - **Reading Time**: 5-10 minutes

#### 2. **[Quick Reference](./QUICK_REFERENCE.md)** ⚡
   - **For**: Daily development
   - **Purpose**: Quick commands and troubleshooting
   - **Content**: Common commands, problem solving, typical workflows
   - **Reading Time**: 3-5 minutes (reference)

#### 3. **[Setup & Deployment](./SETUP_DEPLOYMENT.md)** 🚀
   - **For**: DevOps, initial setup
   - **Purpose**: Implementation details and improvements
   - **Content**: Changes made, before/after, metrics
   - **Reading Time**: 10-15 minutes

#### 4. **[Technical Verification](./TECHNICAL_VERIFICATION.md)** 🔧
   - **For**: Architects, exhaustive verification
   - **Purpose**: Complete technical details
   - **Content**: Verification, architecture, advanced troubleshooting
   - **Reading Time**: 20-30 minutes

### 🎯 Choose by Your Need

| Need | Read | Time |
|------|------|------|
| **Start developing today** | General Guide + Quick Reference | 10 min |
| **Deploy to production** | Setup & Deployment + Technical | 30 min |
| **Solve a problem** | Quick Reference (troubleshooting) | 5 min |
| **Understand completely** | All documents in order | 1 hour |
| **Verify configuration** | Technical Verification | 20 min |

---

## 📊 Documentation Structure

```
docs/guides/
├── DOCKER.md                  # Main entry point (bilingual)
└── docker/
    ├── README.md              # This file (guide selection)
    ├── QUICK_REFERENCE.md     # Daily reference
    ├── SETUP_DEPLOYMENT.md    # Implementation details
    └── TECHNICAL_VERIFICATION.md  # Complete technical info
```

---

## 🔗 Related Documentation

- **[Main Docs Index](../README.md)** - Complete project documentation
- **[Project Overview](./PROJECT_OVERVIEW.md)** - Full project status
- **[Quick Start](./QUICK_START.md)** - Initial project setup
- **[Contributing Guide](../../CONTRIBUTING.md)** - Development standards

---

## ✨ Key Features Documented

- ✅ Development environment setup (frontend + backend + MongoDB)
- ✅ Production deployment configuration
- ✅ Health checks and monitoring
- ✅ Environment variables and secrets management
- ✅ Common commands and troubleshooting
- ✅ Service architecture and dependencies
- ✅ Security best practices

---

## 🚀 Quick Start Commands

```bash
# Development - Start everything
docker-compose -f docker-compose.dev.yml up -d

# Development - View logs
docker-compose -f docker-compose.dev.yml logs -f

# Production - Start services
docker-compose up -d

# Stop everything
docker-compose down
```

For more commands, see [Quick Reference](./QUICK_REFERENCE.md)

---

**Last Updated**: March 11, 2026  
**Bilingual Support**: ES / EN  
**Status**: ✅ Complete & Verified
