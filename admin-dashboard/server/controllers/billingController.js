import Invoice from '../models/Invoice.js';
import Subscription from '../models/Subscription.js'; // fixed path separator
import PaymentMethod from '../models/PaymentMethod.js';

const getUserId = (req) => req.user?.id || req.query.userId;

export const getBillingSummary = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(200).json({
        success: true,
        data: {
          totalSpentThisYear: 0,
          nextBillingDate: null,
          monthlySubscription: 0,
          subscription: null,
        },
      });
    }

    const sub = await Subscription.findOne({ user: userId });
    const yearStart = new Date(new Date().getFullYear(), 0, 1);

    const totalAgg = await Invoice.aggregate([
      { $match: { user: sub?.user || userId, status: 'Paid', date: { $gte: yearStart } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalSpentThisYear = totalAgg[0]?.total || 0;

    res.status(200).json({
      success: true,
      data: {
        totalSpentThisYear,
        nextBillingDate: sub?.nextBillingDate || null,
        monthlySubscription: sub?.monthlyPrice || 0,
        subscription: sub
          ? {
              planName: sub.planName,
              monthlyPrice: sub.monthlyPrice,
              devHoursAllowed: sub.devHoursAllowed,
              devHoursUsed: sub.devHoursUsed,
              nextBillingDate: sub.nextBillingDate,
            }
          : null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch billing summary', error: error.message });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(200).json({ success: true, data: [] });

    const invoices = await Invoice.find({ user: userId }).sort({ date: -1 });
    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch invoices', error: error.message });
  }
};

export const getPaymentMethods = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(200).json({ success: true, data: [] });

    const cards = await PaymentMethod.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
    res.status(200).json({ success: true, data: cards });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch payment methods', error: error.message });
  }
};

export const addPaymentMethod = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { cardBrand, last4, expiryDate, isDefault } = req.body;
    if (!userId || !cardBrand || !last4 || !expiryDate) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (isDefault) {
      await PaymentMethod.updateMany({ user: userId }, { $set: { isDefault: false } });
    }

    const card = await PaymentMethod.create({ user: userId, cardBrand, last4, expiryDate, isDefault: !!isDefault });
    res.status(201).json({ success: true, data: card });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add payment method', error: error.message });
  }
};