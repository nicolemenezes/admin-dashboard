import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import authorize, { isOwnerOrAdmin } from '../middleware/roleMiddleware.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

/**
 * GET /api/users
 * Admin only – get all users
 */
router.get(
  "/",
  protect,
  authorize('admin'),
  userController.getAllUsers
);

/**
 * GET /api/users/:id
 * Get user by ID
 */
router.get(
  "/:id",
  protect,
  isOwnerOrAdmin,
  userController.getUserById
);

/**
 * PUT /api/users/:id
 * Update user
 */
router.put(
  "/:id",
  protect,
  isOwnerOrAdmin,
  userController.updateUser
);

/**
 * DELETE /api/users/:id
 * Admin only – delete user
 */
router.delete(
  "/:id",
  protect,
  authorize('admin'),
  userController.deleteUser
);

/**
 * GET /api/users/profile
 * Get user profile
 */
router.get(
  "/profile",
  protect,
  userController.getUserProfile
);

export default router;
