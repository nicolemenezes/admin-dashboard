import express from 'express';
import * as userController from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

// Protected routes
router.use(authMiddleware);

// Get all users (admin only)
router.get('/', isAdmin, userController.getAllUsers);

// Get current user
router.get('/me', userController.getCurrentUser);

// Invite user endpoint
router.post('/invite', isAdmin, userController.inviteUser);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user
router.put('/:id', userController.updateUser);

// Delete user (admin only)
router.delete('/:id', isAdmin, userController.deleteUser);

export default router;