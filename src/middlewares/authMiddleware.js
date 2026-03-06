import jwt from 'jsonwebtoken';
import environment from '../config/environment.js';
import User from '../models/user.js';
import { AppError, asyncHandler } from '../utils/appError.js';

/**
 * @module protect
 * @description Middleware para proteger rutas que requieren autenticación JWT.
 * ES: Verifica el token JWT y adjunta la información del usuario a la solicitud.
 * EN: Verifies JWT token and attaches user information to the request.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Not authorized to access this route', 401);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, environment.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw new AppError('No user found with this token', 401);
    }

    if (!user.isActive) {
      throw new AppError('User account is deactivated', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    throw new AppError('Not authorized to access this route', 401);
  }
});

/**
 * @module authorize
 * @description Middleware para autorizar roles específicos.
 * ES: Verifica que el usuario tenga uno de los roles permitidos.
 * EN: Checks if user has one of the allowed roles.
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(`User role ${req.user.role} is not authorized to access this route`, 403);
    }

    next();
  };
};

/**
 * @module require2FA
 * @description Middleware para requerir autenticación de dos factores.
 * ES: Verifica que el usuario tenga 2FA habilitado.
 * EN: Checks if user has 2FA enabled.
 */
export const require2FA = (req, res, next) => {
  if (!req.user.twoFAEnabled) {
    throw new AppError('Two-factor authentication is required', 403);
  }
  next();
};
