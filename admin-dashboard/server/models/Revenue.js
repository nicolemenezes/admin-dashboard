import mongoose from 'mongoose';

const revenueSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    source: {
      type: String,
      default: 'unknown'
    }
  },
  {
    timestamps: true // gives createdAt & updatedAt
  }
);

/**
 * ✅ Get total revenue & count
 */
revenueSchema.statics.getTotalRevenue = async function (filter = {}) {
  const result = await this.aggregate([
    {
      $match: filter.createdAt
        ? { createdAt: filter.createdAt }
        : {}
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  return result[0] || { total: 0, count: 0 };
};

/**
 * ✅ Get revenue grouped by source
 */
revenueSchema.statics.getRevenueBySource = async function (start, end) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: '$source',
        total: { $sum: '$amount' }
      }
    }
  ]);
};

const Revenue = mongoose.model('Revenue', revenueSchema);

export default Revenue;
