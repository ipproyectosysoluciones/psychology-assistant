/**
 * @module AppError
 * @description Clase personalizada para manejo de errores en la aplicación.
 * ES: Proporciona errores estructurados con código y mensaje.
 * EN: Provides structured errors with status code and message.
 */

export class AppError extends Error {
  constructor (message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest (message = 'Bad Request') {
    return new AppError(message, 400);
  }

  static unauthorized (message = 'Unauthorized') {
    return new AppError(message, 401);
  }

  static forbidden (message = 'Forbidden') {
    return new AppError(message, 403);
  }

  static notFound (message = 'Resource not found') {
    return new AppError(message, 404);
  }

  static conflict (message = 'Conflict') {
    return new AppError(message, 409);
  }

  static internal (message = 'Internal server error') {
    return new AppError(message, 500);
  }
}

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
