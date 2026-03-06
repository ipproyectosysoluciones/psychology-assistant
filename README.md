# Psychology Assistant API

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Una API REST completa para la gestión de citas psicológicas, construida con Node.js, Express y MongoDB. Incluye autenticación JWT, 2FA, validación de datos, logging, testing y documentación automática.

---

## 📚 DOCUMENTACIÓN CENTRALIZADA

**La documentación completa del proyecto está en la carpeta [`docs/`](docs/)**

### Guías Rápidas

| Rol                       | Documentación                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------- |
| 👨‍💻 **Backend Developer**  | [Backend Guide](docs/backend/README.md) - API, setup, testing                               |
| 🎨 **Frontend Developer** | [Frontend Guide](frontend/README.md) & [Type Safety](docs/frontend/FRONTEND_TYPE_SAFETY.md) |
| 🏗️ **Architect**          | [Technical Audit](docs/audit/TECHNICAL_AUDIT.md) - Architecture & security                  |
| 🧪 **QA/Tester**          | [Testing Guide](docs/backend/features/TESTING.md) - Coverage & test info                    |
| 🚀 **DevOps**             | [Setup Guides](docs/guides/QUICK_START.md) - Installation & deployment                      |

**→ [Ver índice de documentación completo](docs/README.md)**

---

## 🚀 Características

- ✅ **Autenticación completa**: JWT + 2FA con TOTP
- ✅ **Validación robusta**: express-validator en todos los endpoints
- ✅ **Base de datos optimizada**: MongoDB con índices y validaciones
- ✅ **Testing completo**: Jest + Supertest con cobertura >70%
- ✅ **Logging avanzado**: Winston con múltiples transportes
- ✅ **Documentación automática**: Swagger/OpenAPI
- ✅ **Docker ready**: Contenedorizado para desarrollo y producción
- ✅ **CI/CD**: GitHub Actions con testing automático
- ✅ **Arquitectura limpia**: Separación clara de responsabilidades
- ✅ **Manejo de errores**: Respuestas estructuradas y logging

## 📁 Estructura del Proyecto

```tree
psychology-assistant/
│
├── src/
│   ├── config/
│   │   ├── database.js        # Conexión MongoDB
│   │   ├── environment.js     # Variables de entorno centralizadas
│   │   ├── logger.js          # Configuración Winston
│   │   └── swagger.js         # Documentación API
│   ├── controllers/
│   │   ├── authController.js   # Autenticación y 2FA
│   │   ├── userController.js   # Gestión de usuarios
│   │   └── appointmentController.js  # Citas médicas
│   ├── middlewares/
│   │   └── authMiddleware.js   # JWT + Autorización por roles
│   ├── models/
│   │   ├── user.js             # Modelo Usuario con validaciones
│   │   ├── appointment.js      # Modelo Citas con populate
│   │   └── session.js          # Modelo Sesiones
│   ├── routes/
│   │   ├── authRoutes.js       # Rutas autenticación
│   │   ├── userRoutes.js       # Rutas usuarios
│   │   └── appointmentRoutes.js # Rutas citas
│   ├── services/
│   │   ├── qrService.js        # Generación QR codes
│   │   └── twoFAService.js     # Servicio 2FA
│   ├── utils/
│   │   ├── validators.js       # Reglas de validación
│   │   ├── apiResponse.js      # Respuestas estandarizadas
│   │   ├── appError.js         # Manejo de errores
│   │   └── errorHandler.js     # Middleware errores
│   ├── __tests__/              # Tests unitarios
│   │   └── setup.js            # Configuración testing
│   ├── app.js                  # Configuración Express
│   └── server.js               # Punto de entrada
│
├── .github/workflows/          # CI/CD pipelines
├── docker-compose.yml          # Producción
├── docker-compose.dev.yml      # Desarrollo
├── Dockerfile                  # Imagen Docker
├── jest.config.js              # Configuración tests
├── .env.example                # Variables ejemplo
├── package.json
└── README.md
```

## 🛠️ Tecnologías

### Backend

- **Node.js** 18+ con ES Modules
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB

### Seguridad

- **JWT** - Autenticación stateless
- **bcryptjs** - Hashing de contraseñas
- **otplib** - 2FA con TOTP
- **express-validator** - Validación de inputs

### Testing & Quality

- **Jest** - Framework de testing
- **Supertest** - Testing HTTP
- **mongodb-memory-server** - DB en memoria para tests
- **ESLint** + **Prettier** - Code quality

