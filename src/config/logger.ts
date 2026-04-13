import pino from 'pino';

/**
 * @module logger
 * @description Centralized logger configuration using pino.
 * Pino is the fastest Node.js logger - 30% faster than alternatives.
 * ES: Logger centralizado con pino para logs estructurados y de alto rendimiento.
 * EN: Centralized logger with pino for structured, high-performance logging.
 */

const isDevelopment = process.env.NODE_ENV !== 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
          destination: 1,
        },
      }
    : undefined,
  formatters: {
    level: (label: string) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {
    service: 'psychology-assistant',
  },
});

export default logger;
