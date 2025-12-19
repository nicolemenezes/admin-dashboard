import express from 'express';
import * as authController from '../controllers/authController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { registerValidation, loginValidation, changePasswordValidation } from '../utils/validators.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.get('/check', optionalAuth, authController.check);

export default router;