import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    planName: { type: String, default: 'Premium Plan' },
    monthlyPrice: { type: Number, default: 49.99 },
    devHoursAllowed: { type: Number, default: 10, min: 0 },
    devHoursUsed: { type: Number, default: 0, min: 0 },
    nextBillingDate: { type: Date },
    totalSpent: { type: Number, default: 0 }, // optional, can be derived from invoices
    planDetails: {
      dedicatedDevHours: { type: Number, default: 10 },
      advancedAnalytics: { type: Boolean, default: true },
      unlimitedProjects: { type: Boolean, default: true },
      criticalBugResponse: { type: String, default: '24h' },
    },
  },
  { timestamps: true }
);

subscriptionSchema.index({ user: 1 }, { unique: true });

export default mongoose.model('Subscription', subscriptionSchema);