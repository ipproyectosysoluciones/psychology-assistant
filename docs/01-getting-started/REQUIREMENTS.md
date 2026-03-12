# 🖥️ System Requirements

**Psychology Assistant** | v0.4.0 | System Requirements

---

## 🇬🇧 English

### Minimum Requirements

| Component | Minimum | Recommended | Reason |
|-----------|---------|-------------|--------|
| Node.js | 18.0.0 | 20.x LTS | ES2022 features, security patches, better performance |
| npm/pnpm | 9.0.0+ | Latest | Dependency management, faster installs |
| MongoDB | 5.0.0 | 6.0+ | Flexible schema, better transactions, backup tools |
| Angular | 18.0+ | 21+ | Latest components, better performance, security |
| RAM | 4GB | 8GB+ | Development & testing comfort |
| Disk Space | 2GB | 10GB+ | node_modules + database |
| OS | Linux/Mac/Win | Linux/Mac | Production deployment |

### Backend Requirements

```
Backend Stack:
├─ Node.js 20.x         (JavaScript runtime)
├─ Express.js 4.x       (Web framework)
├─ TypeScript 5.x       (Language)
├─ MongoDB 6.0+         (Database)
├─ Jest 29.x            (Testing)
└─ ESLint + Prettier    (Code quality)
```

**Environment**: Node.js `18.0.0+` (v20.x recommended)

### Frontend Requirements

```
Frontend Stack:
├─ Angular 21.x         (Framework)
├─ TypeScript 5.x       (Language)
├─ Material Design 16.x  (UI Library)
├─ Cypress 13.x         (E2E Testing)
└─ ESLint + Prettier    (Code quality)
```

**Browser Support**: 
- Chrome 120+
- Firefox 121+
- Safari 17+
- Edge 120+

### Development Tools

| Tool | Purpose | Version |
|------|---------|---------|
| Git | Version control | 2.40+ |
| Docker | Containerization | 24.0+ |
| Docker Compose | Multi-container | 2.20+ |
| VS Code | IDE (recommended) | Latest |
| GitHub | Repository | - |

### Optional but Recommended

- **Postman**: API testing (latest)
- **MongoDB Compass**: Database GUI
- **Redis**: Caching (production only)
- **nginx**: Reverse proxy (production only)

---

## 🇪🇸 Español

### Requisitos Mínimos

| Componente | Mínimo | Recomendado | Razón |
|-----------|--------|------------|-------|
| Node.js | 18.0.0 | 20.x LTS | Características ES2022, parches de seguridad |
| npm/pnpm | 9.0.0+ | Última | Gestión de dependencias, instalaciones rápidas |
| MongoDB | 5.0.0 | 6.0+ | Esquema flexible, mejores transacciones |
| Angular | 18.0+ | 21+ | Componentes modernos, mejor rendimiento |
| RAM | 4GB | 8GB+ | Comodidad en desarrollo |
| Espacio Disco | 2GB | 10GB+ | node_modules + base de datos |
| SO | Linux/Mac/Win | Linux/Mac | Despliegue en producción |

### Requisitos Backend

```
Stack Backend:
├─ Node.js 20.x         (Runtime JavaScript)
├─ Express.js 4.x       (Framework web)
├─ TypeScript 5.x       (Lenguaje)
├─ MongoDB 6.0+         (Base de datos)
├─ Jest 29.x            (Testing)
└─ ESLint + Prettier    (Calidad código)
```

**Entorno**: Node.js `18.0.0+` (v20.x recomendado)

### Requisitos Frontend

```
Stack Frontend:
├─ Angular 21.x         (Framework)
├─ TypeScript 5.x       (Lenguaje)
├─ Material Design 16.x  (Librería UI)
├─ Cypress 13.x         (Testing E2E)
└─ ESLint + Prettier    (Calidad código)
```

**Navegadores Soportados**:
- Chrome 120+
- Firefox 121+
- Safari 17+
- Edge 120+

### Herramientas de Desarrollo

| Herramienta | Propósito | Versión |
|------------|-----------|---------|
| Git | Control de versiones | 2.40+ |
| Docker | Containerización | 24.0+ |
| Docker Compose | Multi-contenedor | 2.20+ |
| VS Code | IDE (recomendado) | Última |
| GitHub | Repositorio | - |

### Opcionales pero Recomendados

- **Postman**: Testing de API (última)
- **MongoDB Compass**: GUI Base de datos
- **Redis**: Caché (solo producción)
- **nginx**: Reverse proxy (solo producción)

---

## ✅ Checklist de Instalación

- [ ] Node.js 20.x instalado (`node --version`)
- [ ] npm o pnpm (`npm --version`)
- [ ] MongoDB 6.0+ corriendo
- [ ] Git configurado
- [ ] Docker instalado (opcional pero recomendado)
- [ ] VS Code con extensiones (opcional)

---

## 🚀 Verificar Instalación

```bash
# Verificar Node.js
node --version    # Debería ser v20.x o superior

# Verificar npm
npm --version     # Debería ser 9.x o superior

# Verificar Git
git --version     # Debería ser 2.40 o superior

# Verificar Docker (opcional)
docker --version  # Si está instalado
```

---

## ⚠️ Problemas Comunes

**P**: Node.js no se instala en mi sistema  
**R**: Usa [nvm](https://github.com/nvm-sh/nvm) (Linux/Mac) o [nvm-windows](https://github.com/coreybutler/nvm-windows)

**P**: MongoDB no se conecta  
**R**: Verifica que MongoDB esté ejecutándose (`mongod` en terminal)

**P**: Permisos denegados en Linux/Mac  
**R**: Usa `sudo chown -R $USER ~/.npm` para reparar npm

---

**Última actualización**: 12 de Marzo, 2026  
**Versión**: v0.4.0
