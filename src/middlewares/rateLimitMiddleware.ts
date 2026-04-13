import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import logger from '../config/logger.js';

/**
 * @module rateLimiters
 * @description Configuraciones de rate limiting para diferentes endpoints.
 * ES: Protege la API contra abuso y ataques DDoS.
 * EN: Protects API against abuse and DDoS attacks.
 */

// Rate limiter para autenticación (login, registro)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos por ventana
  message: {
    status: 'error',
    message: 'Too many authentication attempts, please try again later',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logger.warn(
      {
        ip: req.ip,
        endpoint: req.path,
        userAgent: req.get('User-Agent'),
      },
      'Rate limit exceeded for auth endpoints'
    );

    res.status(429).json({
      status: 'error',
      message: 'Too many authentication attempts, please try again later',
      retryAfter: '15 minutes',
    });
  },
  skip: (req: Request) => {
    if (process.env.NODE_ENV === 'test') {
      return true;
    }

    // Skip rate limiting for admin users (if implemented)
    return req.user?.role === 'admin';
  },
});

// Rate limiter general para API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requests por ventana
  message: {
    status: 'error',
    message: 'Too many requests, please try again later',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logger.warn(
      {
        ip: req.ip,
        endpoint: req.path,
        userAgent: req.get('User-Agent'),
        userId: req.user?._id,
      },
      'Rate limit exceeded for API endpoints'
    );

    res.status(429).json({
      status: 'error',
      message: 'Too many requests, please try again later',
      retryAfter: '15 minutes',
    });
  },
  skip: () => process.env.NODE_ENV === 'test',
});

// Rate limiter estricto para endpoints sensibles
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // Máximo 10 requests por hora
  message: {
    status: 'error',
    message: 'Too many sensitive operations, please try again later',
    retryAfter: '1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logger.warn(
      {
        ip: req.ip,
        endpoint: req.path,
        userId: req.user?._id,
      },
      'Rate limit exceeded for sensitive endpoints'
    );

    res.status(429).json({
      status: 'error',
      message: 'Too many sensitive operations, please try again later',
      retryAfter: '1 hour',
    });
  },
  skip: () => process.env.NODE_ENV === 'test',
});

// Rate limiter para creación de recursos
export const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20, // Máximo 20 creaciones por hora
  message: {
    status: 'error',
    message: 'Too many resource creations, please try again later',
    retryAfter: '1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logger.warn(
      {
        ip: req.ip,
        endpoint: req.path,
        userId: req.user?._id,
      },
      'Rate limit exceeded for resource creation'
    );

    res.status(429).json({
      status: 'error',
      message: 'Too many resource creations, please try again later',
      retryAfter: '1 hour',
    });
  },
  skip: () => process.env.NODE_ENV === 'test',
});
