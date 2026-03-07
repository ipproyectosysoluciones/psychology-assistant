/**
 * Clinic Routes
 */

import express from 'express';
import {
  createClinic,
  getClinic,
  getClinicsByUser,
  updateClinic,
  deleteClinic,
  addClinicAdmin,
  removeClinicAdmin,
  getAllClinics
} from '../controllers/clinicController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * POST /api/v1/clinics
 * Crear clínica
 */
router.post('/', verifyToken, createClinic);

/**
 * GET /api/v1/clinics/:id
 * Obtener clínica
 */
router.get('/:id', verifyToken, getClinic);

/**
 * GET /api/v1/clinics/user/:userId
 * Obtener clínicas del usuario
 */
router.get('/user/:userId', verifyToken, getClinicsByUser);

/**
 * PUT /api/v1/clinics/:id
 * Actualizar clínica
 */
router.put('/:id', verifyToken, updateClinic);

/**
 * DELETE /api/v1/clinics/:id
 * Eliminar clínica
 */
router.delete('/:id', verifyToken, deleteClinic);

/**
 * POST /api/v1/clinics/:id/admins/:userId
 * Agregar admin
 */
router.post('/:id/admins/:userId', verifyToken, addClinicAdmin);

/**
 * DELETE /api/v1/clinics/:id/admins/:userId
 * Remover admin
 */
router.delete('/:id/admins/:userId', verifyToken, removeClinicAdmin);

/**
 * GET /api/v1/clinics
 * Listar todas las clínicas
 */
router.get('/', verifyToken, getAllClinics);

export default router;
