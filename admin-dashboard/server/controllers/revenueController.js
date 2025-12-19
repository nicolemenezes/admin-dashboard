import asyncHandler from 'express-async-handler';
import Revenue from '../models/Revenue.js';

export const getAllRevenue = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, source, startDate, endDate, category } = req.query;
  const query = {};
  if (source) query.source = source;
  if (category) query.category = { $regex: category, $options: 'i' };
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;
  const revenue = await Revenue.find(query)
    .populate('createdBy', 'name email')
    .limit(parseInt(limit))
    .skip(skip)
    .sort({ date: -1 });

  const total = await Revenue.countDocuments(query);
  res.status(200).json({
    success: true,
    data: {
      revenue,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

export const getRevenueById = asyncHandler(async (req, res) => {
  const revenue = await Revenue.findById(req.params.id).populate('createdBy', 'name email');
  if (!revenue) {
    res.status(404);
    throw new Error('Revenue record not found');
  }
  res.status(200).json({ success: true, data: { revenue } });
});

export const createRevenue = asyncHandler(async (req, res) => {
  const { date, amount, source, category, description, currency, metadata } = req.body;
  const revenue = await Revenue.create({
    date,
    amount,
    source,
    category,
    description,
    currency: currency || 'USD',
    metadata: metadata || {},
    createdBy: req.user._id
  });
  res.status(201).json({
    success: true,
    message: 'Revenue record created successfully',
    data: { revenue }
  });
});

export const updateRevenue = asyncHandler(async (req, res) => {
  const { date, amount, source, category, description, currency, metadata } = req.body;
  const revenue = await Revenue.findById(req.params.id);
  if (!revenue) {
    res.status(404);
    throw new Error('Revenue record not found');
  }
  if (date !== undefined) revenue.date = date;
  if (amount !== undefined) revenue.amount = amount;
  if (source !== undefined) revenue.source = source;
  if (category !== undefined) revenue.category = category;
  if (description !== undefined) revenue.description = description;
  if (currency !== undefined) revenue.currency = currency;
  if (metadata !== undefined) revenue.metadata = metadata;
  await revenue.save();
  res.status(200).json({
    success: true,
    message: 'Revenue record updated successfully',
    data: { revenue }
  });
});

export const deleteRevenue = asyncHandler(async (req, res) => {
  const revenue = await Revenue.findById(req.params.id);
  if (!revenue) {
    res.status(404);
    throw new Error('Revenue record not found');
  }
  await revenue.deleteOne();
  res.status(200).json({
    success: true,
    message: 'Revenue record deleted successfully'
  });
});

export const getRevenueAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const dateFilter = {};
  if (startDate || endDate) {
    dateFilter.date = {};
    if (startDate) dateFilter.date.$gte = new Date(startDate);
    if (endDate) dateFilter.date.$lte = new Date(endDate);
  }

  const totalResult = await Revenue.aggregate([
    { $match: dateFilter },
    { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
  ]);

  const bySource = await Revenue.aggregate([
    { $match: dateFilter },
    { $group: { _id: '$source', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $sort: { total: -1 } }
  ]);

  const byCategory = await Revenue.aggregate([
    { $match: dateFilter },
    { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $sort: { total: -1 } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      summary: totalResult[0] || { total: 0, count: 0 },
      bySource,
      byCategory
    }
  });
});