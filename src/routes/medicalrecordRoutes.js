/**
 * Medical Record Routes
 */

import express from 'express';
import {
  createMedicalRecord,
  getMedicalRecord,
  getPatientMedicalRecords,
  updateMedicalRecord,
  deleteMedicalRecord,
  getClinicMedicalRecords
} from '../controllers/medicalrecordController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createMedicalRecord);
router.get('/:id', verifyToken, getMedicalRecord);
router.get('/patient/:patientId', verifyToken, getPatientMedicalRecords);
router.put('/:id', verifyToken, updateMedicalRecord);
router.delete('/:id', verifyToken, deleteMedicalRecord);
router.get('/clinic/:clinicId', verifyToken, getClinicMedicalRecords);

export default router;
