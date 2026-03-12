# Contributing to Psychology Assistant / Contribuir a Psychology Assistant

**English / Español:**

- [🇬🇧 English Version](#-english-contribution-guidelines)
- [🇪🇸 Guía de Contribución en Español](#-guía-de-contribución)

---

## Guía de Contribución

¡Agradecemos tu interés en contribuir a Psychology Assistant! Este documento proporciona directrices para ayudarte a contribuir de manera efectiva.

### Antes de Comenzar

1. Fork el repositorio
2. Clona tu fork: `git clone https://github.com/tu-usuario/psychology-assistant.git`
3. Añade el upstream: `git remote add upstream https://github.com/ipproyectosysoluciones/psychology-assistant.git`
4. Crea una rama feature: `git checkout -b feature/mi-feature`

### Estándares de Código

#### JavaScript/Node.js (Backend)

```javascript
// ✅ BIEN: Comentarios bilingües
/**
 * Get user appointments
 * Obtener citas del usuario
 * @param {string} userId - User ID / ID del usuario
 * @returns {Promise<Appointment[]>} Appointments / Citas
 */
const getAppointments = async (userId) => {
  // Implementation
};

// ✅ BIEN: Nombres en inglés
const userEmail = 'user@example.com';

// ❌ MAL: Comentarios solo en español
// Obtiene las citas del usuario (sin comentario en inglés)

// ❌ MAL: Variables en español
const emailUsuario = 'user@example.com';
```

**ESLint Rules:**

```bash
npm run lint          # Verificar errores
npm run lint -- --fix # Auto-corregir
```

#### TypeScript/Angular (Frontend)

```typescript
// ✅ BIEN: Tipos completos
interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

// ✅ BIEN: Métodos tipados
getUserProfile(id: string): Observable<ApiResponse<UserProfile>> {
  return this.http.get(`/api/users/${id}`);
}

// ❌ MAL: any types
const user: any = { name: 'John' };

// ❌ MAL: Sin tipos
getUserProfile(id) {
  return this.http.get(`/api/users/${id}`);
}
```

**TypeScript Config:**

- Strict mode: ✅ Habilitado
- No implicit any: ✅ Requerido
- Target: ES2023

### Commits y Mensajes

Sigue **Conventional Commits**:

```bash
# BIEN:
git commit -m "feat: add 2FA email verification"
git commit -m "fix: resolve appointment date validation error"
git commit -m "docs: update backend setup guide (ES/EN)"
git commit -m "test: add tests for GDPR data deletion"
git commit -m "refactor: simplify auth middleware logic"

# MAL:
git commit -m "fixed stuff"
git commit -m "updated code"
git commit -m "WIP"
```

**Tipos válidos:**

- `feat:` - Nueva característica
- `fix:` - Corrección de bug
- `docs:` - Cambios en documentación
- `test:` - Agregar o actualizar tests
- `refactor:` - Refactorización sin cambios funcionales
- `perf:` - Mejora de rendimiento
- `chore:` - Cambios en build/config

### Pull Request

#### Proceso

1. **Asegúrate que tu rama esté actualizada:**

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Ejecuta tests y linting:**

   ```bash
   npm test
   npm run lint
   npm run format
   ```

3. **Crea el PR con descripción clara:**

   ```
   # Título
   feat: Add email verification for 2FA
   
   ## Descripción / Description
   - Sends verification email after 2FA setup
   - Envía email de verificación después de setup 2FA
   
   ## Tipo / Type
   - [x] Feature
   - [ ] Bug Fix
   - [ ] Breaking Change
   
   ## Testing / Testing
   - [x] Unit tests added
   - [x] Integration tests passed
   - [ ] Manual testing required
   
   ## Checklist / Checklist
   - [x] Code follows project guidelines
   - [x] Documentation updated
   - [x] Tests added/updated
   - [ ] Breaking changes documented
   ```

#### Requisitos para Merge

- ✅ Todos los tests pasando
- ✅ Código sigue ESLint + Prettier
- ✅ Code review aprobado
- ✅ Documentación actualizada (si aplica)
- ✅ Commits bien formateados

### Documentación

#### Directrices

- **Bilingüe:** Español e Inglés
- **Ubicación:** Archivos en `docs/`
- **Comentarios:** En código también bilingüe
- **README:** Principal en raíz, detallado en `docs/`

#### Formato de Documentación

```markdown
# Título / Title

**Español / English:**
- [🇪🇸 Versión Español](#version-español)
- [🇬🇧 English Version](#english-version)

---

## Version Español

Contenido...

---

## English Version

Content...
```

### Testing

#### Backend (Jest)

```bash
# Ejecutar todos los tests
npm test

# Watch mode
npm test -- --watch

# Con cobertura
npm test -- --coverage

# Test específico
npm test authController.test.js
```

**Requisitos:**

- Mínimo 80% cobertura
- Tests para nuevas características
- Tests para bugs corregidos

#### Frontend (Vitest)

```bash
cd frontend

# Ejecutar tests
pnpm test

# Watch mode
pnpm test -- --watch

# Cobertura
pnpm test -- --coverage
```

### Configuración Local

```bash
# 1. Clone and setup
git clone https://github.com/tu-usuario/psychology-assistant.git
cd psychology-assistant

# 2. Install dependencies
pnpm install

# 3. Configure environment
cp .env.example .env

# 4. Start development (from root)
docker-compose -f docker-compose.dev.yml up -d

# 5. Backend development
npm run dev

# 6. Frontend development (new terminal)
cd frontend
pnpm start
```

### Reportar Issues

Cuando reportes un issue, incluye:

- **Descripción clara** - Qué está broken / Qué funciona mal
- **Pasos para reproducir** - Cómo replicar el problema
- **Comportamiento esperado** - Qué debería pasar
- **Comportamiento actual** - Qué está pasando
- **Ambiente** - Node version, OS, etc.

**Ejemplo:**

```markdown
## Description
Login button doesn't respond on mobile devices

## Steps to Reproduce
1. Go to login page on mobile browser
2. Click "Login" button
3. No response

## Expected Behavior
Form should submit

## Actual Behavior
Button click does nothing
```

---

## English Contribution Guidelines

We appreciate your interest in contributing to Psychology Assistant! This document provides guidelines to help you contribute effectively.

### Before You Start

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/psychology-assistant.git`
3. Add upstream: `git remote add upstream https://github.com/ipproyectosysoluciones/psychology-assistant.git`
4. Create a feature branch: `git checkout -b feature/my-feature`

### Code Standards

#### JavaScript/Node.js (Backend)

```javascript
// ✅ GOOD: Bilingual comments
/**
 * Get user appointments
 * Obtener citas del usuario
 * @param {string} userId - User ID / ID del usuario
 * @returns {Promise<Appointment[]>} Appointments / Citas
 */
const getAppointments = async (userId) => {
  // Implementation
};

// ✅ GOOD: English identifiers
const userEmail = 'user@example.com';

// ❌ WRONG: Spanish-only comments
// Obtiene las citas del usuario (no English comment)

// ❌ WRONG: Spanish variables
const emailUsuario = 'user@example.com';
```

**ESLint Rules:**

```bash
npm run lint          # Check for errors
npm run lint -- --fix # Auto-fix issues
```

#### TypeScript/Angular (Frontend)

```typescript
// ✅ GOOD: Full types
interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

// ✅ GOOD: Typed methods
getUserProfile(id: string): Observable<ApiResponse<UserProfile>> {
  return this.http.get(`/api/users/${id}`);
}

// ❌ WRONG: any types
const user: any = { name: 'John' };

// ❌ WRONG: No types
getUserProfile(id) {
  return this.http.get(`/api/users/${id}`);
}
```

**TypeScript Config:**

- Strict mode: ✅ Enabled
- No implicit any: ✅ Required
- Target: ES2023

### Commits and Messages

Follow **Conventional Commits**:

```bash
# GOOD:
git commit -m "feat: add 2FA email verification"
git commit -m "fix: resolve appointment date validation error"
git commit -m "docs: update backend setup guide (ES/EN)"
git commit -m "test: add tests for GDPR data deletion"
git commit -m "refactor: simplify auth middleware logic"

# WRONG:
git commit -m "fixed stuff"
git commit -m "updated code"
git commit -m "WIP"
```

**Valid types:**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Add or update tests
- `refactor:` - Refactoring without functional changes
- `perf:` - Performance improvement
- `chore:` - Build/config changes

### Pull Request

#### Process

1. **Ensure your branch is updated:**

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests and linting:**

   ```bash
   npm test
   npm run lint
   npm run format
   ```

3. **Create PR with clear description:**

   ```
   # Title
   feat: Add email verification for 2FA
   
   ## Description
   - Sends verification email after 2FA setup
   - Envía email de verificación después de setup 2FA
   
   ## Type
   - [x] Feature
   - [ ] Bug Fix
   - [ ] Breaking Change
   
   ## Testing
   - [x] Unit tests added
   - [x] Integration tests passed
   - [ ] Manual testing required
   
   ## Checklist
   - [x] Code follows project guidelines
   - [x] Documentation updated
   - [x] Tests added/updated
   - [ ] Breaking changes documented
   ```

#### Merge Requirements

- ✅ All tests passing
- ✅ Code follows ESLint + Prettier
- ✅ Code review approved
- ✅ Documentation updated (if applicable)
- ✅ Commits well formatted

### Documentation

#### Guidelines

- **Bilingual:** Spanish and English
- **Location:** Files in `docs/`
- **Comments:** In code also bilingual
- **README:** Main in root, detailed in `docs/`

#### Documentation Format

```markdown
# Title / Título

**English / Español:**
- [🇬🇧 English Version](#english-version)
- [🇪🇸 Versión Español](#version-español)

---

## English Version

Content...

---

## Version Español

Contenido...
```

### Testing

#### Backend (Jest)

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# With coverage
npm test -- --coverage

# Specific test
npm test authController.test.js
```

**Requirements:**

- Minimum 80% coverage
- Tests for new features
- Tests for fixed bugs

#### Frontend (Vitest)

```bash
cd frontend

# Run tests
pnpm test

# Watch mode
pnpm test -- --watch

# Coverage
pnpm test -- --coverage
```

### Local Setup

```bash
# 1. Clone and setup
git clone https://github.com/your-username/psychology-assistant.git
cd psychology-assistant

# 2. Install dependencies
pnpm install

# 3. Configure environment
cp .env.example .env

# 4. Start development (from root)
docker-compose -f docker-compose.dev.yml up -d

# 5. Backend development
npm run dev

# 6. Frontend development (new terminal)
cd frontend
pnpm start
```

### Reporting Issues

When reporting an issue, include:

- **Clear description** - What's broken?
- **Steps to reproduce** - How to replicate the issue
- **Expected behavior** - What should happen?
- **Actual behavior** - What's happening?
- **Environment** - Node version, OS, etc.

**Example:**

```markdown
## Description
Login button doesn't respond on mobile devices

## Steps to Reproduce
1. Go to login page on mobile browser
2. Click "Login" button
3. No response

## Expected Behavior
Form should submit

## Actual Behavior
Button click does nothing
```

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**¡Gracias por contribuir! / Thank you for contributing!** 🚀
