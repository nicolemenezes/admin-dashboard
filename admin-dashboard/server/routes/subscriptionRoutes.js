import express from 'express';
import { getSubscriptionByUser, upsertSubscriptionByUser } from '../controllers/subscriptionController.js';

const router = express.Router();

router.get('/:userId', getSubscriptionByUser);
router.put('/:userId', upsertSubscriptionByUser);

export default router;