import asyncHandler from 'express-async-handler';
import Transaction from '../models/Transaction.js';

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
export const getTransactions = asyncHandler(async (req, res) => {
  try {
    console.log('[getTransactions] Fetching transactions...');
    
    const transactions = await Transaction.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);
    
    console.log('[getTransactions] Found transactions:', transactions.length);
    
    // Return empty array if no transactions, don't throw error
    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions || [],
    });
  } catch (error) {
    console.error('[getTransactions] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message,
    });
  }
});

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = asyncHandler(async (req, res) => {
  try {
    console.log('[createTransaction] Creating transaction:', req.body);
    
    const { amount, description, status, type } = req.body;
    
    const transaction = await Transaction.create({
      user: req.user._id,
      amount,
      description,
      status: status || 'pending',
      type: type || 'credit',
    });
    
    console.log('[createTransaction] Transaction created:', transaction._id);
    
    res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error('[createTransaction] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create transaction',
      error: error.message,
    });
  }
});

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
export const getTransaction = asyncHandler(async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('user', 'name email');
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error('[getTransaction] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction',
      error: error.message,
    });
  }
});

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = asyncHandler(async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error('[updateTransaction] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update transaction',
      error: error.message,
    });
  }
});

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = asyncHandler(async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    console.error('[deleteTransaction] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete transaction',
      error: error.message,
    });
  }
});