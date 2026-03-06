import express from 'express';
import { body, param, query } from 'express-validator';
import {
  createAppointment,
  deleteAppointment,
  getAppointmentById,
  getUserAppointments,
  updateAppointment,
} from '../controllers/appointmentController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../utils/validators.js';

const router = express.Router();

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Crear nueva cita
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - description
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de la cita
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 500
 *                 description: Descripción de la cita
 *     responses:
 *       200:
 *         description: Cita creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post(
  '/',
  protect,
  [
    body('date')
      .isISO8601()
      .withMessage('Date must be a valid ISO 8601 date')
      .custom((value) => {
        if (new Date(value) <= new Date()) {
          throw new Error('Appointment date must be in the future');
        }
        return true;
      }),
    body('description')
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('Description must be between 10 and 500 characters'),
  ],
  validateRequest,
  createAppointment,
);

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Obtener citas del usuario
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, confirmed, in-progress, completed, cancelled]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de citas obtenida exitosamente
 *       401:
 *         description: No autorizado
 */
router.get(
  '/',
  protect,
  [
    query('status')
      .optional()
      .isIn(['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled'])
      .withMessage('Invalid status'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ],
  validateRequest,
  getUserAppointments,
);

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Obtener cita por ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cita obtenida exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Cita no encontrada
 */
router.get(
  '/:id',
  protect,
  [param('id').isMongoId().withMessage('Invalid appointment ID')],
  validateRequest,
  getAppointmentById,
);

/**
 * @swagger
 * /api/appointments/{id}:
 *   put:
 *     summary: Actualizar cita
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 500
 *               status:
 *                 type: string
 *                 enum: [scheduled, confirmed, in-progress, completed, cancelled]
 *     responses:
 *       200:
 *         description: Cita actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Cita no encontrada
 */
router.put(
  '/:id',
  protect,
  [
    param('id').isMongoId().withMessage('Invalid appointment ID'),
    body('date')
      .optional()
      .isISO8601()
      .withMessage('Date must be a valid ISO 8601 date'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('Description must be between 10 and 500 characters'),
    body('status')
      .optional()
      .isIn(['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled'])
      .withMessage('Invalid status'),
  ],
  validateRequest,
  updateAppointment,
);

/**
 * @swagger
 * /api/appointments/{id}:
 *   delete:
 *     summary: Eliminar cita
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cita eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Cita no encontrada
 */
router.delete(
  '/:id',
  protect,
  [param('id').isMongoId().withMessage('Invalid appointment ID')],
  validateRequest,
  deleteAppointment,
);

export default router;
