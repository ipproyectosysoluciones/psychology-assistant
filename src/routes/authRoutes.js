import express from 'express';
import { body } from 'express-validator';
import {
  enable2FA,
  login,
  logout,
  refreshAccessToken,
  register,
  verify2FA
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import {
  authLimiter,
  strictLimiter
} from '../middlewares/rateLimitMiddleware.js';
import { validateRequest } from '../utils/validators.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: Usuario ya existe
 */
router.post(
  '/register',
  authLimiter, // Rate limiting estricto para registro
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Must be a valid email address'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain uppercase, lowercase, and numbers')
  ],
  validateRequest,
  register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Login exitoso
 *       400:
 *         description: Credenciales inválidas
 *       401:
 *         description: No autorizado
 */
router.post(
  '/login',
  authLimiter, // Rate limiting estricto para login
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Must be a valid email address'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  login
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 *       401:
 *         description: No autorizado
 */
router.post('/logout', protect, logout);

/**
 * @swagger
 * /api/auth/enable-2fa:
 *   post:
 *     summary: Habilitar autenticación de dos factores
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 2FA habilitado exitosamente
 *       401:
 *         description: No autorizado
 */
router.post('/enable-2fa', protect, strictLimiter, enable2FA);

/**
 * @swagger
 * /api/auth/verify-2fa:
 *   post:
 *     summary: Verificar código 2FA
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *     responses:
 *       200:
 *         description: 2FA verificado exitosamente
 *       400:
 *         description: Token inválido
 *       401:
 *         description: No autorizado
 */
router.post(
  '/verify-2fa',
  protect,
  strictLimiter,
  [
    body('token')
      .trim()
      .isLength({ min: 6, max: 6 })
      .withMessage('Invalid 2FA token')
      .isNumeric()
      .withMessage('Invalid 2FA token')
  ],
  validateRequest,
  verify2FA
);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refrescar token de acceso
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Token de refresco válido
 *     responses:
 *       200:
 *         description: Token de acceso renovado exitosamente
 *       400:
 *         description: Refresh token requerido
 *       401:
 *         description: Refresh token inválido o expirado
 */
router.post(
  '/refresh-token',
  [
    body('refreshToken')
      .notEmpty()
      .withMessage('Refresh token is required')
      .isString()
      .withMessage('Refresh token must be a string')
  ],
  validateRequest,
  refreshAccessToken
);

export default router;
