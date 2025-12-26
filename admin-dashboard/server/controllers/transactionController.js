import Transaction from '../models/Transaction.js';

// GET /api/transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: 1 });
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch transactions', error: error.message });
  }
};

// POST /api/transactions
export const createTransaction = async (req, res) => {
  try {
    const { amount, category, description, source, date } = req.body;

    if (amount == null) {
      return res.status(400).json({ success: false, message: 'amount is required' });
    }

    const tx = await Transaction.create({
      amount,
      category,
      description,
      source,
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json({ success: true, data: tx });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create transaction', error: error.message });
  }
};