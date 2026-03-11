# Docker Setup Guide - Guía de Docker

**English / Español:**
- [🇬🇧 English Version](#english-docker-setup)
- [🇪🇸 Versión en Español](#guía-de-configuración-docker)

---

## Guía de Configuración Docker

Este proyecto incluye configuración completa de Docker para desarrollo y producción.

### Archivos Docker

- `Dockerfile` - Imagen de producción para backend Node.js
- `docker-compose.yml` - Stack de producción con MongoDB
- `docker-compose.dev.yml` - Stack de desarrollo (frontend + backend + MongoDB)
- `frontend/Dockerfile.dev` - Imagen de desarrollo para Angular

### Inicio Rápido - Desarrollo

Inicia todo el stack (backend + frontend + MongoDB):

```bash
# Construir e iniciar servicios
docker-compose -f docker-compose.dev.yml up -d

# Ver logs en tiempo real
docker-compose -f docker-compose.dev.yml logs -f

# Detener servicios
docker-compose -f docker-compose.dev.yml down
```

**Acceso:**

- Frontend: http://localhost:4200
- Backend: http://localhost:5000
- MongoDB: mongodb://localhost:27017

### Producción

```bash
# Copiar archivo de configuración
cp .env.example .env

# Configurar .env con valores de producción
nano .env

# Construir e iniciar
docker-compose up -d

# Verificar estado
docker-compose ps

# Ver logs
docker-compose logs -f app
```

### Variables de Entorno

**Desarrollo:**

```bash
NODE_ENV=development
JWT_SECRET=dev_secret_key
MONGO_ROOT_PASSWORD=dev_password
CORS_ORIGIN=http://localhost:4200
API_URL=http://localhost:5000
```

**Producción:**

```bash
NODE_ENV=production
JWT_SECRET=$(openssl rand -base64 32)
MONGO_ROOT_PASSWORD=<strong-password>
CORS_ORIGIN=https://yourdomain.com
API_URL=https://api.yourdomain.com
```

### Comandos Frecuentes

```bash
# Iniciar todos los servicios
docker-compose -f docker-compose.dev.yml up -d

# Construir imágenes
docker-compose -f docker-compose.dev.yml build

# Reiniciar un servicio
docker-compose -f docker-compose.dev.yml restart app

# Ejecutar comandos en contenedor
docker-compose -f docker-compose.dev.yml exec app pnpm test

# Ver logs en tiempo real
docker-compose -f docker-compose.dev.yml logs -f

# Ver logs de un servicio específico
docker-compose -f docker-compose.dev.yml logs -f app
docker-compose -f docker-compose.dev.yml logs -f frontend
docker-compose -f docker-compose.dev.yml logs -f mongodb

# Detener un servicio
docker-compose -f docker-compose.dev.yml stop app

# Eliminar todo (datos incluidos)
docker-compose -f docker-compose.dev.yml down -v

# Reconstruir y reiniciar
docker-compose -f docker-compose.dev.yml down && docker-compose -f docker-compose.dev.yml up -d --build
```

---

## English Docker Setup

This project includes complete Docker configuration for development and production.

### Docker Files

- `Dockerfile` - Production image for Node.js backend
- `docker-compose.yml` - Production stack with MongoDB
- `docker-compose.dev.yml` - Development stack (frontend + backend + MongoDB)
- `frontend/Dockerfile.dev` - Development image for Angular

### Quick Start - Development

Start the entire stack (backend + frontend + MongoDB):

```bash
# Build and start services
docker-compose -f docker-compose.dev.yml up -d

# View logs in real-time
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
```

**Access Points:**

- Frontend: http://localhost:4200
- Backend: http://localhost:5000
- MongoDB: mongodb://localhost:27017

### Production

```bash
# Copy configuration file
cp .env.example .env

# Configure .env with production values
nano .env

# Build and start
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app
```

### Environment Variables

**Development:**

```bash
NODE_ENV=development
JWT_SECRET=dev_secret_key
MONGO_ROOT_PASSWORD=dev_password
CORS_ORIGIN=http://localhost:4200
API_URL=http://localhost:5000
```

**Production:**

```bash
NODE_ENV=production
JWT_SECRET=$(openssl rand -base64 32)
MONGO_ROOT_PASSWORD=<strong-password>
CORS_ORIGIN=https://yourdomain.com
API_URL=https://api.yourdomain.com
```

### Common Commands

```bash
# Start all services
docker-compose -f docker-compose.dev.yml up -d

# Build images
docker-compose -f docker-compose.dev.yml build

# Restart a service
docker-compose -f docker-compose.dev.yml restart app

# Run commands in container
docker-compose -f docker-compose.dev.yml exec app pnpm test

# View logs in real-time
docker-compose -f docker-compose.dev.yml logs -f

# View logs from specific service
docker-compose -f docker-compose.dev.yml logs -f app
docker-compose -f docker-compose.dev.yml logs -f frontend
docker-compose -f docker-compose.dev.yml logs -f mongodb

# Stop a service
docker-compose -f docker-compose.dev.yml stop app

# Remove everything (including data)
docker-compose -f docker-compose.dev.yml down -v

# Rebuild and restart
docker-compose -f docker-compose.dev.yml down && docker-compose -f docker-compose.dev.yml up -d --build
```

# Execute commands in container
docker-compose -f docker-compose.dev.yml exec app npm test

# View logs in real-time
docker-compose -f docker-compose.dev.yml logs -f

# Remove everything (including data)
docker-compose -f docker-compose.dev.yml down -v
```
