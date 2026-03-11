# 🎨 Frontend - Psychology Assistant UI

**Modern Angular Application for Psychology Appointment Management**  
Built with Angular 21+, TypeScript, Angular Material, RxJS & 100% Type Safe

**English / Español:**

- [🇬🇧 English Guide](#-english-guide)
- [🇪🇸 Guía en Español](#-guía-en-español)

---

## 🇪🇸 Guía en Español

### Descripción

Aplicación Angular moderna para la gestión de citas psicológicas con:

- **100% Type Safe** - Cero `any` types, 14 interfaces completas
- **Todos los Componentes** - Autenticación, dashboard, citas, perfil
- **UI Moderna** - Angular Material, responsive, SCSS
- **Herramientas Calidad** - ESLint, Prettier, Vitest

Para más detalles ver la documentación completa en [`docs/frontend/README.md`](../docs/frontend/README.md)

---

## 🇬🇧 English Guide

### Description

## 📊 Quick Facts

| Aspecto              | Detalles                |
| -------------------- | ----------------------- |
| **Framework**        | Angular 21+             |
| **Language**         | TypeScript 5.9+         |
| **Styling**          | SCSS + Angular Material |
| **State**            | Services + RxJS         |
| **Type Safety**      | 100% (0 `any` types)    |
| **Testing**          | Vitest + JSDOM          |
| **Code Quality**     | ESLint + Prettier       |
| **Production Ready** | ✅ YES                  |

---

## 🚀 Características

### ✅ Type Safety

- **100% Type Safe** - Zero `any` types
- **14 Comprehensive Interfaces** - Models for all API responses
- **Strict TypeScript Config** - Full type checking
- **Generic ApiResponse<T>** - Type-safe API handling

Detalles en [FRONTEND_TYPE_SAFETY.md](../docs/frontend/FRONTEND_TYPE_SAFETY.md)

### ✅ Components Completos

- **Authentication** - login, register, 2FA setup
- **Dashboard** - User info + appointment overview
- **Appointments** - List, detail, create, edit, cancel
- **User Profile** - Edit profile, change password
- **Two-Factor Auth** - TOTP QR code setup

### ✅ Services Typados

- **AuthService** - Authentication + token refresh
- **UserService** - Profile + password management
- **AppointmentService** - CRUD operations en citas
- **All fully typed** - 15 methods with complete typings

### ✅ UI/UX

- **Angular Material** - Modern components
- **Responsive Design** - Mobile-first approach
- **SCSS Modules** - Scoped styling
- **Route Guards** - Protected routes with auth
- **Error Handling** - User-friendly messages

### ✅ Development Tools

- **Angular CLI** - Code generation & build tools
- **ESLint** - Code quality (NEW)
- **Prettier** - Code formatting
- **Vitest** - Unit testing

---

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/
│   │   ├── app.config.ts      # Angular config
│   │   ├── app.routes.ts      # Route definitions
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── two-fa-setup/
│   │   ├── dashboard/         # Main dashboard
│   │   ├── appointments/
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
│   ├── environments/          # Config files
│   ├── styles/                # Global SCSS
│   └── index.html
├── angular.json               # Angular config
├── tsconfig.json             # TypeScript config
├── .eslintrc.cjs             # ESLint config (NEW)
├── .prettierrc                # Prettier config
├── package.json              # Scripts + deps
└── README.md                 # Este archivo
```

---

## 🔐 Key Interfaces (Type Safety)

```typescript
// Authentication
interface User {
  id;
  name;
  email;
  role;
  twoFAEnabled;
  isActive;
  lastLogin;
  createdAt;
}
interface AuthResponse {
  user;
  accessToken;
  refreshToken;
}
interface TwoFASetupResponse {
  qrCode;
  secret;
}

// Appointments
interface Appointment {
  id;
  user;
  date;
  duration;
  description;
  status;
  notes;
  reminderSent;
  createdAt;
  updatedAt;
  qrCode;
}
interface CreateAppointmentData {
  date;
  duration?;
  description;
  notes?;
}

// API Responses
interface ApiResponse<T> {
  success;
  data: T;
  message;
}
interface ApiError {
  code;
  message;
  timestamp;
}

// And 8 more...
```

Ver [FRONTEND_TYPE_SAFETY.md](../docs/frontend/FRONTEND_TYPE_SAFETY.md) para lista completa.

---

## 🛠️ Development

### Prerrequisitos

- Node.js 18+
- npm/pnpm package manager
- Angular CLI 21+

### Setup Local

```bash
# 1. Install dependencies
pnpm install

# 2. Start development server
pnpm start

# 3. Navigate to http://localhost:4200/

# 4. Build for production
pnpm build

# 5. Run tests
pnpm test

# 6. Check code quality
pnpm run lint
pnpm run format
```

### Available Scripts

```bash
pnpm start              # ng serve (http://localhost:4200)
pnpm build              # Production build
pnpm test               # Run Vitest unit tests
pnpm lint               # ESLint check + fix
pnpm lint:check         # ESLint check only
pnpm format             # Prettier format code
pnpm format:check       # Prettier check only
pnpm quality            # Run lint + format + test
pnpm watch              # Watch builds during development
```

---

## 📊 Services API

### AuthService

```typescript
login(email, password): Observable<AuthResponse>
register(name, email, password): Observable<AuthResponse>
logout(): Observable<void>
enable2FA(): Observable<TwoFASetupResponse>
verify2FA(token): Observable<{ twoFAEnabled: boolean }>
refreshToken(): Observable<{ accessToken: string }>
```

### UserService

```typescript
getProfile(): Observable<{ user: User }>
updateProfile(data): Observable<{ user: User }>
changePassword(current, newPassword): Observable<{ passwordChanged: boolean }>
deactivate(password): Observable<{ accountDeactivated: boolean }>
getStats(): Observable<{ stats: UserStats }>
```

### AppointmentService

```typescript
getAppointments(page?, limit?, status?): Observable<AppointmentsResponse>
getAppointment(id): Observable<{ appointment: Appointment }>
createAppointment(data): Observable<{ appointment: Appointment }>
updateAppointment(id, data): Observable<{ appointment: Appointment }>
cancelAppointment(id): Observable<void>
```

---

## 🔒 Security Features

### Authentication

- JWT tokens stored in HttpOnly cookies (backend managed)
- Automatic token refresh on 401
- Login/logout guards
- 2FA with TOTP tokens

### Input Validation

- Form validation on all inputs
- API error handling + user feedback
- XSS protection (Angular built-in)
- CORS configured server-side

### Protected Routes

- AuthGuard on private routes
- Redirect to login if unauthorized
- Profile only for authenticated users

---

## 📱 Responsive Design

- **Mobile First** - Optimized for small screens
- **Tablet** - Touch-friendly UI
- **Desktop** - Full-featured layout
- **Angular Material** - Semantic responsive components

---

## 🧪 Testing

### Test Files

- Located alongside components (`*.spec.ts`)
- Vitest runner
- JSDOM for DOM testing
- 100% type-safe tests

### Running Tests

```bash
pnpm test              # Run all tests
pnpm test -- watch    # Watch mode
pnpm test -- coverage # Coverage report
```

---

## 🚀 Build & Deployment

### Development Build

```bash
pnpm build --configuration development
```

### Production Build

```bash
pnpm build --configuration production
```

Build artifacts go to `dist/`

### Deployment

```bash
# Using Docker (managed by root docker-compose.yml)
docker-compose up frontend

# Manual host
# Copy dist/frontend to your web server
```

---

## 🔧 Configuration Files

### angular.json

- Build & serve configurations
- Asset definitions
- Scripts inclusions

### tsconfig.json

- Strict type checking
- Module resolution
- Target ES2022

### .eslintrc.cjs (NEW)

- Code quality rules
- TypeScript linting
- Consistent formatting

### .prettierrc

- Code formatting rules
- Line length, quotes, semicolons, etc

---

## 🎓 Code Quality Standards

### ESLint Rules

- ✅ No console.log in production code
- ✅ No unused variables
- ✅ Prefer const over let
- ✅ No var declarations
- ✅ End of line required
- ✅ No trailing commas

### Prettier Standards

- ✅ 80 character line length
- ✅ Single quotes for strings
- ✅ Semicolons required
- ✅ Trailing commas in multiline
- ✅ Consistent formatting

### TypeScript Standards

- ✅ Strict mode enabled
- ✅ No implicit any
- ✅ Full type checking
- ✅ No any types allowed

---

## 📚 Documentación Adicional

- **[Type Safety Details](../docs/frontend/FRONTEND_TYPE_SAFETY.md)** - Interfaces & typing
- **[Backend Integration](../docs/backend/README.md)** - API endpoints
- **[Project Setup](../docs/guides/QUICK_START.md)** - Full setup guide
- **[Main Docs](../docs/README.md)** - Overall documentation

---

## 🔗 Environment Configuration

Frontend connects to backend defined in:

```
src/environments/environment.ts     # Development
src/environments/environment.prod.ts # Production
```

Update API_URL and FRONTEND_URL as needed.

---

## 🚨 Troubleshooting

### Port 4200 already in use?

```bash
ng serve --port 4300
```

### Module not found errors?

```bash
pnpm install
rm -rf node_modules/.angular
pnpm install
```

### TypeScript errors?

```bash
pnpm run lint
pnpm run format
```

---

## 📞 Support

For issues:

1. Check [docs/guides/QUICK_START.md](../docs/guides/QUICK_START.md)
2. Review component .spec.ts files for usage
3. Check [Type Safety](../docs/frontend/FRONTEND_TYPE_SAFETY.md) guide
4. See [Backend README](../docs/backend/README.md) for API details

---

**Status**: ✅ Production Ready  
**Last Updated**: March 6, 2026  
**Version**: 1.0.0
