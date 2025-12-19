import express from 'express';
import * as userController from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import authorize, { isOwnerOrAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), userController.getAllUsers);
router.get('/stats', protect, authorize('admin'), userController.getUserStats);
router.get('/:id', protect, isOwnerOrAdmin, userController.getUserById);
router.put('/:id', protect, isOwnerOrAdmin, userController.updateUser);
router.delete('/:id', protect, authorize('admin'), userController.deleteUser);
router.get('/profile/me', protect, userController.getUserProfile);

export default router;