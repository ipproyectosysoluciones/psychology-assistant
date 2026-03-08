# Psychology Assistant API Endpoints

> **English** | [📖 Español](#spanish-section)

## English Section

### Overview
Complete REST API documentation for the Psychology Assistant platform - a comprehensive solution for psychological practice management.

**Base URL:** `http://localhost:3000`  
**API Version:** `v1`  
**Default Port:** `3000`

---

## Table of Contents
1. [Authentication Endpoints](#authentication)
2. [Appointments Endpoints](#appointments)
3. [Users Endpoints](#users)
4. [Clinic Management](#clinic-management)
5. [Medical Records](#medical-records)
6. [Billing](#billing)

---

## Authentication

### Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "Dr. Juan Pérez",
    "email": "juan@example.com",
    "password": "SecurePassword@2024",
    "role": "psychologist"
  }
  ```
- **Response:** `201 Created`

### Login
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "juan@example.com",
    "password": "SecurePassword@2024"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "statusCode": 200,
    "success": true,
    "data": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "user": { "id": "user_123", "email": "juan@example.com", "role": "psychologist" }
    },
    "message": "Logged in successfully"
  }
  ```

### Logout
- **POST** `/api/auth/logout`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Response:** `200 OK`

### Enable 2FA
- **POST** `/api/auth/enable-2fa`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Response:** `200 OK`
  ```json
  {
    "statusCode": 200,
    "success": true,
    "data": {
      "qrCode": "data:image/png;base64,...",
      "secret": "JBSWY3DPEBLW65TMMQ======"
    },
    "message": "Scan the QR code with your authenticator app"
  }
  ```

### Verify 2FA Token
- **POST** `/api/auth/verify-2fa`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Body:**
  ```json
  {
    "token": "123456"
  }
  ```
- **Response:** `200 OK`

### Refresh Token
- **POST** `/api/auth/refresh-token`
- **Body:**
  ```json
  {
    "refreshToken": "eyJhbGc..."
  }
  ```
- **Response:** `200 OK`

---

## Appointments

### Create Appointment
- **POST** `/api/appointments`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Body:**
  ```json
  {
    "date": "2024-12-25T10:00:00Z",
    "description": "Initial consultation",
    "type": "consultation"
  }
  ```
- **Response:** `201 Created`

### List Appointments
- **GET** `/api/appointments`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Query Parameters:**
  - `status`: pending, confirmed, completed, cancelled
  - `page`: pagination (default: 1)
  - `limit`: items per page (default: 10)
- **Response:** `200 OK`

### Get Appointment Details
- **GET** `/api/appointments/:id`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Response:** `200 OK`

### Update Appointment
- **PUT** `/api/appointments/:id`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Body:** Same as create
- **Response:** `200 OK`

### Cancel Appointment
- **DELETE** `/api/appointments/:id`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Response:** `200 OK`

---

## Users

### Get User Profile
- **GET** `/api/users/profile`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Response:** `200 OK`

### Update User Profile
- **PUT** `/api/users/profile`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Body:**
  ```json
  {
    "name": "New Name",
    "email": "newemail@example.com",
    "bio": "Professional bio"
  }
  ```
- **Response:** `200 OK`

### Change Password
- **PUT** `/api/users/change-password`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Body:**
  ```json
  {
    "currentPassword": "OldPassword@2024",
    "newPassword": "NewPassword@2024",
    "confirmPassword": "NewPassword@2024"
  }
  ```
- **Response:** `200 OK`

### Get User Statistics
- **GET** `/api/users/stats`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Response:** `200 OK`
  ```json
  {
    "statusCode": 200,
    "success": true,
    "data": {
      "totalAppointments": 15,
      "completedAppointments": 12,
      "cancelledAppointments": 2,
      "upcomingAppointments": 1,
      "memberSince": "2024-01-01"
    },
    "message": "User statistics retrieved"
  }
  ```

### Deactivate Account
- **DELETE** `/api/users/delete-data`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Body:**
  ```json
  {
    "password": "CurrentPassword@2024"
  }
  ```
- **Response:** `200 OK`

---

## Clinic Management

### Create Clinic
- **POST** `/api/clinics`
- **Headers:** `Authorization: Bearer {accessToken}` (Admin/Owner)
- **Body:**
  ```json
  {
    "name": "Clinic Name",
    "address": "Street Address",
    "phone": "+1234567890",
    "website": "https://clinic.com"
  }
  ```
- **Response:** `201 Created`

### List Clinics
- **GET** `/api/clinics`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Query Parameters:**
  - `page`: pagination
  - `limit`: items per page
- **Response:** `200 OK`

### Get Clinic Details
- **GET** `/api/clinics/:id`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Response:** `200 OK`

### Update Clinic
- **PUT** `/api/clinics/:id`
- **Headers:** `Authorization: Bearer {accessToken}` (Clinic Owner)
- **Body:** Same as create
- **Response:** `200 OK`

### Delete Clinic
- **DELETE** `/api/clinics/:id`
- **Headers:** `Authorization: Bearer {accessToken}` (Admin)
- **Response:** `200 OK`

---

## Medical Records

### Create Medical Record
- **POST** `/api/medical-records`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Body:**
  ```json
  {
    "patientId": "patient_123",
    "diagnosis": "Anxiety Disorder",
    "treatment": "CBT",
    "notes": "Treatment notes..."
  }
  ```
- **Response:** `201 Created`

### Get Medical Record
- **GET** `/api/medical-records/:id`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Response:** `200 OK`

### List Records by Patient
- **GET** `/api/patients/:patientId/medical-records`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Response:** `200 OK`

### Update Medical Record
- **PUT** `/api/medical-records/:id`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Body:** Same as create
- **Response:** `200 OK`

### Delete Medical Record
- **DELETE** `/api/medical-records/:id`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Response:** `200 OK`

---

## Billing

### Create Billing Record
- **POST** `/api/billings`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Body:**
  ```json
  {
    "appointmentId": "appointment_123",
    "amount": 100.00,
    "currency": "USD",
    "description": "Session fee"
  }
  ```
- **Response:** `201 Created`

### List Billing Records
- **GET** `/api/billings`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Query Parameters:**
  - `status`: pending, paid, cancelled
  - `page`: pagination
  - `limit`: items per page
- **Response:** `200 OK`

### Mark as Paid
- **PUT** `/api/billings/:id/pay`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Response:** `200 OK`

### Delete Billing Record
- **DELETE** `/api/billings/:id`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Response:** `200 OK`

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "statusCode": 400,
  "success": false,
  "message": "Validation failed",
  "errors": ["field1 is required"]
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "success": false,
  "message": "No token provided"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "success": false,
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "success": false,
  "message": "Internal server error",
  "error": "Error details..."
}
```

---

<a id="spanish-section"></a>

# Endpoints de la API de Psychology Assistant

> [📖 English](#overview) | **Español**

## Descripción General
Documentación completa de la API REST de la plataforma Psychology Assistant - una solución integral para la gestión de consultorios psicológicos.

**URL Base:** `http://localhost:3000`  
**Versión de API:** `v1`  
**Puerto por Defecto:** `3000`

---

## Tabla de Contenidos
1. [Endpoints de Autenticación](#autenticación)
2. [Endpoints de Citas](#citas)
3. [Endpoints de Usuarios](#usuarios)
4. [Gestión de Clínicas](#gestión-de-clínicas)
5. [Historiales Médicos](#historiales-médicos)
6. [Facturación](#facturación)

---

## Autenticación

### Registrar Usuario
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "Dra. María López",
    "email": "maria@example.com",
    "password": "ContraseñaSegura@2024",
    "role": "psicólogo"
  }
  ```
- **Respuesta:** `201 Created`

### Iniciar Sesión
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "maria@example.com",
    "password": "ContraseñaSegura@2024"
  }
  ```
- **Respuesta:** `200 OK`
  ```json
  {
    "statusCode": 200,
    "success": true,
    "data": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "user": { "id": "user_123", "email": "maria@example.com", "role": "psicólogo" }
    },
    "message": "Sesión iniciada correctamente"
  }
  ```

### Cerrar Sesión
- **POST** `/api/auth/logout`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Respuesta:** `200 OK`

### Habilitar 2FA
- **POST** `/api/auth/enable-2fa`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Respuesta:** `200 OK`
  ```json
  {
    "statusCode": 200,
    "success": true,
    "data": {
      "qrCode": "data:image/png;base64,...",
      "secret": "JBSWY3DPEBLW65TMMQ======"
    },
    "message": "Escanee el código QR con su aplicación de autenticación"
  }
  ```

### Verificar Token 2FA
- **POST** `/api/auth/verify-2fa`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Body:**
  ```json
  {
    "token": "123456"
  }
  ```
- **Respuesta:** `200 OK`

### Refrescar Token
- **POST** `/api/auth/refresh-token`
- **Body:**
  ```json
  {
    "refreshToken": "eyJhbGc..."
  }
  ```
- **Respuesta:** `200 OK`

---

## Citas

### Crear Cita
- **POST** `/api/appointments`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Body:**
  ```json
  {
    "date": "2024-12-25T10:00:00Z",
    "description": "Consulta inicial",
    "type": "consulta"
  }
  ```
- **Respuesta:** `201 Created`

### Listar Citas
- **GET** `/api/appointments`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Parámetros de Consulta:**
  - `status`: pendiente, confirmada, completada, cancelada
  - `page`: paginación (por defecto: 1)
  - `limit`: items por página (por defecto: 10)
- **Respuesta:** `200 OK`

### Detalles de Cita
- **GET** `/api/appointments/:id`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Respuesta:** `200 OK`

### Actualizar Cita
- **PUT** `/api/appointments/:id`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Body:** Mismo que crear cita
- **Respuesta:** `200 OK`

### Cancelar Cita
- **DELETE** `/api/appointments/:id`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Respuesta:** `200 OK`

---

## Usuarios

### Obtener Perfil de Usuario
- **GET** `/api/users/profile`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Respuesta:** `200 OK`

### Actualizar Perfil de Usuario
- **PUT** `/api/users/profile`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Body:**
  ```json
  {
    "name": "Nuevo Nombre",
    "email": "nuevoemail@example.com",
    "bio": "Biografía profesional"
  }
  ```
- **Respuesta:** `200 OK`

### Cambiar Contraseña
- **PUT** `/api/users/change-password`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Body:**
  ```json
  {
    "currentPassword": "ContraseñaAntigua@2024",
    "newPassword": "ContraseñaNueva@2024",
    "confirmPassword": "ContraseñaNueva@2024"
  }
  ```
- **Respuesta:** `200 OK`

### Obtener Estadísticas de Usuario
- **GET** `/api/users/stats`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Respuesta:** `200 OK`
  ```json
  {
    "statusCode": 200,
    "success": true,
    "data": {
      "totalAppointments": 15,
      "completedAppointments": 12,
      "cancelledAppointments": 2,
      "upcomingAppointments": 1,
      "memberSince": "2024-01-01"
    },
    "message": "Estadísticas del usuario obtenidas"
  }
  ```

### Desactivar Cuenta
- **DELETE** `/api/users/delete-data`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Body:**
  ```json
  {
    "password": "ContraseñaActual@2024"
  }
  ```
- **Respuesta:** `200 OK`

---

## Gestión de Clínicas

### Crear Clínica
- **POST** `/api/clinics`
- **Headers:** `Authorization: Bearer {accessToken}` (Admin/Propietario)
- **Body:**
  ```json
  {
    "name": "Nombre de la Clínica",
    "address": "Dirección",
    "phone": "+1234567890",
    "website": "https://clinica.com"
  }
  ```
- **Respuesta:** `201 Created`

### Listar Clínicas
- **GET** `/api/clinics`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Parámetros de Consulta:**
  - `page`: paginación
  - `limit`: items por página
- **Respuesta:** `200 OK`

### Detalles de Clínica
- **GET** `/api/clinics/:id`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Respuesta:** `200 OK`

### Actualizar Clínica
- **PUT** `/api/clinics/:id`
- **Headers:** `Authorization: Bearer {accessToken}` (Propietario)
- **Body:** Mismo que crear clínica
- **Respuesta:** `200 OK`

### Eliminar Clínica
- **DELETE** `/api/clinics/:id`
- **Headers:** `Authorization: Bearer {accessToken}` (Admin)
- **Respuesta:** `200 OK`

---

## Historiales Médicos

### Crear Historial Médico
- **POST** `/api/medical-records`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Body:**
  ```json
  {
    "patientId": "patient_123",
    "diagnosis": "Trastorno de Ansiedad",
    "treatment": "TCC",
    "notes": "Notas del tratamiento..."
  }
  ```
- **Respuesta:** `201 Created`

### Obtener Historial Médico
- **GET** `/api/medical-records/:id`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Respuesta:** `200 OK`

### Listar Historiales por Paciente
- **GET** `/api/patients/:patientId/medical-records`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Respuesta:** `200 OK`

### Actualizar Historial Médico
- **PUT** `/api/medical-records/:id`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Body:** Mismo que crear historial
- **Respuesta:** `200 OK`

### Eliminar Historial Médico
- **DELETE** `/api/medical-records/:id`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Respuesta:** `200 OK`

---

## Facturación

### Crear Factura
- **POST** `/api/billings`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Body:**
  ```json
  {
    "appointmentId": "appointment_123",
    "amount": 100.00,
    "currency": "USD",
    "description": "Costo de sesión"
  }
  ```
- **Respuesta:** `201 Created`

### Listar Facturas
- **GET** `/api/billings`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Parámetros de Consulta:**
  - `status`: pendiente, pagada, cancelada
  - `page`: paginación
  - `limit`: items por página
- **Respuesta:** `200 OK`

### Marcar como Pagada
- **PUT** `/api/billings/:id/pay`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Respuesta:** `200 OK`

### Eliminar Factura
- **DELETE** `/api/billings/:id`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Respuesta:** `200 OK`

---

## Respuestas de Error

Todos los endpoints pueden devolver las siguientes respuestas de error:

### 400 Solicitud Incorrecta
```json
{
  "statusCode": 400,
  "success": false,
  "message": "Validación fallida",
  "errors": ["el campo1 es requerido"]
}
```

### 401 No Autorizado
```json
{
  "statusCode": 401,
  "success": false,
  "message": "No se proporcionó token"
}
```

### 403 Prohibido
```json
{
  "statusCode": 403,
  "success": false,
  "message": "Permisos insuficientes"
}
```

### 404 No Encontrado
```json
{
  "statusCode": 404,
  "success": false,
  "message": "Recurso no encontrado"
}
```

### 500 Error Interno del Servidor
```json
{
  "statusCode": 500,
  "success": false,
  "message": "Error interno del servidor",
  "error": "Detalles del error..."
}
```

---

**Última Actualización:** 2024-12-21  
**Versión de API:** v1 (Psychology Assistant)
