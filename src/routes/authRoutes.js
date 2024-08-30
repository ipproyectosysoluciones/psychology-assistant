import express from 'express';
import { register, login, enable2FA, verify2FA } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post( '/register', register );
router.post( '/login', login );
router.post( '/enable-2fa', protect, enable2FA );
router.post( '/verify-2fa', protect, verify2FA );

export default router;