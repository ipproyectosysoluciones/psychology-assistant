# 🎨 Frontend - Psychology Assistant UI

**Aplicación Angular moderna para gestión de citas psicológicas / Modern Angular application for psychology appointment management**

**English / Español:**
- [🇬🇧 Frontend Guide in English](#-english-frontend-guide)
- [🇪🇸 Guía Frontend en Español](#-guía-frontend-en-español)

---

## Guía Frontend en Español

### 📖 Resumen

La aplicación frontend de Psychology Assistant es una **aplicación Angular 21+ moderna** con:
- ✅ **100% Type Safe** - Cero `any` types, 14 interfaces comprensivas
- ✅ **Todos los Componentes** - Auth, dashboard, citas, perfil usuario
- ✅ **UI Moderna** - Angular Material, responsive, SCSS
- ✅ **Herramientas Calidad** - ESLint, Prettier, Vitest

### 📊 Quick Facts

| Aspecto | Detalles |
|---------|----------|
| **Framework** | Angular 21+ |
| **Lenguaje** | TypeScript 5.9+ (100% type safe) |
| **Styling** | SCSS + Angular Material |
| **Estado** | Services + RxJS |
| **Type Safety** | 100% (0 `any` types) |
| **Testing** | Vitest + JSDOM |
| **Code Quality** | ESLint + Prettier |
| **Production Ready** | ✅ YES |

### 🔗 Links Rápidos

- [Frontend Completo](../../frontend/README.md) - Guía de setup y desarrollo completo
- [Type Safety](./FRONTEND_TYPE_SAFETY.md) - Interfaces TypeScript y tipos
- [Features](./features/) - Documentación de características específicas

### 🚀 Características

#### ✅ Type Safety
- **100% Type Safe** - Cero `any` types
- **14 Interfaces Comprensivas** - Modelos para todas las respuestas API
- **TypeScript Strict** - Verificación de tipos completa
- **ApiResponse<T> Genérica** - Manejo type-safe de API

#### ✅ Componentes Completos
- **Autenticación** - login, register, setup 2FA
- **Dashboard** - Información usuario + overview citas
- **Citas** - Lista, detalle, crear, editar, cancelar
- **Perfil Usuario** - Editar perfil, cambiar contraseña
- **Autenticación Dos Factores** - Setup TOTP con código QR

#### ✅ Services Tipados
- **AuthService** - Autenticación + refresh token
- **UserService** - Perfil + gestión contraseña
- **AppointmentService** - Operaciones CRUD en citas
- **Todos completamente tipados** - 15 métodos con typings completos

#### ✅ UI/UX
- **Angular Material** - Componentes modernos
- **Responsive Design** - Mobile-first
- **SCSS Modules** - Estilos scoped
- **Route Guards** - Rutas protegidas con auth
- **Error Handling** - Mensajes user-friendly

#### ✅ Herramientas Desarrollo
- **Angular CLI** - Code generation & build
- **ESLint** - Calidad código
- **Prettier** - Code formatting
- **Vitest** - Unit testing

### 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/
│   │   ├── app.config.ts      # Configuración Angular
│   │   ├── app.routes.ts      # Definición de rutas
│   │   ├── auth/              # Login, register, 2FA
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── two-fa-setup/
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── appointments/      # CRUD citas
│   │   │   ├── appointment-list/
│   │   │   ├── appointment-detail/
│   │   │   ├── appointment-create/
│   │   │   └── appointment-calendar/
│   │   ├── users/
│   │   │   └── profile/       # Perfil usuario
│   │   ├── guards/
│   │   │   └── auth-guard.ts  # Protección rutas
│   │   ├── services/
│   │   │   ├── auth.service.ts       # TIPADO ✅
│   │   │   ├── user.service.ts       # TIPADO ✅
│   │   │   └── appointment.service.ts # TIPADO ✅
│   │   ├── models/
│   │   │   └── index.ts       # 14 interfaces
│   │   ├── interceptors/
│   │   │   └── auth-interceptor.ts
│   │   └── app.ts             # Componente raíz
│   ├── environments/          # Archivos configuración
│   ├── styles/                # SCSS global
│   └── index.html
├── angular.json               # Configuración Angular
├── .eslintrc.cjs             # Reglas ESLint
├── .prettierrc                # Reglas Prettier
├── package.json               # Scripts + dependencias
├── tsconfig.json             # Configuración TypeScript
└── README.md                 # Documentación completa
```

### 🔐 Integración API

Frontend conecta a backend en `API_URL` configurada:
- **Desarrollo**: `http://localhost:5000/api`
- **Producción**: Configurado vía environment files

Todas las llamadas API están completamente tipadas a través de:
- `AuthService` - Login, 2FA, token refresh
- `UserService` - Perfil, contraseña, estadísticas
- `AppointmentService` - Operaciones CRUD

### 🧪 Testing

- **Framework**: Vitest
- **DOM**: JSDOM
- **Ubicación**: `*.spec.ts` junto a source
- **Coverage**: Target 80%+

Ejecutar tests:
```bash
pnpm test              # Todos los tests
pnpm test -- --watch  # Watch mode
pnpm test -- --coverage # Reporte cobertura
```

### 🛠️ Desarrollo

#### Prerrequisitos
- Node.js 18+
- pnpm o npm

#### Setup Local

```bash
cd frontend

# 1. Instalar dependencias
pnpm install

# 2. Servidor desarrollo
pnpm start
# Corre en http://localhost:4200

# 3. Tests
pnpm test

# 4. Verificación calidad
pnpm lint
pnpm format
```

#### Scripts Disponibles

```bash
pnpm start            # Dev server en :4200
pnpm build            # Producción build
pnpm test             # Jest tests
pnpm test -- --watch  # Watch mode
pnpm lint             # ESLint check
pnpm lint -- --fix    # Auto-fix
pnpm format           # Prettier format
pnpm quality          # Full check
```

### 🔒 Características Seguridad

- ✅ Autenticación JWT con refresh token
- ✅ HttpOnly cookie storage (backend)
- ✅ Validación input en todos los formularios
- ✅ XSS protection (Angular built-in)
- ✅ CORS configurado server-side
- ✅ Soporte 2FA con TOTP
- ✅ Rutas protegidas con AuthGuard

### 🚀 Deployment

#### Build Producción
```bash
pnpm build
# Output: dist/frontend/
```

#### Con Docker
```bash
# Desde directorio raíz
docker-compose up frontend
```

#### Deployment Manual
1. Build: `pnpm build`
2. Copia `dist/frontend/` a web server
3. Configura proxy para `/api/*`

### 📚 Documentación Adicional

- **[Backend API](../backend/README.md)** - Endpoints del servidor y setup
- **[Type Safety Guide](./FRONTEND_TYPE_SAFETY.md)** - Interfaces y tipos
- **[Contributing](../CONTRIBUTING.md)** - Cómo contribuir

---

## English Frontend Guide

### 📖 Overview

The Psychology Assistant frontend is a modern **Angular 21+ application** with:
- ✅ **100% Type Safe** - Zero `any` types, 14 comprehensive interfaces
- ✅ **All Components** - Auth, dashboard, appointments, user profile
- ✅ **Modern UI** - Angular Material, responsive design, SCSS
- ✅ **Quality Tools** - ESLint, Prettier, Vitest

### 📊 Quick Facts

| Aspect | Details |
|--------|---------|
| **Framework** | Angular 21+ |
| **Language** | TypeScript 5.9+ (100% type safe) |
| **Styling** | SCSS + Angular Material |
| **State** | Services + RxJS |
| **Type Safety** | 100% (0 `any` types) |
| **Testing** | Vitest + JSDOM |
| **Code Quality** | ESLint + Prettier |
| **Production Ready** | ✅ YES |

### 🔗 Quick Links

- [Complete Frontend](../../frontend/README.md) - Complete setup & development guide
- [Type Safety Guide](./FRONTEND_TYPE_SAFETY.md) - TypeScript interfaces & types
- [Features](./features/) - Feature-specific documentation

### 🚀 Features

#### ✅ Type Safety
- **100% Type Safe** - Zero `any` types
- **14 Comprehensive Interfaces** - Models for all API responses
- **Strict TypeScript** - Full type checking
- **Generic ApiResponse<T>** - Type-safe API handling

#### ✅ Complete Components
- **Authentication** - login, register, 2FA setup
- **Dashboard** - User info + appointment overview
- **Appointments** - List, detail, create, edit, cancel
- **User Profile** - Edit profile, change password
- **Two-Factor Auth** - TOTP QR code setup

#### ✅ Typed Services
- **AuthService** - Authentication + token refresh
- **UserService** - Profile + password management
- **AppointmentService** - CRUD operations on appointments
- **All fully typed** - 15 methods with complete typings

#### ✅ UI/UX
- **Angular Material** - Modern components
- **Responsive Design** - Mobile-first approach
- **SCSS Modules** - Scoped styling
- **Route Guards** - Protected routes with auth
- **Error Handling** - User-friendly messages

#### ✅ Development Tools
- **Angular CLI** - Code generation & build tools
- **ESLint** - Code quality
- **Prettier** - Code formatting
- **Vitest** - Unit testing

### 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── app.config.ts        # Angular config
│   │   ├── app.routes.ts        # Routes definition
│   │   ├── auth/               # Login, register, 2FA
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── two-fa-setup/
│   │   ├── dashboard/           # Main dashboard
│   │   ├── appointments/        # Appointment CRUD
│   │   │   ├── appointment-list/
│   │   │   ├── appointment-detail/
│   │   │   ├── appointment-create/
│   │   │   └── appointment-calendar/
│   │   ├── users/
│   │   │   └── profile/       # User profile
│   │   ├── guards/
│   │   │   └── auth-guard.ts  # Route protection
│   │   ├── services/
│   │   │   ├── auth.service.ts       # TYPED ✅
│   │   │   ├── user.service.ts       # TYPED ✅
│   │   │   └── appointment.service.ts # TYPED ✅
│   │   ├── models/
│   │   │   └── index.ts       # 14 interfaces
│   │   ├── interceptors/
│   │   │   └── auth-interceptor.ts
│   │   └── app.ts             # Root component
│   ├── environments/           # Config files
│   ├── styles/                # Global SCSS
│   └── index.html
├── angular.json               # Angular config
├── .eslintrc.cjs             # ESLint rules
├── .prettierrc                # Prettier rules
├── package.json               # Scripts + dependencies
├── tsconfig.json             # TypeScript config
└── README.md                 # Complete documentation
```

### 🔐 API Integration

Frontend connects to backend at configured `API_URL`:
- **Development**: `http://localhost:5000/api`
- **Production**: Set via environment files

All API calls are fully typed through:
- `AuthService` - Login, 2FA, token refresh
- `UserService` - Profile, password, stats
- `AppointmentService` - CRUD operations

### 🧪 Testing

- **Framework**: Vitest
- **DOM**: JSDOM
- **Location**: `*.spec.ts` alongside source
- **Coverage**: Aiming for 80%+

Run tests:
```bash
pnpm test              # All tests
pnpm test -- --watch  # Watch mode
pnpm test -- --coverage # Coverage report
```

### 🛠️ Development

#### Prerequisites
- Node.js 18+
- pnpm or npm

#### Local Setup

```bash
cd frontend

# 1. Install dependencies
pnpm install

# 2. Development server
pnpm start
# Runs on http://localhost:4200

# 3. Tests
pnpm test

# 4. Code quality check
pnpm lint
pnpm format
```

#### Available Scripts

```bash
pnpm start            # Dev server on :4200
pnpm build            # Production build
pnpm test             # Jest tests
pnpm test -- --watch  # Watch mode
pnpm lint             # ESLint check
pnpm lint -- --fix    # Auto-fix
pnpm format           # Prettier format
pnpm quality          # Full check
```

### 🔒 Security Features

- ✅ JWT authentication with refresh token
- ✅ HttpOnly cookie storage (backend)
- ✅ Input validation on all forms
- ✅ XSS protection (Angular built-in)
- ✅ CORS configured server-side
- ✅ 2FA with TOTP support
- ✅ Protected routes with AuthGuard

### 🚀 Deployment

#### Production Build
```bash
pnpm build
# Output: dist/frontend/
```

#### With Docker
```bash
# From root directory
docker-compose up frontend
```

#### Manual Deployment
1. Build: `pnpm build`
2. Copy `dist/frontend/` to web server
3. Configure proxy for `/api/*`

### 📚 Additional Documentation

- **[Backend API](../backend/README.md)** - Server endpoints and setup
- **[Type Safety Guide](./FRONTEND_TYPE_SAFETY.md)** - Interfaces and types
- **[Contributing](../CONTRIBUTING.md)** - How to contribute

---

**Status**: ✅ Production Ready  
**Last Updated**: March 11, 2026  
**Version**: 1.0.0  
**Type Safety**: 100% (0 any types)
