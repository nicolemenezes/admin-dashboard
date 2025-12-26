import express from 'express';
import { getTransactions, createTransaction } from '../controllers/transactionController.js';

const router = express.Router();

// GET /api/transactions - list all transactions
router.get('/', getTransactions);

// POST /api/transactions - create a new transaction
router.post('/', createTransaction);

export default router;