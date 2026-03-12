# 📥 Installation & Setup Guide

Complete step-by-step installation guide for Psychology Assistant v0.4.0

---

## 🇬🇧 English

### Prerequisites

Ensure you have the following installed:

| Requirement | Minimum | Recommended | Check |
| --- | --- | --- | --- |
| Node.js | 18.0 | 20.x LTS | `node --version` |
| npm/pnpm | 9.0 | Latest | `npm --version` |
| MongoDB | 5.0 | 6.0+ | `mongod --version` |
| Git | 2.40 | Latest | `git --version` |

### Step 1: Clone the Repository

```bash
# Clone the project
git clone https://github.com/yourusername/psychology-assistant.git
cd psychology-assistant

# Expected output:
# Cloning into 'psychology-assistant'...
# remote: Enumerating objects: 1234, done.
```

**Verification**: Confirm you're in the `psychology-assistant` directory and can see `package.json`, `frontend/`, and `src/` folders.

### Step 2: Install Backend Dependencies

```bash
# Install backend dependencies
npm install
# or use pnpm for faster installation
pnpm install

# Expected output:
# added 512 packages, and audited 513 packages in 45s
```

**Verification**: Confirm `node_modules/` folder was created.

### Step 3: Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install frontend packages
npm install
# or use pnpm
pnpm install

# Return to root
cd ..

# Expected output:
# added 245 packages in 30s
```

**Verification**: Confirm `frontend/node_modules/` folder was created.

### Step 4: Configure Environment Variables

```bash
# Copy backend environment template
cp .env.example .env

# Copy frontend environment template
cp frontend/.env.example frontend/.env

# Expected output:
# Two .env files created in root and frontend/
```

**Edit `.env`** with your configuration:

```env
# Backend Configuration
PORT=3000
MONGODB_URI=mongodb://localhost:27017/psychology-assistant
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

**Edit `frontend/.env`**:

```env
# Frontend Configuration
APP_NAME=Psychology Assistant
API_BASE_URL=http://localhost:3000/api/v1
```

**Verification**: Both `.env` files exist with your configuration.

### Step 5: Start MongoDB

```bash
# On Linux/Mac (if MongoDB is installed locally)
mongod

# Using Docker (recommended)
docker run -d \
  -p 27017:27017 \
  --name psychology-mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:6.0

# Expected output:
# MongoDB instance is running on port 27017
```

**Verification**: Connect with MongoDB Compass or CLI:

```bash
mongosh "mongodb://localhost:27017"
```

### Step 6: Start the Backend Server

```bash
# From project root
npm run dev
# or
pnpm dev

# Expected output:
# ✓ Server running on http://localhost:3000
# ✓ Database connected to MongoDB
# ✓ Swagger docs available at http://localhost:3000/api-docs
```

**Verification**: Visit `http://localhost:3000/api-docs` in your browser.

### Step 7: Start the Frontend (New Terminal)

```bash
# Navigate to frontend directory
cd frontend

# Start development server
npm start
# or
pnpm start

# Expected output:
# ✔ Compiled successfully
# ✔ ng serve is running on http://localhost:4200
```

**Verification**: Visit `http://localhost:4200` in your browser.

### Step 8: Verify Full Installation

```bash
# Run all checks
npm run verify

# Expected output:
# ✓ Backend: ✓ Connectivity
# ✓ Frontend: ✓ Connectivity
# ✓ Database: ✓ Connected
# ✓ All checks passed!
```

---

## ✅ Post-Installation Setup

### Database Initialization

```bash
# Seed the database with initial data (if applicable)
npm run seed

# or
npm run db:migrate
```

### Run Tests

```bash
# Backend tests
npm test

# Frontend tests
cd frontend && npm test
```

### Run Linting

```bash
# Check code quality
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

---

## 🇪🇸 Español

### Prerrequisitos

Asegúrate de tener instalado:

| Requisito | Mínimo | Recomendado | Verificar |
| --- | --- | --- | --- |
| Node.js | 18.0 | 20.x LTS | `node --version` |
| npm/pnpm | 9.0 | Última | `npm --version` |
| MongoDB | 5.0 | 6.0+ | `mongod --version` |
| Git | 2.40 | Última | `git --version` |

### Paso 1: Clonar el Repositorio

```bash
# Clonar el proyecto
git clone https://github.com/tuusuario/psychology-assistant.git
cd psychology-assistant
```

### Paso 2: Instalar Dependencias Backend

```bash
# Instalar dependencias backend
npm install
# o usar pnpm para instalación más rápida
pnpm install
```

### Paso 3: Instalar Dependencias Frontend

```bash
# Navegar al directorio frontend
cd frontend

# Instalar paquetes frontend
npm install
# o usar pnpm
pnpm install

# Volver a raíz
cd ..
```

### Paso 4: Configurar Variables de Entorno

```bash
# Copiar plantilla backend
cp .env.example .env

# Copiar plantilla frontend
cp frontend/.env.example frontend/.env
```

**Editar `.env`**:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/psychology-assistant
JWT_SECRET=tu_clave_secreta_jwt_aqui
NODE_ENV=development
```

### Paso 5: Iniciar MongoDB

```bash
# Usando Docker (recomendado)
docker run -d \
  -p 27017:27017 \
  --name psychology-mongodb \
  mongo:6.0
```

### Paso 6: Iniciar Backend

```bash
# Desde raíz del proyecto
npm run dev
# o
pnpm dev
```

### Paso 7: Iniciar Frontend (Nueva Terminal)

```bash
# Navegar a frontend
cd frontend

# Iniciar servidor de desarrollo
npm start
# o
pnpm start
```

**Accede**: `http://localhost:4200`

### Paso 8: Verificar Instalación

```bash
# Ejecutar todas las verificaciones
npm run verify
```

---

## ⚠️ Troubleshooting

### Error: "Port 3000 already in use"

```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or change PORT in .env to 3001
PORT=3001
```

### Error: "Cannot connect to MongoDB"

```bash
# Verify MongoDB is running
mongosh

# If using Docker, check container status
docker ps | grep psychology-mongodb
```

### Error: "npm ERR! ERESOLVE"

```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Error: "Angular compilation failed"

```bash
# Clear Angular cache
cd frontend
rm -rf .angular
npm install
npm start
```

---

## 📚 Next Steps

After successful installation:

1. **Read [QUICK_START.md](./QUICK_START.md)** - First steps guide
2. **Review [DEVELOPMENT_GUIDE.md](../../DEVELOPMENT_GUIDE.md)** - Development workflow
3. **Check [PROJECT_OVERVIEW.md](../../docs/guides/PROJECT_OVERVIEW.md)** - Architecture overview
4. **Run tests**: `npm test` to ensure everything works

---

## 🔗 Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [MongoDB Setup Guide](https://docs.mongodb.com/manual/installation/)
- [Angular Getting Started](https://angular.dev/getting-started)
- [Express.js Guide](https://expressjs.com/)

---

**Last Updated**: March 12, 2026  
**Version**: v0.4.0

