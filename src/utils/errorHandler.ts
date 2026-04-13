import { Request, Response, NextFunction } from 'express';
import pino from 'pino';
import { ApiResponse } from './apiResponse.js';

/**
 * @module errorHandler
 * @description Global error handling middleware.
 * ES: Maneja errores de manera centralizada con logging y respuestas estructuradas.
 * EN: Handles errors centrally with logging and structured responses.
 */

// Logger instance for error handler
const logger = pino({ name: 'errorHandler' });

const environment = {
  isProduction: () => process.env.NODE_ENV === 'production',
};

// Extend Error to add our custom properties
class CustomAppError extends Error {
  statusCode?: number;
  errors?: Array<{ field: string; message: string }>;
  keyValue?: Record<string, unknown>;
  code?: number;

  constructor(message: string) {
    super(message);
    this.name = 'CustomAppError';
  }
}

type AppError = CustomAppError;

export const errorHandler = (
  err: CustomAppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error: AppError = new CustomAppError(err.message);
  error.statusCode = err.statusCode;
  error.errors = (
    err as CustomAppError & {
      errors?: Array<{ field: string; message: string }>;
    }
  ).errors;

  // Log the error
  logger.error(
    {
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userId: (req as Request & { user?: { id: string } }).user?.id,
    },
    'Error occurred'
  );

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = new CustomAppError('Resource not found');
    error.statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = new CustomAppError(`${field.charAt(0).toUpperCase() + field.slice(1)} already exists`);
    error.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError' && err.errors) {
    const message = Object.values(err.errors)
      .map((val) => (val as { message: string }).message)
      .join(', ');
    error = new CustomAppError(message);
    error.statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new CustomAppError('Invalid token');
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error = new CustomAppError('Token expired');
    error.statusCode = 401;
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  // Send response
  const response = ApiResponse.error(message, statusCode);

  // Add validation errors if they exist
  if (error.errors && Array.isArray(error.errors)) {
    (response as ApiResponse & { errors: typeof error.errors }).errors = error.errors;
  }

  // Don't leak error details in production
  if (environment.isProduction()) {
    // TypeScript-safe deletion
    const responseObj = response as unknown as Record<string, unknown>;
    delete responseObj.stack;
  } else {
    (response as unknown as Record<string, unknown>).stack = err.stack;
  }

  res.status(statusCode).json(response);
};
