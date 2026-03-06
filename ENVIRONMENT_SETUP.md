# 🛠️ ENVIRONMENT SETUP GUIDE / GUÍA DE CONFIGURACIÓN DEL ENTORNO

**Idiomas**: [English](#english) | [Español](#español)

---

## <a id="español"></a>📖 ESPAÑOL

### Visión General

Este documento proporciona instrucciones completas para configurar las variables de entorno necesarias para ejecutar Psychology Assistant en diferentes entornos (desarrollo, testing, producción).

### Archivo de Configuración Principal

El archivo `.env` en la raíz del proyecto contiene todas las variables de entorno necesarias. Hay un archivo de plantilla llamado `.env.example` que sirva como referencia.

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar con tu editor favorito
nano .env  # o vim, code, etc.
```

### Variables de Entorno Requeridas

#### 1. **Aplicación**

```env
# Entorno de ejecución
NODE_ENV=development  # development, test, production

# Puerto del servidor
PORT=5000
```

#### 2. **Base de Datos MongoDB**

Debes elegir UNA de las siguientes opciones:

**Opción A: MongoDB Local (para desarrollo)**

```env
DATABASE_URL=mongodb://localhost:27017/psychology-assistant
MONGO_URI=mongodb://localhost:27017/psychology-assistant
```

**Opción B: MongoDB Atlas (para producción)**

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/psychology-assistant
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/psychology-assistant
```

**Instalación de MongoDB Local**:

```bash
# macOS (con Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install -y mongodb-org
sudo systemctl start mongod

# Verificar que está corriendo
mongosh  # debería conectarse a localhost:27017
```

#### 3. **Autenticación y Seguridad**

```env
# Clave JWT para firmar tokens de acceso
# ⚠️ IMPORTANTE: Usar una cadena aleatoria segura en producción
# Generar: openssl rand -base64 32
JWT_SECRET=your_super_secure_secret_key_change_this_in_production

# Tiempo de expiración del token JWT
JWT_EXPIRE=7d  # 7 días

# Clave de sesión
# ⚠️ IMPORTANTE: Usar una cadena aleatoria segura en producción
SESSION_SECRET=your_session_secret_change_this_in_production

# Duración de sesión en milisegundos (3600000 = 1 hora)
SESSION_TIMEOUT=3600000
```

**Generar claves seguras**:

```bash
# Opción 1: OpenSSL
openssl rand -base64 32

# Opción 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Opción 3: En línea
# Ir a https://generate-random.org/

# Copiar la salida a JWT_SECRET y SESSION_SECRET
```

#### 4. **Autenticación de Dos Factores (2FA)**

```env
# Ventana de tolerancia para códigos TOTP
# 2 = permite códigos hasta 60 segundos atrás (recomendado)
TWO_FA_WINDOW=2
```

#### 5. **Logging**

```env
# Nivel de logging
# development: debug
# production: warn
# test: error
LOG_LEVEL=debug
```

#### 6. **CORS - Control de Origen**

```env
# Origen permitido para peticiones CORS
CORS_ORIGIN=http://localhost:3000
```

**Ejemplos por entorno**:

- Desarrollo: `http://localhost:3000` o `http://localhost:4200`
- Producción: `https://yourdomain.com`
- Múltiples orígenes: Requiere middleware personalizado

#### 7. **Frontend (Opcional)**

```env
# URLs del frontend
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000/api
```

### Configuración por Entorno

#### ✅ Desarrollo Local

```bash
# .env para desarrollo
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb://localhost:27017/psychology-assistant
MONGO_URI=mongodb://localhost:27017/psychology-assistant
JWT_SECRET=dev-secret-key-change-in-prod-must-be-32-chars
JWT_EXPIRE=7d
SESSION_SECRET=dev-session-secret-change-in-prod-32-chars
SESSION_TIMEOUT=3600000
TWO_FA_WINDOW=2
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000/api
```

#### 🧪 Testing

```bash
# .env.test (autodetectado por Jest)
NODE_ENV=test
JWT_SECRET=test-secret-key-must-be-32-characters-long
MONGO_URI=mongodb://localhost:27017/psychology-assistant-test
LOG_LEVEL=error
CORS_ORIGIN=http://localhost:3000
```

#### 🚀 Producción

```bash
# .env para producción
NODE_ENV=production
PORT=5000  # Puerto real en servidor (ej: 3000)
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/psychology-assistant
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/psychology-assistant
JWT_SECRET=very-long-random-secure-string-min-32-chars
JWT_EXPIRE=7d
SESSION_SECRET=very-long-random-secure-string-min-32-chars
SESSION_TIMEOUT=3600000
TWO_FA_WINDOW=2
LOG_LEVEL=warn
CORS_ORIGIN=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
API_URL=https://api.yourdomain.com/api
```

⚠️ **IMPORTANTE PARA PRODUCCIÓN**:

1. Cambiar todos los `JWT_SECRET` y `SESSION_SECRET` a cadenas seguras
2. Usar `mongodb+srv://` de MongoDB Atlas
3. Activar HTTPS en dominio
4. Cambiar `LOG_LEVEL` a `warn`
5. Verificar firewall y permisos de red

### Validación de Configuración

El sistema valida automáticamente las variables de entorno al iniciar:

```bash
# Iniciar tu servidor
npm run dev

# Debería ver: ✅ Environment variables validated successfully

# Si hay errores, verás:
# ❌ Environment Validation Errors:
#    • Missing required environment variable: JWT_SECRET
```

**Variables requeridas**:

- `JWT_SECRET` (mínimo 32 caracteres)
- `MONGO_URI` (URL válida de MongoDB)

### Configuración de MongoDB

#### Opción 1: MongoDB Localmente

```bash
# Instalar
# macOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb-org

# Iniciar servicio
mongod  # o con systemctl en Ubuntu

# Verificar conexión
mongosh
```

#### Opción 2: MongoDB Atlas (Cloud)

1. Ir a https://www.mongodb.com/cloud/atlas
2. Crear cuenta (gratis)
3. Crear cluster
4. Ir a "Connect"
5. Copiar connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/psychology-assistant
   ```
6. Reemplazar `<password>` con tu contraseña real
7. Pegar en `.env` como `MONGO_URI`

### Troubleshooting

| Problema                                | Solución                                                |
| --------------------------------------- | ------------------------------------------------------- |
| "MongoDB connection failed"             | Verificar que mongod está corriendo; revisar MONGO_URI  |
| " JWT_SECRET must be at least 32 chars" | Generar nueva clave con `openssl rand -base64 32`       |
| "Port 5000 is in use"                   | Cambiar PORT en .env; o matar proceso: `lsof -i :5000`  |
| "CORS error in browser"                 | Verificar CORS_ORIGIN coincide con URL de frontend      |
| "2FA code not working"                  | Revisar reloj del servidor vs teléfono; TWO_FA_WINDOW=2 |

### Checklist de Configuración

- [ ] Archivo `.env` existe en raíz del proyecto
- [ ] `JWT_SECRET` es cadena de 32+ caracteres
- [ ] `MONGO_URI` es URL válida
- [ ] MongoDB está corriendo (local o Atlas)
- [ ] `PORT` está disponible (no en uso)
- [ ] `NODE_ENV` es correcto para tu entorno
- [ ] `SESSION_SECRET` es cadena de 32+ caracteres

---

## <a id="english"></a>📖 ENGLISH

### Overview

This document provides complete instructions for setting up the environment variables needed to run Psychology Assistant in different environments (development, testing, production).

### Main Configuration File

The `.env` file in the project root contains all the necessary environment variables. There is a template file called `.env.example` that serves as reference.

```bash
# Copy example file
cp .env.example .env

# Edit with your favorite editor
nano .env  # or vim, code, etc.
```

### Required Environment Variables

#### 1. **Application**

```env
# Execution environment
NODE_ENV=development  # development, test, production

# Server port
PORT=5000
```

#### 2. **MongoDB Database**

Choose ONE of the following options:

**Option A: MongoDB Local (for development)**

```env
DATABASE_URL=mongodb://localhost:27017/psychology-assistant
MONGO_URI=mongodb://localhost:27017/psychology-assistant
```

**Option B: MongoDB Atlas (for production)**

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/psychology-assistant
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/psychology-assistant
```

**Installing MongoDB Locally**:

```bash
# macOS (with Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install -y mongodb-org
sudo systemctl start mongod

# Verify it's running
mongosh  # should connect to localhost:27017
```

#### 3. **Authentication & Security**

```env
# Secret key for signing JWT access tokens
# ⚠️ IMPORTANT: Use a secure random string in production
# Generate: openssl rand -base64 32
JWT_SECRET=your_super_secure_secret_key_change_this_in_production

# JWT token expiration time
JWT_EXPIRE=7d  # 7 days

# Session secret key
# ⚠️ IMPORTANT: Use a secure random string in production
SESSION_SECRET=your_session_secret_change_this_in_production

# Session timeout in milliseconds (3600000 = 1 hour)
SESSION_TIMEOUT=3600000
```

**Generating Secure Keys**:

```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 3: Online
# Visit https://generate-random.org/

# Copy output to JWT_SECRET and SESSION_SECRET
```

#### 4. **Two-Factor Authentication (2FA)**

```env
# Tolerance window for TOTP codes
# 2 = allows codes up to 60 seconds old (recommended)
TWO_FA_WINDOW=2
```

#### 5. **Logging**

```env
# Logging level
# development: debug
# production: warn
# test: error
LOG_LEVEL=debug
```

#### 6. **CORS - Cross-Origin Resource Sharing**

```env
# Allowed origin for CORS requests
CORS_ORIGIN=http://localhost:3000
```

**Examples by environment**:

- Development: `http://localhost:3000` or `http://localhost:4200`
- Production: `https://yourdomain.com`
- Multiple origins: Requires custom middleware

#### 7. **Frontend (Optional)**

```env
# Frontend URLs
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000/api
```

### Configuration by Environment

#### ✅ Local Development

```bash
# .env for development
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb://localhost:27017/psychology-assistant
MONGO_URI=mongodb://localhost:27017/psychology-assistant
JWT_SECRET=dev-secret-key-change-in-prod-must-be-32-chars
JWT_EXPIRE=7d
SESSION_SECRET=dev-session-secret-change-in-prod-32-chars
SESSION_TIMEOUT=3600000
TWO_FA_WINDOW=2
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000/api
```

#### 🧪 Testing

```bash
# .env.test (auto-detected by Jest)
NODE_ENV=test
JWT_SECRET=test-secret-key-must-be-32-characters-long
MONGO_URI=mongodb://localhost:27017/psychology-assistant-test
LOG_LEVEL=error
CORS_ORIGIN=http://localhost:3000
```

#### 🚀 Production

```bash
# .env for production
NODE_ENV=production
PORT=5000  # Actual port on server (e.g., 3000)
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/psychology-assistant
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/psychology-assistant
JWT_SECRET=very-long-random-secure-string-min-32-chars
JWT_EXPIRE=7d
SESSION_SECRET=very-long-random-secure-string-min-32-chars
SESSION_TIMEOUT=3600000
TWO_FA_WINDOW=2
LOG_LEVEL=warn
CORS_ORIGIN=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
API_URL=https://api.yourdomain.com/api
```

⚠️ **CRITICAL FOR PRODUCTION**:

1. Change all `JWT_SECRET` and `SESSION_SECRET` to secure random strings
2. Use `mongodb+srv://` from MongoDB Atlas
3. Enable HTTPS on domain
4. Change `LOG_LEVEL` to `warn`
5. Verify firewall and network permissions

### Configuration Validation

The system automatically validates environment variables on startup:

```bash
# Start your server
npm run dev

# Should see: ✅ Environment variables validated successfully

# If there are errors, you'll see:
# ❌ Environment Validation Errors:
#    • Missing required environment variable: JWT_SECRET
```

**Required variables**:

- `JWT_SECRET` (minimum 32 characters)
- `MONGO_URI` (valid MongoDB URL)

### MongoDB Setup

#### Option 1: MongoDB Locally

```bash
# Install
# macOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb-org

# Start service
mongod  # or with systemctl on Ubuntu

# Verify connection
mongosh
```

#### Option 2: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create account (free)
3. Create cluster
4. Go to "Connect"
5. Copy connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/psychology-assistant
   ```
6. Replace `<password>` with your actual password
7. Paste in `.env` as `MONGO_URI`

### Troubleshooting

| Problem                                | Solution                                              |
| -------------------------------------- | ----------------------------------------------------- |
| "MongoDB connection failed"            | Verify mongod is running; review MONGO_URI            |
| "JWT_SECRET must be at least 32 chars" | Generate new key with `openssl rand -base64 32`       |
| "Port 5000 is in use"                  | Change PORT in .env; or kill process: `lsof -i :5000` |
| "CORS error in browser"                | Verify CORS_ORIGIN matches frontend URL               |
| "2FA code not working"                 | Check server clock vs phone; TWO_FA_WINDOW=2          |

### Setup Checklist

- [ ] `.env` file exists in project root
- [ ] `JWT_SECRET` is a 32+ character string
- [ ] `MONGO_URI` is a valid URL
- [ ] MongoDB is running (local or Atlas)
- [ ] `PORT` is available (not in use)
- [ ] `NODE_ENV` is correct for your environment
- [ ] `SESSION_SECRET` is a 32+ character string

---

## 📞 Support

For issues or questions:

1. Check `.env.example` for variable documentation
2. Review validation errors in console output
3. Verify MongoDB is running and accessible
4. Ensure all required variables are set

---

**Last Updated**: March 6, 2026  
**Version**: 1.0  
**Bilingual**: Spanish & English
