/**
 * Therapist Routes
 */

import express from 'express';
import {
  createTherapist,
  deleteTherapist,
  getTherapist,
  getTherapistAvailability,
  getTherapistsByClinic,
  updateTherapist,
  updateTherapistAvailability,
} from '../controllers/therapistController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * POST /api/v1/therapists
 * Crear terapeuta
 */
router.post('/', verifyToken, createTherapist);

/**
 * GET /api/v1/therapists/:id
 * Obtener terapeuta
 */
router.get('/:id', verifyToken, getTherapist);

/**
 * GET /api/v1/clinics/:clinicId/therapists
 * Listar terapeutas por clínica
 */
router.get('/clinic/:clinicId', verifyToken, getTherapistsByClinic);

/**
 * PUT /api/v1/therapists/:id
 * Actualizar terapeuta
 */
router.put('/:id', verifyToken, updateTherapist);

/**
 * DELETE /api/v1/therapists/:id
 * Eliminar terapeuta
 */
router.delete('/:id', verifyToken, deleteTherapist);

/**
 * GET /api/v1/therapists/:id/availability
 * Obtener disponibilidad
 */
router.get('/:id/availability', verifyToken, getTherapistAvailability);

/**
 * PUT /api/v1/therapists/:id/availability
 * Actualizar disponibilidad
 */
router.put('/:id/availability', verifyToken, updateTherapistAvailability);

export default router;
