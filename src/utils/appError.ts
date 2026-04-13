import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Custom application error class
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad Request'): AppError {
    return new AppError(message, 400);
  }

  static unauthorized(message = 'Unauthorized'): AppError {
    return new AppError(message, 401);
  }

  static forbidden(message = 'Forbidden'): AppError {
    return new AppError(message, 403);
  }

  static notFound(message = 'Resource not found'): AppError {
    return new AppError(message, 404);
  }

  static conflict(message = 'Conflict'): AppError {
    return new AppError(message, 409);
  }

  static internal(message = 'Internal server error'): AppError {
    return new AppError(message, 500);
  }
}

/**
 * Async handler wrapper for Express route handlers
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
