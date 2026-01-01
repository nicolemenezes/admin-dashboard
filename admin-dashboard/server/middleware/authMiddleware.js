import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/tokenUtils.js';
import { extractApiKey, hashApiKey, isValidApiKeyFormat, getApiKeyPrefix } from '../utils/apiKeyUtils.js';
import User from '../models/User.js';
import ApiKey from '../models/ApiKey.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      console.log('[protect] Token received:', token.substring(0, 20) + '...');

      // Verify token using JWT_ACCESS_SECRET (not JWT_SECRET)
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      console.log('[protect] Token decoded:', decoded);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        console.error('[protect] User not found for token');
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      console.log('[protect] User authenticated:', req.user.email);
      next();
    } catch (error) {
      console.error('[protect] Token verification failed:', error.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    console.error('[protect] No token provided in request');
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
});

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