import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import * as revenueController from '../controllers/revenueController.js';

const router = express.Router();
router.get('/', protect, authorize('admin', 'moderator'), revenueController.getAllRevenue);
router.post('/', protect, authorize('admin', 'moderator'), revenueController.createRevenue);
router.get('/:id', protect, authorize('admin', 'moderator'), revenueController.getRevenueById);
router.put('/:id', protect, authorize('admin', 'moderator'), revenueController.updateRevenue);
router.delete('/:id', protect, authorize('admin'), revenueController.deleteRevenue);
export default router;
