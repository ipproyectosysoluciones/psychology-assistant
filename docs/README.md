# 📚 Psychology Assistant - Documentación Completa

Índice centralizado de toda la documentación del proyecto Psychology Assistant.

---

## 📖 Guías Rápidas

### 🚀 [Inicio Rápido](./guides/QUICK_START.md)
Instrucciones paso a paso para configurar el proyecto por primera vez.

### 🎯 [Visión General del Proyecto](./guides/PROJECT_OVERVIEW.md)
Estado actual, features completadas y objetivos alcanzados.

---

## 🔧 Backend

### 📚 [Guía del Backend](./backend/README.md)
Descripción completa de la architectura, endpoints y features del backend Node.js + Express.

### 🔐 Features Backend
- **[GDPR Data Deletion](./backend/features/GDPR_FEATURE.md)** - Cumplimiento GDPR con eliminación de datos
- **[Authentication & 2FA](./backend/ENVIRONMENT_CONFIG.md)** - Sistema de autenticación JWT + TOTP
- **[Testing](./backend/features/TESTING.md)** - Cobertura de tests (89.8% de pass rate)

### ⚙️ Configuración Backend
- **[Guía de Configuración](./backend/ENVIRONMENT_SETUP.md)** - Setup de variables de entorno
- **[Detalles de Configuración](./backend/ENVIRONMENT_CONFIG.md)** - Documentación de variables

---

## 🎨 Frontend

### 📚 [Guía del Frontend](./frontend/README.md)
Descripción de la architectura Angular, componentes y type safety.

### 🔐 Features Frontend
- **[Type Safety](./frontend/FRONTEND_TYPE_SAFETY.md)** - 100% type safe con 0 `any` types

---

## 📊 Reportes e Información

### 🔍 [Auditoría Técnica](./audit/TECHNICAL_AUDIT.md)
Análisis detallado de la calidad del código, seguridad y mejores prácticas.

### 🔄 [Reporte de Orquestación](./guides/ORCHESTRATOR.md)
Detalles técnicos de cómo se ejecutaron las tareas y mejoras implementadas.

---

## 🎓 Estructura de Carpetas

```
docs/
├── README.md (este archivo)
├── backend/
│   ├── README.md - Guía del backend
│   ├── ENVIRONMENT_SETUP.md
│   ├── ENVIRONMENT_CONFIG.md
│   └── features/
│       ├── GDPR_FEATURE.md
│       └── TESTING.md
├── frontend/
│   ├── README.md - Guía del frontend
│   └── FRONTEND_TYPE_SAFETY.md
├── guides/
│   ├── QUICK_START.md
│   ├── PROJECT_OVERVIEW.md
│   └── ORCHESTRATOR.md
└── audit/
    └── TECHNICAL_AUDIT.md
```

---

## 🔗 Documentación Adicional

Para información sobre configuración de ESLint, scripts y desarrollo:
- Ver [Raíz README.md](../README.md) - Visión general del proyecto
- Ver [Frontend README.md](../frontend/README.md) - Guía del frontend Angular

---

## 📋 Checklist de Lectura Recomendada

Según tu rol:

### 👨‍💻 Desarrollador Nuevo
1. [Inicio Rápido](./guides/QUICK_START.md)
2. [Project Overview](./guides/PROJECT_OVERVIEW.md)
3. [Backend README](./backend/README.md)
4. [Frontend README](./frontend/README.md)

### 🏗️ Arquitecto
1. [Auditoría Técnica](./audit/TECHNICAL_AUDIT.md)
2. [Backend README](./backend/README.md)
3. [Frontend README](./frontend/README.md)
4. [GDPR Feature](./backend/features/GDPR_FEATURE.md)

### 🧪 QA / Tester
1. [Testing Report](./backend/features/TESTING.md)
2. [Quick Start](./guides/QUICK_START.md)
3. [GDPR Feature](./backend/features/GDPR_FEATURE.md)

---

## ✅ Status del Proyecto

- **Versión**: 1.0.0  
- **Estado**: ✅ **PRODUCTION READY**  
- **Test Coverage**: 89.8% (53/59 tests)  
- **Type Safety**: 100% (0 `any` types)  
- **Último Update**: 6 de marzo, 2026

---

**Para preguntas o reportar problemas**, revisa la sección correspondiente en la documentación.
