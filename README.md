# Psychology Assistant

## Estructura de Archivos

```bash
psychology-assistant/
│
├── src/
│   ├── config/
│   │   └── database.js        # Configuración de conexión a la base de datos
│   ├── controllers/
│   │   ├── authController.js   # Controlador de autenticación
│   │   ├── userController.js   # Controlador de usuarios
│   │   └── appointmentController.js  # Controlador de citas
│   ├── middlewares/
│   │   └── authMiddleware.js   # Middlewares para proteger rutas
│   ├── models/
│   │   ├── user.js             # Modelo de Usuario
│   │   ├── appointment.js      # Modelo de Citas
│   │   └── session.js          # Modelo de Sesiones
│   ├── routes/
│   │   ├── authRoutes.js       # Rutas de autenticación
│   │   ├── userRoutes.js       # Rutas de gestión de usuarios
│   │   └── appointmentRoutes.js # Rutas de citas
│   ├── services/
│   │   ├── qrService.js        # Servicio de generación de códigos QR
│   │   └── twoFAService.js     # Servicio de autenticación 2FA
│   ├── utils/
│   │   └── errorHandler.js     # Manejador de errores
│   ├── app.js                  # Configuración de la aplicación
│   └── server.js               # Punto de entrada del servidor
│
├── package.json                # Configuración del proyecto
├── .env                        # Variables de entorno
└── README.md                   # Documentación del proyecto
```

### Descripción del Funcionamiento

1. **Autenticación y Registro**:  
   - Los usuarios podrán registrarse y hacer login utilizando email y contraseña. El sistema usará `bcrypt` para el hashing de contraseñas.
   - Se integrará `passport` con `passport-local` y `passport-jwt` para manejar sesiones y autenticación con tokens JWT.

2. **Autenticación 2FA**:  
   - Se utilizará `otplib` para la generación y validación de códigos de autenticación de dos factores (2FA).  
   - Se generarán códigos QR que los usuarios podrán escanear con aplicaciones como Google Authenticator para activar el 2FA.

3. **Creación de Sesiones e Historial de Usuario**:  
   - Las sesiones de los usuarios se guardarán en una colección de la base de datos (`sessions`) para poder mantener el historial de acceso y la gestión de la sesión activa.
   - El historial de cada usuario incluirá las citas agendadas y las notas de seguimiento que el psicólogo decida registrar.

4. **Generación de Citas y Códigos QR**:  
   - Las citas se almacenarán en la base de datos y se generará un código QR único para cada una de ellas utilizando `qrcode`.
   - El código QR puede contener información relevante como la fecha y hora de la cita, el ID del usuario, y un enlace para acceder directamente a la sesión.

5. **Modularización y Buenas Prácticas**:  
   - Todo el código estará modularizado en controladores, modelos, servicios, y utilidades para que sea fácil de mantener y escalar.
   - El manejo de errores será centralizado para asegurar que los errores se gestionen de manera consistente en toda la aplicación.

### **Tecnologías Recomendadas y a Instalar**

**Backend**:  

- `express`: Framework web para Node.js.
- `mongoose`: ODM para MongoDB.
- `dotenv`: Para manejar variables de entorno.
- `bcryptjs`: Para el hashing de contraseñas.
- `passport`, `passport-local`, `passport-jwt`: Para autenticación local y basada en JWT.
- `jsonwebtoken`: Para la generación y verificación de JWT.
- `otplib`: Para autenticación de dos factores (2FA).
- `qrcode`: Para generar códigos QR.
- `express-session`: Para manejar sesiones en Express.
- `cors`: Para manejar Cross-Origin Resource Sharing.

**Base de Datos**:  

- MongoDB (puedes utilizar un servicio como MongoDB Atlas para la nube).

**Otros**:  

- `pnpm`: Gestor de paquetes.
- `nodemon`: Para reiniciar el servidor automáticamente durante el desarrollo.

Asegúrate de instalar todas las dependencias con `pnpm install` antes de ejecutar la aplicación.

### Markmap del Proyecto

El markmap del proyecto se puede construir de la siguiente manera:

1. **Estructura General**
   - Configuración del servidor
   - Rutas principales: autenticación, usuarios, citas
   - Controladores: gestión de usuarios, sesiones y citas
   - Servicios: generación de códigos QR, autenticación 2FA

2. **Relaciones**
   - Usuarios ↔ Citas: Relación uno a muchos (un usuario puede tener múltiples citas).
   - Usuarios ↔ Sesiones: Relación uno a muchos (un usuario puede tener múltiples sesiones activas).
