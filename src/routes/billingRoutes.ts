/**
 * Billing Routes
 */

import express from 'express';
import {
  createBilling,
  getBilling,
  getPatientBillings,
  updateBilling,
  markBillingAsPaid,
  deleteBilling,
  getClinicBillings,
} from '../controllers/billingController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createBilling);
router.get('/:id', verifyToken, getBilling);
router.get('/patient/:patientId', verifyToken, getPatientBillings);
router.put('/:id', verifyToken, updateBilling);
router.post('/:id/pay', verifyToken, markBillingAsPaid);
router.delete('/:id', verifyToken, deleteBilling);
router.get('/clinic/:clinicId', verifyToken, getClinicBillings);

export default router;
