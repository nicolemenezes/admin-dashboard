import express from 'express';
import {
  getStats,
  getSummary,
  calculateStats
} from '../controllers/dashboardController.js';

const router = express.Router();

// TEMP: auth removed for testing
router.get('/stats', getStats);
router.get('/summary', getSummary);
router.post('/calculate-stats', calculateStats);

export default router;
