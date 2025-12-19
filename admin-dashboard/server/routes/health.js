import express from 'express';

const router = express.Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy 🚀',
    timestamp: new Date().toISOString()
  });
});

export default router;
