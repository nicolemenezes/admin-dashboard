import Subscription from '../models/Subscription.js';

// GET /api/subscriptions/:userId
export const getSubscriptionByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const sub = await Subscription.findOne({ user: userId });
    if (!sub) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }
    res.status(200).json({ success: true, data: sub });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch subscription', error: error.message });
  }
};

// PUT /api/subscriptions/:userId (upsert)
export const upsertSubscriptionByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { planName, planPrice, purchasedHours, usedHours, nextBillingDate, features } = req.body;

    const sub = await Subscription.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          planName,
          planPrice,
          purchasedHours,
          usedHours,
          nextBillingDate,
          features,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, data: sub });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update subscription', error: error.message });
  }
};