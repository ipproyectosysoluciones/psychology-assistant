import logger from '../config/logger.js';

/**
 * @module auditMiddleware
 * @description Middleware para auditar acciones críticas en el sistema.
 * ES: Registra todas las acciones sensibles para auditoría y seguridad.
 * EN: Logs all sensitive actions for audit and security purposes.
 */

// Acciones críticas que requieren auditoría
const CRITICAL_ACTIONS = {
  USER_LOGIN: 'USER_LOGIN',
  USER_REGISTER: 'USER_REGISTER',
  USER_LOGOUT: 'USER_LOGOUT',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  ACCOUNT_DEACTIVATE: 'ACCOUNT_DEACTIVATE',
  TWO_FA_ENABLE: 'TWO_FA_ENABLE',
  TWO_FA_VERIFY: 'TWO_FA_VERIFY',
  APPOINTMENT_CREATE: 'APPOINTMENT_CREATE',
  APPOINTMENT_UPDATE: 'APPOINTMENT_UPDATE',
  APPOINTMENT_DELETE: 'APPOINTMENT_DELETE',
  PROFILE_UPDATE: 'PROFILE_UPDATE'
};

// Alias usado por controladores
export const AUDIT_EVENTS = {
  LOGIN: CRITICAL_ACTIONS.USER_LOGIN,
  REGISTER: CRITICAL_ACTIONS.USER_REGISTER,
  LOGOUT: CRITICAL_ACTIONS.USER_LOGOUT,
  PASSWORD_CHANGE: CRITICAL_ACTIONS.PASSWORD_CHANGE,
  ACCOUNT_DEACTIVATION: CRITICAL_ACTIONS.ACCOUNT_DEACTIVATE,
  TWO_FA_ENABLE: CRITICAL_ACTIONS.TWO_FA_ENABLE,
  TWO_FA_VERIFY: CRITICAL_ACTIONS.TWO_FA_VERIFY,
  DATA_ACCESS: 'DATA_ACCESS',
  DATA_MODIFICATION: 'DATA_MODIFICATION',
  DATA_DELETION: 'DATA_DELETION_GDPR',
  SECURITY_FAILURE: 'SECURITY_FAILURE'
};

const isRequestLike = (value) =>
  value && typeof value === 'object' && typeof value.get === 'function';

/**
 * Registra una acción de auditoría
 * @param {string} action - Tipo de acción
 * @param {object} details - Detalles adicionales
 * @param {object} req - Request object
 */
export const auditLog = (...args) => {
  let auditEntry;

  // Compatible con la versión antigua: auditLog(action, details, req)
  if (args.length >= 3 && isRequestLike(args[2])) {
    const [action, details, req] = args;
    auditEntry = {
      timestamp: new Date().toISOString(),
      action,
      userId: req.user?._id || 'anonymous',
      userEmail: req.user?.email || 'N/A',
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.get('User-Agent'),
      path: req.path,
      method: req.method,
      details: details || {},
      result: 'SUCCESS'
    };
  } else {
    // Nueva firma: auditLog(userId, action, resource, details, result, error)
    const [userId, action, resource, details = {}, result = 'SUCCESS', error = null] = args;
    auditEntry = {
      timestamp: new Date().toISOString(),
      userId: userId || 'anonymous',
      action,
      resource,
      details,
      result,
      error
    };
  }

  if (auditEntry.result === 'FAILURE') {
    logger.warn('Audit Failure', auditEntry);
  } else {
    logger.info('Audit Log', auditEntry);
  }

  return auditEntry;
};

/**
 * Registra intentos fallidos de acciones críticas
 * @param {string} action - Tipo de acción
 * @param {string} reason - Razón del fallo
 * @param {object} req - Request object
 */
export const auditFailure = (action, reason, req) => {
  const auditEntry = {
    timestamp: new Date().toISOString(),
    action,
    userId: req.user?._id || 'anonymous',
    userEmail: req.user?.email || 'N/A',
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    path: req.path,
    method: req.method,
    reason,
    status: 'failure'
  };

  logger.warn('Audit Failure', auditEntry);

  return auditEntry;
};

/**
 * Middleware para auditar accesos a rutas críticas
 */
export const auditMiddleware = (action) => {
  return (req, res, next) => {
    const originalSend = res.send;

    res.send = function (data) {
      // Si la respuesta fue exitosa (2xx), auditar
      if (res.statusCode >= 200 && res.statusCode < 300) {
        auditLog(action, { statusCode: res.statusCode }, req);
      } else if (res.statusCode >= 400) {
        // Si falló, auditar el error
        auditFailure(action, `HTTP ${res.statusCode}`, req);
      }

      originalSend.call(this, data);
    };

    next();
  };
};

export { CRITICAL_ACTIONS };
export default { auditLog, auditFailure, auditMiddleware, CRITICAL_ACTIONS };
