console.log('📌 Dashboard routes loaded');

import express from 'express';
import {
  getStats,
  getSummary,
  calculateStats
} from '../controllers/dashboardController.js';

const router = express.Router();

// TEMP: auth removed
router.get('/stats', getStats);
router.get('/summary', getSummary);
router.get('/calculate-stats', calculateStats);

export default router;
