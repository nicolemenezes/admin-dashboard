import express from 'express';
import {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getUserTransactions
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/isAdmin.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes
router.get('/my-transactions', getUserTransactions);

// Admin routes
router.get('/', admin, getAllTransactions);
router.post('/', createTransaction);
router.get('/:id', getTransactionById);
router.put('/:id', admin, updateTransaction);
router.delete('/:id', admin, deleteTransaction);

export default router;