### DevOps

- **Docker** + **Docker Compose**
- **Winston** - Logging estructurado
- **Swagger/OpenAPI** - Documentación API
- **GitHub Actions** - CI/CD

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- MongoDB (local o Atlas)
- pnpm (opcional, pero recomendado)

### Instalación

1. **Clonar repositorio**

   ```bash
   git clone https://github.com/ipproyectosysoluciones/psychology-assistant.git
   cd psychology-assistant
   ```

2. **Instalar dependencias**

   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env
   # Editar .env con tus valores
   ```

4. **Iniciar base de datos**

   ```bash
   # Con Docker
   docker-compose -f docker-compose.dev.yml up -d mongodb

   # O usar MongoDB local/Atlas
   ```

5. **Ejecutar aplicación**

   ```bash
   # Desarrollo
   pnpm run dev

   # Producción
   pnpm run build && pnpm start
   ```

## 🧪 Testing

```bash
# Ejecutar todos los tests
pnpm test

# Con cobertura
pnpm run test:coverage

# Tests en modo watch
pnpm run test:watch

# Tests de CI
pnpm run test:ci
```

## 📚 API Documentation

La documentación completa de la API está disponible en `/api-docs` cuando el servidor está ejecutándose.

### Endpoints Principales

#### Autenticación

- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login
- `POST /api/auth/enable-2fa` - Habilitar 2FA
- `POST /api/auth/verify-2fa` - Verificar código 2FA
- `POST /api/auth/logout` - Logout

#### Usuarios

- `GET /api/users/profile` - Obtener perfil
- `PUT /api/users/profile` - Actualizar perfil

#### Citas

- `POST /api/appointments/create` - Crear cita
- `GET /api/appointments/my-appointments` - Listar citas del usuario

## 🐳 Docker

### Desarrollo

```bash
docker-compose -f docker-compose.dev.yml up
```

### Producción

```bash
docker-compose up -d
```

## 🔧 Scripts Disponibles

```json
{
  "lint": "eslint . --fix",
  "format": "prettier --write \"**/*.{js,jsx,json,md}\"",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:ci": "jest --ci --coverage --watchAll=false",
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

## 🔒 Variables de Entorno

| Variable      | Descripción                | Default                 |
| ------------- | -------------------------- | ----------------------- |
| `NODE_ENV`    | Entorno de ejecución       | `development`           |
| `PORT`        | Puerto del servidor        | `5000`                  |
| `MONGO_URI`   | URI de conexión MongoDB    | _requerido_             |
| `JWT_SECRET`  | Clave secreta para JWT     | _requerido_             |
| `JWT_EXPIRE`  | Expiración del token JWT   | `7d`                    |
| `LOG_LEVEL`   | Nivel de logging           | `info`                  |
| `CORS_ORIGIN` | Origen permitido para CORS | `http://localhost:3000` |

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## � Estado del Proyecto / Project Status

### ✅ Completado / Completed

- [x] Task #1: MongoDB Real Database
- [x] Task #2: Authorization & RBAC
- [x] Task #3: Frontend Deactivate Endpoint
- [x] Task #4: Appointment Schema Alignment
- [x] Task #5: JWT Refresh Token System
- [x] Task #6: GDPR Data Deletion Endpoint (60% - 2/4 tests passing)

### 📈 Test Status

- **Total Tests**: 59
- **Passing**: 46 (78%)
- **Skipped**: 2 (GDPR debugging needed)
- **Failing**: 11 (non-critical edge cases)
- **Target**: 85%+ pass rate

### 🔄 Next Tasks (Próximas Tareas)

- [ ] Task #7: Frontend Type Safety (2-3 hours)
- [ ] Task #8: Environment Configuration (1 hour)
- [ ] Task #9: Final Test Coverage Push (2-3 hours)

## �📞 Contacto

**Psychology Assistant Team**

- Email: <support@psychology-assistant.com>
- GitHub: [@ipproyectosysoluciones](https://github.com/ipproyectosysoluciones)

---

⭐ Si este proyecto te resulta útil, ¡dale una estrella!

- Servicios: generación de códigos QR, autenticación 2FA

2. **Relaciones**
   - Usuarios ↔ Citas: Relación uno a muchos (un usuario puede tener múltiples citas).
   - Usuarios ↔ Sesiones: Relación uno a muchos (un usuario puede tener múltiples sesiones activas).
