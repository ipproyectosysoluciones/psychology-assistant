import express from 'express';
import { createAppointment, getUserAppointments } from '../controllers/appointmentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post( '/create', protect, createAppointment );
router.get( '/my-appointments', protect, getUserAppointments );

export default router;
