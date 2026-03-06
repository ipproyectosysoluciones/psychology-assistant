import express from 'express';
import { body } from 'express-validator';
import {
  changePassword,
  deactivateAccount,
  deleteAllUserData,
  getUserProfile,
  getUserStats,
  updateUserProfile
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { strictLimiter } from '../middlewares/rateLimitMiddleware.js';
import { validateRequest } from '../utils/validators.js';

const router = express.Router();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Obtener perfil de usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/profile', protect, getUserProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Actualizar perfil de usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       409:
 *         description: Email ya en uso
 */
router.put(
  '/profile',
  protect,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Must be a valid email address')
  ],
  validateRequest,
  updateUserProfile
);

/**
 * @swagger
 * /api/users/change-password:
 *   post:
 *     summary: Cambiar contraseña
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 minLength: 8
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'
 *               confirmPassword:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Contraseña cambiada exitosamente
 *       400:
 *         description: Datos inválidos o contraseña actual incorrecta
 *       401:
 *         description: No autorizado
 *       429:
 *         description: Demasiados intentos
 */
router.post(
  '/change-password',
  protect,
  strictLimiter,
  [
    body('currentPassword')
      .trim()
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .trim()
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
        'New password must contain uppercase, lowercase, and numbers'
      )
  ],
  validateRequest,
  changePassword
);

/**
 * @swagger
 * /api/users/deactivate:
 *   post:
 *     summary: Desactivar cuenta
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Cuenta desactivada exitosamente
 *       400:
 *         description: Contraseña incorrecta
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       429:
 *         description: Demasiados intentos
 */
router.post(
  '/deactivate',
  protect,
  strictLimiter,
  [
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required to deactivate account')
  ],
  validateRequest,
  deactivateAccount
);

/**
 * @swagger
 * /api/users/stats:
 *   get:
 *     summary: Obtener estadísticas del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *       401:
 *         description: No autorizado
 */
router.get('/stats', protect, getUserStats);

/**
 * @swagger
 * /api/users/delete-data:
 *   delete:
 *     summary: Eliminar todos los datos del usuario (GDPR)
 *     description: |
 *       Elimina todos los datos personales del usuario incluyendo:
 *       - Citas agendadas
 *       - Sesiones activas y refresh tokens
 *       - Datos de autenticación
 *
 *       Requiere confirmación de contraseña.
 *       ES: Cumplimiento con regulaciones GDPR.
 *       EN: GDPR compliance - right to be forgotten.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: Contraseña para confirmar la eliminación
 *     responses:
 *       200:
 *         description: Datos eliminados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     dataDeleted:
 *                       type: boolean
 *                     deletedItems:
 *                       type: object
 *                       properties:
 *                         appointments:
 *                           type: number
 *                         sessions:
 *                           type: number
 *       400:
 *         description: Contraseña incorrecta o datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       429:
 *         description: Demasiados intentos
 */
router.delete(
  '/delete-data',
  protect,
  strictLimiter,
  [
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required to delete user data')
  ],
  validateRequest,
  deleteAllUserData
);

export default router;
