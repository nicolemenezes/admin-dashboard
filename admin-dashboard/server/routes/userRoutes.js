import express from 'express';
import {
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
  getMyProfile,
  updateMyProfile,
  inviteUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.delete('/:id', deleteUser);
router.put('/:id', updateUser);

// Profile routes
router.get('/profile', protect, getMyProfile);
router.put('/profile', protect, updateMyProfile);

// Admin-only invitation route
router.post('/invite', protect, isAdmin, inviteUser);

export default router;