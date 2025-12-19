import mongoose from 'mongoose';

const dashboardStatsSchema = new mongoose.Schema({
  totalUsers: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily'
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const DashboardStats = mongoose.model('DashboardStats', dashboardStatsSchema);

export default DashboardStats;
