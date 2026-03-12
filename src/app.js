import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/database.js';
import environment from './config/environment.js';
import logger from './config/logger.js';
import { specs, swaggerUi } from './config/swagger.js';
import { validateEnvironment } from './config/validateEnv.js';
import { apiLimiter } from './middlewares/rateLimitMiddleware.js';
import { sanitizationMiddleware } from './middlewares/sanitizationMiddleware.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import clinicalreportRoutes from './routes/clinicalreportRoutes.js';
import clinicRoutes from './routes/clinicRoutes.js';
import medicalrecordRoutes from './routes/medicalrecordRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import therapistRoutes from './routes/therapistRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './utils/errorHandler.js';

dotenv.config();

// Validate environment variables early
validateEnvironment();

// Conectar a base de datos
if (environment.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();

// Rate limiting general
app.use('/api/', apiLimiter);

// Middleware de seguridad y configuración
app.use(
  cors({
    origin: environment.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Sanitization middleware - prevent XSS attacks
app.use(sanitizationMiddleware);

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains',
  );
  next();
});

// Logging de requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: environment.NODE_ENV,
    version: '1.0.0',
  });
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/therapists', therapistRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/medical-records', medicalrecordRoutes);
app.use('/api/billings', billingRoutes);
app.use('/api/clinical-reports', clinicalreportRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handling middleware
app.use(errorHandler);

export default app;
