import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * @module validationRules
 * @description Centralized validation rules for all endpoints.
 * ES: Validación consistente de inputs en toda la aplicación.
 * EN: Consistent input validation across the application.
 */

export const authValidationRules = (): ValidationChain[] => {
  return [
    body('email').isEmail().normalizeEmail().withMessage('Email must be a valid email address'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain uppercase, lowercase, and numbers'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
  ];
};

export const appointmentValidationRules = (): ValidationChain[] => {
  return [
    body('date').isISO8601().toDate().withMessage('Date must be a valid ISO 8601 date'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
  ];
};

export const userUpdateValidationRules = (): ValidationChain[] => {
  return [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Email must be a valid email address'),
  ];
};

export const twoFAValidationRules = (): ValidationChain[] => {
  return [
    body('token')
      .isLength({ min: 6, max: 6 })
      .isNumeric()
      .withMessage('2FA token must be exactly 6 digits'),
  ];
};

// Custom error type for validation errors
interface ValidationError extends Error {
  statusCode: number;
  errors: Array<{ field: string; message: string }>;
}

/**
 * @module validateRequest
 * @description Middleware to validate requests using express-validator.
 * ES: Lanza error si hay errores de validación para ser manejado por errorHandler.
 * EN: Throws error if validation errors exist to be handled by errorHandler.
 */
export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: ValidationError = new Error('Validation failed') as ValidationError;
    error.statusCode = 400;
    error.errors = errors.array().map((err) => ({
      // @ts-expect-error - err is ValidationError with path property
      field: err.path,
      message: err.msg,
    }));
    return next(error);
  }
  next();
};

/**
 * @module validate
 * @description Legacy middleware for handling validation errors.
 * ES: Procesa errores de validación y devuelve respuestas estructuradas.
 * EN: Processes validation errors and returns structured responses.
 */
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        // @ts-expect-error - err is ValidationError with path property
        field: err.path,
        message: err.msg,
      })),
    });
    return;
  }
  next();
};
