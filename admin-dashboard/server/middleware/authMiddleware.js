import { verifyAccessToken, extractTokenFromHeader } from '../utils/tokenUtils.js';
import { extractApiKey, hashApiKey, isValidApiKeyFormat, getApiKeyPrefix } from '../utils/apiKeyUtils.js';
import User from '../models/User.js';
import ApiKey from '../models/ApiKey.js';

export const protect = async (req, res, next) => {
  try {
    const apiKey = extractApiKey(req);
    if (apiKey && isValidApiKeyFormat(apiKey)) {
      const prefix = getApiKeyPrefix(apiKey);
      const hashedKey = await hashApiKey(apiKey);
      const apiKeyDoc = await ApiKey.findOne({ prefix, hashedKey, isActive: true }).populate('user', '-password');
      if (apiKeyDoc?.user?.isActive) {
        req.user = apiKeyDoc.user;
        return next();
      }
      return res.status(401).json({ success: false, message: 'Invalid API Key' });
    }

    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account is deactivated' });
    }
    if (user.changedPasswordAfter?.(decoded.iat)) {
      return res.status(401).json({ success: false, message: 'Password was recently changed. Please login again' });
    }

    req.user = user;
    next();
  } catch (error) {
    const expired = error?.name === 'TokenExpiredError' || error?.message === 'jwt expired';
    if (expired) {
      return res.status(401).json({ success: false, message: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id).select('-password');
      if (user?.isActive && !user.changedPasswordAfter?.(decoded.iat)) {
        req.user = user;
      }
    }
  } catch (e) {}
  next();
};