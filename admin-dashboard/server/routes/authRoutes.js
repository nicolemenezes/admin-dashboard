import express from 'express';
import { 
  register, 
  login, 
  signin,  // Make sure this is imported
  getMe, 
  logout, 
  refreshToken, 
  listSessions, 
  revokeSession, 
  forgotPassword, 
  resetPassword, 
  check 
} from '../controllers/authController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { registerValidation, loginValidation, changePasswordValidation } from '../utils/validators.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/refresh-token', refreshToken);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/check', optionalAuth, check);

// Add this route for signin
router.post('/signin', signin);

export default router;