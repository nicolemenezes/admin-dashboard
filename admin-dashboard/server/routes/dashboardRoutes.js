console.log('📌 Dashboard routes loaded');

import express from 'express';
import {
  getStats,
  getRecentActivity
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All dashboard routes require authentication
router.use(protect);

router.get('/stats', getStats);
router.get('/activity', getRecentActivity);

export default router;
