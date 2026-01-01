import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Revenue from '../models/Revenue.js';

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    console.log('[getDashboardStats] Fetching dashboard statistics...');
    
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalTransactions = await Transaction.countDocuments();
    
    // Get revenue
    const totalRevenue = await Transaction.aggregate([
      { $match: { status: 'completed', type: 'credit' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    
    const revenueAmount = totalRevenue.length > 0 ? totalRevenue[0].total : 0;
    
    // Calculate growth (prevent division by zero)
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });
    
    const previousUsers = totalUsers - lastMonthUsers;
    const userGrowth = previousUsers === 0 
      ? (lastMonthUsers > 0 ? 100 : 0) 
      : ((lastMonthUsers / previousUsers) * 100).toFixed(1);
    
    // Transaction growth
    const lastMonthTransactions = await Transaction.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });
    
    const previousTransactions = totalTransactions - lastMonthTransactions;
    const transactionGrowth = previousTransactions === 0
      ? (lastMonthTransactions > 0 ? 100 : 0)
      : ((lastMonthTransactions / previousTransactions) * 100).toFixed(1);
    
    // Revenue growth
    const lastMonthRevenue = await Transaction.aggregate([
      {
        $match: {
          status: 'completed',
          type: 'credit',
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    
    const recentRevenue = lastMonthRevenue.length > 0 ? lastMonthRevenue[0].total : 0;
    const previousRevenue = revenueAmount - recentRevenue;
    const revenueGrowth = previousRevenue === 0
      ? (recentRevenue > 0 ? 100 : 0)
      : ((recentRevenue / previousRevenue) * 100).toFixed(1);
    
    const stats = [
      {
        title: 'Total Users',
        value: totalUsers.toLocaleString(),
        change: `+${userGrowth}%`,
        trend: 'up',
      },
      {
        title: 'Total Revenue',
        value: `$${revenueAmount.toLocaleString()}`,
        change: `+${revenueGrowth}%`,
        trend: 'up',
      },
      {
        title: 'Transactions',
        value: totalTransactions.toLocaleString(),
        change: `+${transactionGrowth}%`,
        trend: 'up',
      },
      {
        title: 'Active Projects',
        value: '0',
        change: '+0%',
        trend: 'up',
      },
    ];
    
    console.log('[getDashboardStats] Stats calculated:', stats);
    
    res.status(200).json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    console.error('[getDashboardStats] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message,
    });
  }
});

// @desc    Get recent activity
// @route   GET /api/dashboard/activity
// @access  Private
export const getRecentActivity = asyncHandler(async (req, res) => {
  try {
    const recentTransactions = await Transaction.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);
    
    const recentUsers = await User.find()
      .select('name email createdAt')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.status(200).json({
      success: true,
      data: {
        transactions: recentTransactions || [],
        users: recentUsers || [],
      },
    });
  } catch (error) {
    console.error('[getRecentActivity] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activity',
      error: error.message,
    });
  }
});