import xss from 'xss';
import logger from '../config/logger.js';

/**
 * @module sanitizationMiddleware
 * @description Sanitiza inputs para prevenir XSS y validación de datos.
 * ES: Limpia todas las entradas para evitar inyección de código.
 * EN: Cleans all inputs to prevent code injection.
 */

/**
 * Sanitiza strings para prevenir XSS
 * @param {string} str - String a sanitizar
 * @returns {string} - String sanitizado
 */
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  // Remover scripts y etiquetas peligrosas
  return xss(str.trim(), {
    whiteList: {},
    stripIgnoredTag: true,
    stripLeadingAndTrailingWhitespace: true,
  });
};

/**
 * Sanitiza objetos recursivamente
 * @param {object} obj - Objeto a sanitizar
 * @returns {object} - Objeto sanitizado
 */
export const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }

  if (typeof obj === 'object') {
    const sanitized = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
};

/**
 * Middleware para sanitizar body, query y params
 */
export const sanitizationMiddleware = (req, res, next) => {
  try {
    // Sanitizar body
    if (req.body && Object.keys(req.body).length > 0) {
      req.body = sanitizeObject(req.body);
    }

    // Sanitizar query
    if (req.query && Object.keys(req.query).length > 0) {
      req.query = sanitizeObject(req.query);
    }

    // Sanitizar params
    if (req.params && Object.keys(req.params).length > 0) {
      req.params = sanitizeObject(req.params);
    }

    logger.debug('Input sanitized', {
      path: req.path,
      method: req.method,
    });

    next();
  } catch (error) {
    logger.error('Sanitization error', {
      error: error.message,
      path: req.path,
    });
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
