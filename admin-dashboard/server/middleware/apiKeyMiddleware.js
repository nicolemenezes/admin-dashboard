import ApiKey from '../models/ApiKey.js';
import { extractApiKey, hashApiKey, isValidApiKeyFormat, getApiKeyPrefix } from '../utils/apiKeyUtils.js';

export const authenticateApiKey = async (req, res, next) => {
  try {
    const apiKey = extractApiKey(req);
    if (!apiKey) {
      return res.status(401).json({ success: false, message: 'No API key provided' });
    }
    if (!isValidApiKeyFormat(apiKey)) {
      return res.status(401).json({ success: false, message: 'Invalid API key format' });
    }

    const prefix = getApiKeyPrefix(apiKey);
    const hashedKey = await hashApiKey(apiKey);

    const apiKeyDoc = await ApiKey.findOne({ prefix, hashedKey, isActive: true }).populate('user', '-password');
    if (!apiKeyDoc?.user?.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid or inactive API key' });
    }

    req.user = apiKeyDoc.user;
    req.apiKey = { id: apiKeyDoc._id, name: apiKeyDoc.name, permissions: apiKeyDoc.permissions };
    req.authMethod = 'api_key';
    next();
  } catch (error) {
    console.error('API Key authentication error:', error);
    return res.status(500).json({ success: false, message: 'Error authenticating API key' });
  }
};

export const requirePermissions = (...requiredPermissions) => {
  return (req, res, next) => {
    if (req.authMethod !== 'api_key') {
      if (req.user?.role === 'admin') return next();
    }
    if (!req.apiKey?.permissions) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }
    if (req.apiKey.permissions.includes('admin')) return next();
    const ok = requiredPermissions.every((p) => req.apiKey.permissions.includes(p));
    if (!ok) {
      return res.status(403).json({
        success: false,
        message: `This API key requires these permissions: ${requiredPermissions.join(', ')}`
      });
    }
    next();
  };
};