import asyncHandler from 'express-async-handler';
import DashboardStats from '../models/DashboardStats.js';
import User from '../models/User.js';
import Revenue from '../models/Revenue.js';

/**
 * @desc    Get dashboard overview
 * @route   GET /api/v1/dashboard/overview
 * @access  Private/Admin
 */
const getDashboardOverview = asyncHandler(async (req, res) => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // Total users
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  
  // New users in last 30 days
  const newUsers = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo }
  });
  
  // Calculate growth percentage
  const previousPeriodStart = new Date(thirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000);
  const previousNewUsers = await User.countDocuments({
    createdAt: { $gte: previousPeriodStart, $lt: thirtyDaysAgo }
  });
  const userGrowth = previousNewUsers > 0 
    ? ((newUsers - previousNewUsers) / previousNewUsers * 100).toFixed(2)
    : 100;
  
  // Total revenue
  const revenueResult = await Revenue.getTotalRevenue({
    date: { $gte: thirtyDaysAgo }
  });
  const totalRevenue = revenueResult.total;
  
  // Previous period revenue for growth calculation
  const previousRevenueResult = await Revenue.getTotalRevenue({
    date: { $gte: previousPeriodStart, $lt: thirtyDaysAgo }
  });
  const revenueGrowth = previousRevenueResult.total > 0
    ? ((totalRevenue - previousRevenueResult.total) / previousRevenueResult.total * 100).toFixed(2)
    : 100;
  
  res.status(200).json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        active: activeUsers,
        new: newUsers,
        growth: parseFloat(userGrowth)
      },
      revenue: {
        total: totalRevenue,
        count: revenueResult.count,
        growth: parseFloat(revenueGrowth)
      },
      period: {
        start: thirtyDaysAgo,
        end: today
      }
    }
  });
});

/**
 * @desc    Get recent activities
 * @route   GET /api/v1/dashboard/activities
 * @access  Private/Admin
 */
const getRecentActivities = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  
  // Get recent users
  const recentUsers = await User.find()
    .select('name email createdAt')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));
  
  // Get recent revenue
  const recentRevenue = await Revenue.find()
    .select('amount source category date createdBy')
    .populate('createdBy', 'name email')
    .sort({ date: -1 })
    .limit(parseInt(limit));
  
  // Combine and format activities
  const activities = [
    ...recentUsers.map(user => ({
      type: 'user_registered',
      description: `New user registered: ${user.name}`,
      timestamp: user.createdAt,
      metadata: { userId: user._id, email: user.email }
    })),
    ...recentRevenue.map(rev => ({
      type: 'revenue_added',
      description: `Revenue added: $${rev.amount} from ${rev.source}`,
      timestamp: rev.date,
      metadata: { 
        revenueId: rev._id, 
        amount: rev.amount,
        source: rev.source,
        createdBy: rev.createdBy?.name
      }
    }))
  ];
  
  // Sort by timestamp
  activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  res.status(200).json({
    success: true,
    data: {
      activities: activities.slice(0, parseInt(limit))
    }
  });
});

/**
 * @desc    Get revenue chart data
 * @route   GET /api/v1/dashboard/revenue-chart
 * @access  Private/Admin
 */
const getRevenueChart = asyncHandler(async (req, res) => {
  const { period = 'month', startDate, endDate } = req.query;
  
  let start, groupBy;
  
  if (startDate && endDate) {
    start = new Date(startDate);
  } else {
    // Default to last 30 days
    start = new Date();
    start.setDate(start.getDate() - 30);
  }
  
  const end = endDate ? new Date(endDate) : new Date();
  
  // Determine grouping based on period
  switch (period) {
    case 'day':
      groupBy = {
        year: { $year: '$date' },
        month: { $month: '$date' },
        day: { $dayOfMonth: '$date' }
      };
      break;
    case 'week':
      groupBy = {
        year: { $year: '$date' },
        week: { $week: '$date' }
      };
      break;
    case 'month':
    default:
      groupBy = {
        year: { $year: '$date' },
        month: { $month: '$date' }
      };
  }
  
  const chartData = await Revenue.aggregate([
    {
      $match: {
        date: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: groupBy,
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      period: {
        start,
        end,
        grouping: period
      },
      chartData
    }
  });
});

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/v1/dashboard/stats
 * @access  Private/Admin
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  const { type = 'daily', limit = 30 } = req.query;
  
  const stats = await DashboardStats.getLatestStats(type, parseInt(limit));
  
  res.status(200).json({
    success: true,
    data: {
      stats,
      type,
      count: stats.length
    }
  });
});

/**
 * @desc    Calculate and save dashboard statistics
 * @route   POST /api/v1/dashboard/calculate-stats
 * @access  Private/Admin
 */
const calculateStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get today's data
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ 
    isActive: true,
    lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
  });
  
  const newUsersToday = await User.countDocuments({
    createdAt: { $gte: today }
  });
  
  const revenueToday = await Revenue.getTotalRevenue({
    date: { $gte: today }
  });
  
  const revenueBySource = await Revenue.getRevenueBySource(today, new Date());
  
  // Create or update today's stats
  const stats = await DashboardStats.findOneAndUpdate(
    { date: today, type: 'daily' },
    {
      date: today,
      type: 'daily',
      metrics: {
        totalUsers,
        activeUsers,
        newUsers: newUsersToday,
        totalRevenue: revenueToday.total,
        totalOrders: revenueToday.count,
        averageOrderValue: revenueToday.count > 0 
          ? revenueToday.total / revenueToday.count 
          : 0,
        conversionRate: 0 // Calculate based on your business logic
      },
      breakdown: {
        revenueBySource: revenueBySource.reduce((acc, curr) => {
          acc.set(curr._id, curr.total);
          return acc;
        }, new Map())
      },
      lastCalculated: new Date()
    },
    { upsert: true, new: true }
  );
  
  res.status(200).json({
    success: true,
    message: 'Statistics calculated successfully',
    data: { stats }
  });
});

export const getStats = async (req, res, next) => {
  try {
    const stats = await DashboardStats.find().sort({ date: -1 }).limit(30);
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};

export const getSummary = async (req, res, next) => {
  try {
    const latest = await DashboardStats.findOne().sort({ date: -1 });
    res.json({ success: true, data: latest });
  } catch (err) {
    next(err);
  }
};

export {
  getDashboardOverview,
  getRecentActivities,
  getRevenueChart,
  getDashboardStats,
  calculateStats
};