import dotenv from 'dotenv';

dotenv.config();

/**
 * @module environment
 * @description Configuración centralizada de variables de entorno con validaciones.
 * ES: Gestiona todas las variables de entorno requeridas y proporciona valores por defecto.
 * EN: Manages all required environment variables and provides default values.
 */

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];

// Validar variables requeridas
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Environment variable ${envVar} is required`);
  }
});

export default {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  MONGO_URI: process.env.MONGO_URI,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',

  // 2FA
  TWO_FA_WINDOW: parseInt(process.env.TWO_FA_WINDOW || '2', 10),

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // Session
  SESSION_SECRET: process.env.SESSION_SECRET || 'default-session-secret',
  SESSION_TIMEOUT: parseInt(process.env.SESSION_TIMEOUT || '3600000', 10),

  // Utilities
  isDevelopment: () => process.env.NODE_ENV === 'development',
  isProduction: () => process.env.NODE_ENV === 'production',
  isTesting: () => process.env.NODE_ENV === 'test'
};
