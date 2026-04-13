import xss from 'xss';
import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.js';

/**
 * @module sanitizationMiddleware
 * @description Sanitiza inputs para prevenir XSS y validación de datos.
 * ES: Limpia todas las entradas para evitar inyección de código.
 * EN: Cleans all inputs to prevent code injection.
 */

/**
 * Sanitiza strings para prevenir XSS
 * @param str - String a sanitizar
 * @returns String sanitizado
 */
export const sanitizeString = (str: unknown): unknown => {
  if (typeof str !== 'string') return str;
  // Remover scripts y etiquetas peligrosas
  return xss(str.trim(), {
    whiteList: {},
    stripIgnoreTag: true,
  });
};

/**
 * Sanitiza objetos recursivamente
 * @param obj - Objeto a sanitizar
 * @returns Objeto sanitizado
 */
export const sanitizeObject = (obj: unknown): unknown => {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map((item: unknown) => sanitizeObject(item));
  }

  if (typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const key in obj as Record<string, unknown>) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[key] = sanitizeObject((obj as Record<string, unknown>)[key]);
      }
    }
    return sanitized;
  }

  return obj;
};

/**
 * Middleware para sanitizar body, query y params
 */
export const sanitizationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Sanitizar body
    if (req.body && Object.keys(req.body).length > 0) {
      req.body = sanitizeObject(req.body);
    }

    // Sanitizar query - solo sanitizar valores string (bug fix AGENTS.md #3)
    if (req.query && Object.keys(req.query).length > 0) {
      for (const key in req.query) {
        if (typeof req.query[key] === 'string') {
          req.query[key] = sanitizeString(req.query[key]) as string;
        }
      }
    }

    // Sanitizar params
    if (req.params && Object.keys(req.params).length > 0) {
      req.params = sanitizeObject(req.params) as Record<string, string>;
    }

    logger.debug(
      {
        path: req.path,
        method: req.method,
      },
      'Input sanitized'
    );

    next();
  } catch (error) {
    logger.error(
      {
        error: (error as Error).message,
        path: req.path,
      },
      'Sanitization error'
    );
    res.status(400).json({
      success: false,
      message: 'Invalid input detected',
    });
  }
};

export default {
  sanitizeString,
  sanitizeObject,
  sanitizationMiddleware,
};
