import jwt from 'jsonwebtoken';
import { totp } from 'otplib';
import environment from '../config/environment.js';
import logger from '../config/logger.js';
import Session from '../models/session.js';
import User from '../models/user.js';
import qrService from '../services/qrService.js';
import twoFAService from '../services/twoFAService.js';
import { ApiResponse, sendResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/appError.js';

/**
 * @module register
 * @description Registra un nuevo usuario con validación completa.
 * ES: Crea usuario con hash de contraseña, validaciones y logging.
 * EN: Creates user with password hashing, validations and logging.
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    throw new Error('User already exists');
  }

  // Create user (password will be hashed by pre-save hook)
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password
  });

  // Create session
  await Session.create({
    user: user._id,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Generate token
  const token = jwt.sign({ id: user._id }, environment.JWT_SECRET, {
    expiresIn: environment.JWT_EXPIRE
  });

  logger.info('User registered successfully', { userId: user._id, email: user.email });

  const response = ApiResponse.success(
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    },
    'User registered successfully'
  );

  sendResponse(res, response);
});

/**
 * @module login
 * @description Maneja el login de usuario con validación y logging.
 * ES: Verifica credenciales, crea sesión y genera token JWT.
 * EN: Verifies credentials, creates session and generates JWT token.
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check if account is active
  if (!user.isActive) {
    throw new Error('Account is deactivated');
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Create session
  await Session.create({
    user: user._id,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Generate token
  const token = jwt.sign({ id: user._id }, environment.JWT_SECRET, {
    expiresIn: environment.JWT_EXPIRE
  });

  logger.info('User logged in successfully', { userId: user._id, email: user.email });

  const response = ApiResponse.success(
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        twoFAEnabled: user.twoFAEnabled
      },
      token
    },
    'Login successful'
  );

  sendResponse(res, response);
});

/**
 * @module enable2FA
 * @description Habilita la autenticación de dos factores para el usuario.
 * ES: Genera secreto TOTP y QR code para configuración 2FA.
 * EN: Generates TOTP secret and QR code for 2FA setup.
 */
export const enable2FA = asyncHandler(async (req, res) => {
  const secret = twoFAService.generate2FACode();
  const otpAuthUrl = totp.keyuri(req.user.email, 'PsychologyAssistant', secret);

  const qrCode = await qrService.generateQR(otpAuthUrl);

  req.user.twoFASecret = secret;
  req.user.twoFAEnabled = false; // Will be enabled after verification
  await req.user.save();

  logger.info('2FA setup initiated', { userId: req.user._id });

  const response = ApiResponse.success(
    { qrCode, secret },
    'Scan the QR code with your authenticator app'
  );

  sendResponse(res, response);
});

/**
 * @module verify2FA
 * @description Verifica el código 2FA y habilita la autenticación.
 * ES: Valida el token TOTP y activa 2FA para el usuario.
 * EN: Validates TOTP token and enables 2FA for the user.
 */
export const verify2FA = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!req.user.twoFASecret) {
    throw new Error('2FA not initialized');
  }

  const isValid = twoFAService.verify2FACode(token, req.user.twoFASecret);

  if (!isValid) {
    throw new Error('Invalid 2FA token');
  }

  req.user.twoFAEnabled = true;
  await req.user.save();

  logger.info('2FA enabled successfully', { userId: req.user._id });

  const response = ApiResponse.success(
    { twoFAEnabled: true },
    'Two-factor authentication enabled successfully'
  );

  sendResponse(res, response);
});

/**
 * @module logout
 * @description Cierra la sesión del usuario.
 * ES: Marca la sesión como inactiva y registra el logout.
 * EN: Marks session as inactive and logs the logout.
 */
export const logout = asyncHandler(async (req, res) => {
  // Find active session
  const session = await Session.findOne({
    user: req.user._id,
    isActive: true
  }).sort({ loginTime: -1 });

  if (session) {
    await session.logout();
  }

  logger.info('User logged out', { userId: req.user._id });

  const response = ApiResponse.success(null, 'Logged out successfully');
  sendResponse(res, response);
});
