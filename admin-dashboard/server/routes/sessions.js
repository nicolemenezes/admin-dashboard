import express from 'express';
import * as authController from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), authController.listSessions);
router.delete('/:id', protect, authorize('admin'), authController.revokeSession);

export default router;
