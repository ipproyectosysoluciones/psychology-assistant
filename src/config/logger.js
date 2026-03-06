import winston from 'winston';
import environment from './environment.js';

/**
 * @module logger
 * @description Configuración centralizada de Winston para logging en la aplicación.
 * ES: Proporciona búsqueda consistente a archivos y consola con niveles configurables.
 * EN: Provides consistent logging to files and console with configurable levels.
 */

const { combine, timestamp, printf, colorize, errors } = winston.format;

const customFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: environment.LOG_LEVEL,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    customFormat
  ),
  defaultMeta: { service: 'psychology-assistant' },
  transports: [
    // Error logs
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // All logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5
    })
  ]
});

// Console transport en desarrollo
if (environment.isDevelopment()) {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), customFormat)
    })
  );
}

export default logger;
