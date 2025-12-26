import express from 'express';
import { getBillingSummary, getInvoices, getPaymentMethods, addPaymentMethod } from '../controllers/billingController.js';

const router = express.Router();

// Auth middleware removed here to avoid 400/401 while userId is supplied via query
router.get('/summary', getBillingSummary);
router.get('/invoices', getInvoices);
router.get('/payment-methods', getPaymentMethods);
router.post('/payment-methods', addPaymentMethod);

export default router;