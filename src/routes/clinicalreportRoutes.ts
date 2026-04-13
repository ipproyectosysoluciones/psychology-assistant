/**
 * Clinical Report Routes
 */

import express from 'express';
import {
  createClinicalReport,
  getClinicalReport,
  getPatientClinicalReports,
  updateClinicalReport,
  reviewClinicalReport,
  deleteClinicalReport,
  getClinicClinicalReports,
} from '../controllers/clinicalreportController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createClinicalReport);
router.get('/:id', verifyToken, getClinicalReport);
router.get('/patient/:patientId', verifyToken, getPatientClinicalReports);
router.put('/:id', verifyToken, updateClinicalReport);
router.post('/:id/review', verifyToken, reviewClinicalReport);
router.delete('/:id', verifyToken, deleteClinicalReport);
router.get('/clinic/:clinicId', verifyToken, getClinicClinicalReports);

export default router;
