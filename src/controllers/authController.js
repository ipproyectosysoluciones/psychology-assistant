import jwt from 'jsonwebtoken';
import { totp } from 'otplib';
import environment from '../config/environment.js';
import logger from '../config/logger.js';
import { AUDIT_EVENTS, auditLog } from '../middlewares/auditMiddleware.js';
import { RefreshToken } from '../models/refreshToken.js';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';
import qrService from '../services/qrService.js';
import twoFAService from '../services/twoFAService.js';
import validationService from '../services/validationService.js';
import { ApiResponse, sendResponse } from '../utils/apiResponse.js';
import { AppError, asyncHandler } from '../utils/appError.js';

/**
 * @helper generateTokens
 * @description Genera access token y refresh token para un usuario.
 * ES: Crea ambos tokens con configuración segura.
 * EN: Creates both tokens with secure configuration.
 */
const generateTokens = async (userId, ipAddress, userAgent) => {
  try {
    // Access token: 7 días de expiración
    const accessToken = jwt.sign({ id: userId }, environment.JWT_SECRET, {
      expiresIn: environment.JWT_EXPIRE
    });

    // Refresh token: 30 días de expiración
    const refreshTokenValue = jwt.sign(
      { id: userId, type: 'refresh' },
      environment.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Guardar refresh token en base de datos
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const refreshToken = await RefreshToken.create({
      user: userId,
      token: refreshTokenValue,
      expiresAt,
      ipAddress,
      userAgent
    });

    return {
      accessToken,
      refreshToken: refreshTokenValue,
      refreshTokenId: refreshToken._id
    };
  } catch (error) {
    logger.error('Error generating tokens', {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

/**
 * @module register
 * @description Registra un nuevo usuario con validación completa.
 * ES: Crea usuario con hash de contraseña, validaciones y logging.
 * EN: Creates user with password hashing, validations and logging.
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Advanced email validation
  const emailValidation = validationService.validateEmail(email);
  if (!emailValidation.valid) {
    auditLog(
      null,
      AUDIT_EVENTS.REGISTER,
      'User',
      { email },
      'FAILURE',
      emailValidation.error
    );
    throw AppError.badRequest(emailValidation.error);
  }

  // Check if user exists
  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    auditLog(
      null,
      AUDIT_EVENTS.REGISTER,
      'User',
      { email },
      'FAILURE',
      'User already exists'
    );
    throw AppError.badRequest('User already exists');
  }

  // Advanced password strength validation
  const passwordValidation =
    validationService.validatePasswordStrength(password);
  if (!passwordValidation.valid) {
    auditLog(
      null,
      AUDIT_EVENTS.REGISTER,
      'User',
      { email },
      'FAILURE',
      'Weak password'
    );
    throw AppError.badRequest(
      `Password is too weak: ${passwordValidation.error}`
    );
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

  // Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateTokens(
    user._id,
    req.ip,
    req.get('User-Agent')
  );

  // Audit log successful registration
  auditLog(
    user._id,
    AUDIT_EVENTS.REGISTER,
    'User',
    { email: user.email, name: user.name },
    'SUCCESS'
  );

  logger.info('User registered successfully', {
    userId: user._id,
    email: user.email
  });

  const response = ApiResponse.success(
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
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
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+password'
  );
  if (!user) {
    auditLog(
      null,
      AUDIT_EVENTS.LOGIN,
      'User',
      { email },
      'FAILURE',
      'User not found'
    );
    throw AppError.badRequest('Invalid credentials');
  }

  // Check if account is active
  if (!user.isActive) {
    auditLog(
      user._id,
      AUDIT_EVENTS.LOGIN,
      'User',
      { email },
      'FAILURE',
      'Account deactivated'
    );
    throw AppError.badRequest('Account is deactivated');
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    auditLog(
      user._id,
      AUDIT_EVENTS.LOGIN,
      'User',
      { email },
      'FAILURE',
      'Invalid password'
    );
    throw AppError.badRequest('Invalid credentials');
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

  // Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateTokens(
    user._id,
    req.ip,
    req.get('User-Agent')
  );

  // Audit log successful login
  auditLog(
    user._id,
    AUDIT_EVENTS.LOGIN,
    'User',
    {
      email: user.email,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    },
    'SUCCESS'
  );

  logger.info('User logged in successfully', {
    userId: user._id,
    email: user.email
  });

  const response = ApiResponse.success(
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        twoFAEnabled: user.twoFAEnabled
      },
      accessToken,
      refreshToken
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
  // Check if 2FA is already enabled
  if (req.user.twoFAEnabled) {
    throw AppError.badRequest('2FA is already enabled for this account');
  }

  const secret = twoFAService.generateSecret();
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
    throw AppError.badRequest('2FA not initialized');
  }

  const isValid = twoFAService.verify2FACode(token, req.user.twoFASecret);

  if (!isValid) {
    throw AppError.badRequest('Invalid 2FA token');
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
 * ES: Marca la sesión como inactiva, revoca refresh tokens y registra el logout.
 * EN: Marks session as inactive, revokes refresh tokens and logs the logout.
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

  // Revoke all active refresh tokens for this user
  await RefreshToken.updateMany(
    { user: req.user._id, isRevoked: false },
    {
      isRevoked: true,
      revokedAt: new Date(),
      revokedReason: 'Logout'
    }
  );

  auditLog(req.user._id, AUDIT_EVENTS.LOGOUT, 'User', {}, 'SUCCESS');
  logger.info('User logged out', { userId: req.user._id });

  const response = ApiResponse.success(null, 'Logged out successfully');
  sendResponse(res, response);
});

/**
 * @module refreshToken
 * @description Refresca el access token usando un refresh token válido.
 * ES: Valida el refresh token y genera un nuevo access token.
 * EN: Validates refresh token and generates a new access token.
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Refresh token is required', 400);
  }

  // Validate refresh token in database
  const tokenDoc = await RefreshToken.findOne({
    token: refreshToken,
    isRevoked: false
  }).populate('user', 'id name email role');

  if (!tokenDoc) {
    throw new AppError('Invalid or revoked refresh token', 401);
  }

  if (tokenDoc.isExpired()) {
    await tokenDoc.revoke('Expired');
    throw new AppError('Refresh token has expired', 401);
  }

  // Verify JWT signature
  try {
    jwt.verify(refreshToken, environment.JWT_SECRET);
  } catch (error) {
    await tokenDoc.revoke('Invalid signature');
    throw new AppError('Invalid refresh token', 401);
  }

  // Generate new access token
  const newAccessToken = jwt.sign(
    { id: tokenDoc.user._id },
    environment.JWT_SECRET,
    { expiresIn: environment.JWT_EXPIRE }
  );

  auditLog(
    tokenDoc.user._id,
    AUDIT_EVENTS.LOGIN,
    'User',
    { action: 'Token refresh' },
    'SUCCESS'
  );

  logger.info('Access token refreshed', { userId: tokenDoc.user._id });

  const response = ApiResponse.success(
    {
      accessToken: newAccessToken
    },
    'Token refreshed successfully'
  );

  sendResponse(res, response);
});
