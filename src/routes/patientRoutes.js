/**
 * Patient Routes
 */

import express from 'express';
import {
  createPatient,
  deletePatient,
  getPatient,
  getPatientMedicalHistory,
  getPatientsByClinic,
  updatePatient,
} from '../controllers/patientController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * POST /api/v1/patients
 * Crear paciente
 */
router.post('/', verifyToken, createPatient);

/**
 * GET /api/v1/patients/:id
 * Obtener paciente
 */
router.get('/:id', verifyToken, getPatient);

/**
 * GET /api/v1/clinics/:clinicId/patients
 * Listar pacientes por clínica
 */
router.get('/clinic/:clinicId', verifyToken, getPatientsByClinic);

/**
 * PUT /api/v1/patients/:id
 * Actualizar paciente
 */
router.put('/:id', verifyToken, updatePatient);

/**
 * DELETE /api/v1/patients/:id
 * Eliminar paciente
 */
router.delete('/:id', verifyToken, deletePatient);

/**
 * GET /api/v1/patients/:id/medical-history
 * Obtener historial médico
 */
router.get('/:id/medical-history', verifyToken, getPatientMedicalHistory);

export default router;
