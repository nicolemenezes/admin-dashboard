import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Session from '../models/Session.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  extractTokenFromHeader
} from '../utils/tokenUtils.js';
import { sendWelcomeEmail } from '../utils/emailService.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';

/**
 * @desc    Register new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user' // Default to 'user', only admin can create admin users
  });

  // Send welcome email
  await sendWelcomeEmail(user.email, user.name);

  // Generate token
  const token = signAccessToken({
    id: user._id,
    email: user.email,
    role: user.role
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      token
    }
  });
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Check if user is active
  if (!user.isActive) {
    res.status(401);
    throw new Error('Account is deactivated');
  }

  // Check password
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = signAccessToken({
    id: user._id,
    email: user.email,
    role: user.role
  });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        lastLogin: user.lastLogin
      },
      token
    }
  });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  // User is already attached to req by protect middleware
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  });
});

/**
 * @desc    Logout user (client-side token removal)
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh-token
 * @access  Public
 */
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400);
    throw new Error('Refresh token is required');
  }
  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    res.status(401);
    throw new Error('Invalid or expired refresh token');
  }
  const newAccessToken = signAccessToken(user._id);
  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    data: { token: newAccessToken }
  });
});

/**
 * @desc    List user sessions
 * @route   GET /api/v1/auth/sessions
 * @access  Private
 */
const listSessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data: { sessions }
  });
});

/**
 * @desc    Revoke a session
 * @route   DELETE /api/v1/auth/sessions/:id
 * @access  Private
 */
const revokeSession = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) {
    res.status(404);
    throw new Error('Session not found');
  }
  await session.deleteOne();
  res.status(200).json({
    success: true,
    message: 'Session revoked successfully'
  });
});

/**
 * @desc    Request password reset
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = hashResetToken(resetToken);
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  await user.save();
  await sendPasswordResetEmail(user.email, resetToken);
  res.status(200).json({
    success: true,
    message: 'Password reset email sent'
  });
});

/**
 * @desc    Reset password
 * @route   PUT /api/v1/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const user = await User.findOne({
    resetPasswordToken: hashResetToken(req.params.token),
    resetPasswordExpire: { $gt: Date.now() }
  });
  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  res.status(200).json({
    success: true,
    message: 'Password reset successfully'
  });
});

/**
 * @desc    Check if user is authenticated
 * @route   GET /api/v1/auth/check
 * @access  Private
 */
const check = asyncHandler(async (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      data: { user: req.user }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }
});

export {
  register,
  login,
  getMe,
  logout,
  refreshToken,
  listSessions,
  revokeSession,
  forgotPassword,
  resetPassword,
  check
};