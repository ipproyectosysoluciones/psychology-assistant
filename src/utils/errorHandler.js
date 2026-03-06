
import environment from '../config/environment.js';
import logger from '../config/logger.js';
import { ApiResponse } from './apiResponse.js';
import { AppError } from './appError.js';

/**
 * @module errorHandler
 * @description Middleware global para manejo de errores en la aplicación.
 * ES: Maneja errores de manera centralizada con logging y respuestas estructuradas.
 * EN: Handles errors centrally with logging and structured responses.
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log del error
  logger.error('Error occurred', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AppError(message, 401);
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  // Send response
  const response = ApiResponse.error(message, statusCode);

  // Don't leak error details in production
  if (environment.isProduction()) {
    response.stack = undefined;
  } else {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

/**
 * @module asyncHandler
 * @description Wrapper para manejar errores en funciones async automáticamente.
 * ES: Envuelve funciones async para capturar errores automáticamente.
 * EN: Wraps async functions to catch errors automatically.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
