# 🎨 Frontend Documentation

## Overview

The Psychology Assistant frontend is a modern **Angular 21+ application** with:
- ✅ **100% Type Safe** - Zero `any` types, 14 comprehensive interfaces
- ✅ **All Components** - Auth, dashboard, appointments, user profile
- ✅ **Modern UI** - Angular Material, responsive design, SCSS
- ✅ **Quality Tools** - ESLint, Prettier, Vitest

## Quick Links

| Resource | Purpose |
|----------|---------|
| [Frontend README](../../frontend/README.md) | Complete setup & development guide |
| [Type Safety Guide](./FRONTEND_TYPE_SAFETY.md) | TypeScript interfaces & types |
| [features/](./features/) | Feature-specific documentation |

## Key Info

**Location**: `/frontend/` (independent from backend)

**Technology Stack**:
- Angular 21.2+
- TypeScript 5.9+ (100% type safe)
- Angular Material + SCSS
- RxJS + Observables
- Vitest for testing

**Development**:
```bash
cd frontend
pnpm install      # Install dependencies
pnpm start        # Dev server on :4200
pnpm test         # Run unit tests  
pnpm lint         # Check code quality
pnpm format       # Auto-format code
pnpm quality      # Full quality check
```

**Key Files**:
- `src/app/` - Components & services
- `src/app/services/` - Type-safe API services (auth, user, appointment)
- `src/app/models/index.ts` - 14 TS interfaces

## Type Safety Achievement

✅ **ZERO** `any` types in entire codebase
✅ 14 comprehensive interfaces 
✅ Full strict TypeScript configuration
✅ No unsafe `Object` casts
✅ Complete type coverage

See [FRONTEND_TYPE_SAFETY.md](./FRONTEND_TYPE_SAFETY.md) for details.

## Features

### Authentication
- Login/Register forms
- JWT token management
- 2FA setup with QR codes
- Session refresh

### Dashboard
- User information display
- Appointment overview
- Quick links to features

### Appointments
- List with filtering
- Detail view
- Create new appointment
- Edit/Cancel operations
- Calendar view

### User Profile
- Profile information
- Password change
- Account deactivation
- Statistics view

## Code Quality

**ESLint Config** (NEW):
- ✅ TypeScript parser
- ✅ No console.log in production
- ✅ No unused variables
- ✅ Prefer const over let
- ✅ No any types

**Prettier Config**:
- ✅ 80 char line length
- ✅ Single quotes
- ✅ Trailing commas in multiline
- ✅ Consistent formatting

## File Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── app.config.ts        # Angular config
│   │   ├── app.routes.ts        # Routes definition
│   │   ├── app.ts               # Root component
│   │   ├── auth/               # Login, register, 2FA
│   │   ├── dashboard/           # Main dashboard
│   │   ├── appointments/        # Appointment CRUD
│   │   ├── users/              # Profile page
│   │   ├── services/           # API services (typed)
│   │   ├── models/             # TypeScript interfaces
│   │   ├── guards/             # Auth protection
│   │   └── interceptors/       # HTTP/JWT handling
│   ├── environments/            # Config (dev/prod)
│   └── styles/                  # Global SCSS
├── .eslintrc.cjs               # Code quality rules
├── .prettierrc                  # Formatting rules
├── package.json                # Scripts + dependencies
├── tsconfig.json               # TypeScript config
├── angular.json                # Angular config
└── README.md                   # Full documentation
```

## API Integration

Frontend connects to backend at configured `API_URL`:
- **Development**: `http://localhost:3000/api/v1`
- **Production**: Set via environment files

All API calls are fully typed through:
- `AuthService` - Login, 2FA, token refresh
- `UserService` - Profile, password, stats
- `AppointmentService` - CRUD operations

## Testing

- **Framework**: Vitest
- **DOM**: JSDOM
- **Location**: `*.spec.ts` alongside source
- **Coverage**: Aiming for 80%+

Run tests:
```bash
pnpm test              # All tests
pnpm test -- watch    # Watch mode
pnpm test -- coverage # Coverage report
```

## Security Features

- ✅ JWT auth with token refresh
- ✅ HttpOnly cookie storage (backend)
- ✅ Input validation on all forms
- ✅ XSS protection (Angular built-in)
- ✅ CORS configured server-side
- ✅ 2FA with TOTP support
- ✅ Protected routes with AuthGuard

## Deployment

### Build for Production
```bash
pnpm build
# Output: dist/frontend/
```

### Using Docker
```bash
# From root directory
docker-compose up frontend
```

### Manual Deployment
1. Build: `pnpm build`
2. Copy `dist/frontend/` to web server
3. Configure proxy/reverse proxy for `/api/*`

## Troubleshooting

**Port 4200 in use?**
```bash
ng serve --port 4300
```

**Module not found errors?**
```bash
pnpm install
rm -rf node_modules/.angular
pnpm install
```

**TypeScript/ESLint errors?**
```bash
pnpm run lint        # Auto-fix issues
pnpm run format      # Format code
```

## Related Documentation

- **[Backend API](../backend/README.md)** - Server endpoints & setup
- **[Project Overview](../guides/PROJECT_OVERVIEW.md)** - Full project status
- **[Quick Start](../guides/QUICK_START.md)** - Installation & first run
- **[Type Safety](./FRONTEND_TYPE_SAFETY.md)** - Complete type definitions

---

**Status**: ✅ Production Ready  
**Last Updated**: March 6, 2026  
**Version**: 1.0.0  
**Type Safety**: 100% (0 any types)
