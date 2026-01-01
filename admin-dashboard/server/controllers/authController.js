import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// Add the check function that's being imported in authRoutes
export const check = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Auth route is working' });
});

// Add any other missing exports that authRoutes.js is importing
export const register = asyncHandler(async (req, res) => {
  // Your existing register logic or placeholder
  res.status(501).json({ message: 'Register not implemented yet' });
});

export const login = asyncHandler(async (req, res) => {
  // Your existing login logic or placeholder
  res.status(501).json({ message: 'Login not implemented yet' });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ user: req.user });
});

export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

export const refreshToken = asyncHandler(async (req, res) => {
  res.status(501).json({ message: 'Refresh token not implemented yet' });
});

export const listSessions = asyncHandler(async (req, res) => {
  res.status(501).json({ message: 'List sessions not implemented yet' });
});

export const revokeSession = asyncHandler(async (req, res) => {
  res.status(501).json({ message: 'Revoke session not implemented yet' });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  res.status(501).json({ message: 'Forgot password not implemented yet' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  res.status(501).json({ message: 'Reset password not implemented yet' });
});

export const signin = async (req, res, next) => {
  try {
    console.log('\n=== SIGNIN DEBUG START ===');
    console.log('[signin] Full req.body:', JSON.stringify(req.body, null, 2));
    
    const { email, password } = req.body;
    
    console.log('[signin] Extracted email:', email);
    console.log('[signin] Extracted password:', password ? `${password.length} chars` : 'undefined');
    
    if (!email || !password) {
      console.log('[signin] Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Try exact email match (case-sensitive)
    console.log('[signin] Searching for user with email:', email.trim());
    let user = await User.findOne({ email: email.trim() }).select('+password');
    console.log('[signin] Exact match result:', user ? 'FOUND' : 'NOT FOUND');

    if (!user) {
      console.log('[signin] Trying lowercase email...');
      const normalizedEmail = email.trim().toLowerCase();
      user = await User.findOne({ email: normalizedEmail }).select('+password');
      console.log('[signin] Lowercase match result:', user ? 'FOUND' : 'NOT FOUND');
    }

    if (user) {
      console.log('[signin] User details:');
      console.log('  - ID:', user._id);
      console.log('  - Email:', user.email);
      console.log('  - Name:', user.name);
      console.log('  - Role:', user.role);
      console.log('  - Has password:', !!user.password);
    }

    if (!user) {
      console.log('[signin] FAILED: No user found');
      console.log('=== SIGNIN DEBUG END ===\n');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.password) {
      console.log('[signin] FATAL: User exists but has no password!');
      console.log('=== SIGNIN DEBUG END ===\n');
      return res.status(500).json({ message: 'Account configuration error' });
    }

    console.log('[signin] Comparing passwords...');
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('[signin] bcrypt.compare result:', isMatch);

    if (!isMatch) {
      console.log('[signin] FAILED: Password mismatch');
      console.log('=== SIGNIN DEBUG END ===\n');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('[signin] SUCCESS: Password matched!');

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    // Use JWT_ACCESS_SECRET (not JWT_SECRET)
    const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '7d' });
    console.log('[signin] Token generated successfully');
    console.log('[signin] Token preview:', token.substring(0, 30) + '...');
    console.log('=== SIGNIN DEBUG END ===\n');

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('[signin] EXCEPTION:', err);
    console.log('=== SIGNIN DEBUG END ===\n');
    next(err);
  }
};