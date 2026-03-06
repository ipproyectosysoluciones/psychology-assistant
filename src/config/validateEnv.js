import dotenv from 'dotenv';

dotenv.config();

/**
 * ES: Validación de variables de entorno
 * EN: Environment variables validation
 */

const requiredVars = ['JWT_SECRET', 'MONGO_URI'];

/**
 * ES: Valida que las variables requeridas estén presentes
 * EN: Validates that required variables are present
 */
export function validateEnvironment() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const errors = [];

  // Check required variables
  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  });

  // Check production-specific variables
  if (nodeEnv === 'production') {
    if (!process.env.DATABASE_URL && !process.env.MONGO_URI) {
      errors.push('Production: DATABASE_URL or MONGO_URI is required');
    }
  }

  // Validate JWT_SECRET length
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters long');
  }

  // Validate SESSION_SECRET length
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length < 32) {
    console.warn('Warning: SESSION_SECRET should be at least 32 characters');
  }

  // Validate NODE_ENV
  const validEnvs = ['development', 'test', 'production'];
  if (!validEnvs.includes(nodeEnv)) {
    errors.push(`NODE_ENV must be one of: ${validEnvs.join(', ')}`);
  }

  // Validate PORT
  if (process.env.PORT) {
    const port = parseInt(process.env.PORT, 10);
    if (isNaN(port) || port < 1024 || port > 65535) {
      errors.push('PORT must be a number between 1024 and 65535');
    }
  }

  // If there are errors, throw exception
  if (errors.length > 0) {
    console.error('\n❌ Environment Validation Errors:\n');
    errors.forEach((error) => {
      console.error(`   • ${error}`);
    });
    console.error('\n📖 See .env.example for documentation\n');
    throw new Error(
      `Environment validation failed with ${errors.length} error(s)`,
    );
  }

  // Success message for non-production
  if (nodeEnv !== 'production') {
    console.log('✅ Environment variables validated successfully');
  }

  return true;
}

/**
 * ES: Obtiene un resumen de la configuración actual
 * EN: Gets a summary of the current configuration
 */
export function getEnvironmentSummary() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const port = process.env.PORT || 5000;
  const dbType = process.env.DATABASE_URL
    ? 'Real MongoDB'
    : 'In-Memory MongoDB';

  return {
    environment: nodeEnv,
    port,
    database: dbType,
    jwtExpire: process.env.JWT_EXPIRE || '7d',
    logLevel: process.env.LOG_LEVEL || 'info',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  };
}
