import asyncHandler from 'express-async-handler';
import ApiKey from '../models/ApiKey.js';
import { generateApiKey, maskApiKey } from '../utils/apiKeyUtils.js';

export const createApiKey = asyncHandler(async (req, res) => {
  const { name, permissions, expiresAt, ipWhitelist, rateLimit } = req.body;
  const keyData = generateApiKey('live');

  const apiKey = await ApiKey.create({
    name,
    prefix: keyData.prefix,
    hashedKey: keyData.hashedKey,
    user: req.user._id,
    permissions: permissions || ['read'],
    expiresAt: expiresAt || null,
    ipWhitelist: ipWhitelist || [],
    rateLimit: rateLimit || { requestsPerHour: 1000, requestsPerDay: 10000 },
    isActive: true
  });

  res.status(201).json({
    success: true,
    message: 'API key created successfully. SAVE THIS KEY - it will not be shown again!',
    data: {
      apiKey: {
        id: apiKey._id,
        name: apiKey.name,
        key: keyData.key,
        prefix: apiKey.prefix,
        permissions: apiKey.permissions,
        expiresAt: apiKey.expiresAt,
        createdAt: apiKey.createdAt
      }
    }
  });
});

export const listApiKeys = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, isActive } = req.query;
  const query = { user: req.user._id };
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const skip = (page - 1) * limit;
  const apiKeys = await ApiKey.find(query)
    .select('-hashedKey')
    .limit(parseInt(limit))
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await ApiKey.countDocuments(query);
  res.status(200).json({
    success: true,
    data: {
      apiKeys: apiKeys.map((key) => ({
        ...key.toObject(),
        maskedKey: maskApiKey(key.prefix)
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

export const getAllApiKeys = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, isActive } = req.query;
  const query = {};
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const skip = (page - 1) * limit;
  const apiKeys = await ApiKey.find(query)
    .populate('user', 'name email')
    .select('-hashedKey')
    .limit(parseInt(limit))
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await ApiKey.countDocuments(query);
  res.status(200).json({
    success: true,
    data: {
      apiKeys,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

export const getApiKeyById = asyncHandler(async (req, res) => {
  const apiKey = await ApiKey.findById(req.params.id)
    .populate('user', 'name email')
    .select('-hashedKey');
  
  if (!apiKey) {
    res.status(404);
    throw new Error('API key not found');
  }

  if (req.user.role !== 'admin' && apiKey.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this API key');
  }

  res.status(200).json({ success: true, data: { apiKey } });
});

export const updateApiKey = asyncHandler(async (req, res) => {
  const { name, permissions, isActive, expiresAt, ipWhitelist, rateLimit } = req.body;
  const apiKey = await ApiKey.findById(req.params.id);

  if (!apiKey) {
    res.status(404);
    throw new Error('API key not found');
  }

  if (req.user.role !== 'admin' && apiKey.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this API key');
  }

  if (name !== undefined) apiKey.name = name;
  if (permissions !== undefined) apiKey.permissions = permissions;
  if (isActive !== undefined) apiKey.isActive = isActive;
  if (expiresAt !== undefined) apiKey.expiresAt = expiresAt;
  if (ipWhitelist !== undefined) apiKey.ipWhitelist = ipWhitelist;
  if (rateLimit !== undefined) apiKey.rateLimit = rateLimit;

  await apiKey.save();
  res.status(200).json({
    success: true,
    message: 'API key updated successfully',
    data: { apiKey }
  });
});

export const deleteApiKey = asyncHandler(async (req, res) => {
  const apiKey = await ApiKey.findById(req.params.id);

  if (!apiKey) {
    res.status(404);
    throw new Error('API key not found');
  }

  if (req.user.role !== 'admin' && apiKey.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this API key');
  }

  await apiKey.deleteOne();
  res.status(200).json({
    success: true,
    message: 'API key deleted successfully'
  });
});

export const revokeApiKey = asyncHandler(async (req, res) => {
  const apiKey = await ApiKey.findById(req.params.id);

  if (!apiKey) {
    res.status(404);
    throw new Error('API key not found');
  }

  if (req.user.role !== 'admin' && apiKey.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to revoke this API key');
  }

  apiKey.isActive = false;
  await apiKey.save();
  res.status(200).json({
    success: true,
    message: 'API key revoked successfully',
    data: { apiKey }
  });
});