console.log('📌 Dashboard routes loaded');

import express from 'express';
import { getDashboardStats, getRecentActivity } from '../controllers/dashboardController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// GET /api/dashboard/stats
router.get('/stats', getDashboardStats);

// GET /api/dashboard/activity
router.get('/activity', getRecentActivity);

export default router;
