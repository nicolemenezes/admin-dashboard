import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendInvitationEmail } from '../utils/emailService.js';

// GET /api/users
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, role, isActive } = req.query;
  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const skip = (page - 1) * limit;
  const users = await User.find(query)
    .select('-password')
    .limit(parseInt(limit))
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(query);
  res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// POST /api/users
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, isActive } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('User already exists with this email');
  }
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
    isActive: isActive !== undefined ? isActive : true
  });
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: { user }
  });
});

// DELETE /api/users/:id
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('Cannot delete your own account');
  }
  await user.deleteOne();
  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

// PUT /api/users/:id
export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, isActive, avatar } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  if (avatar !== undefined) user.avatar = avatar;
  await user.save();
  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: { user }
  });
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.status(200).json({ success: true, data: { user } });
});

export const getUserStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const inactiveUsers = await User.countDocuments({ isActive: false });
  const usersByRoleAgg = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]);
  const usersByRole = usersByRoleAgg.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

  res.status(200).json({
    success: true,
    data: { totalUsers, activeUsers, inactiveUsers, newUsers, usersByRole }
  });
});

// POST /api/users/temp-password
export const createUserWithTempPassword = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ success: false, message: 'Name, email, and role are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    const tempPassword = Math.random().toString(36).slice(-10);
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const user = await User.create({
      name,
      email,
      role,
      password: passwordHash,
      status: 'Active',
    });

    const userSafe = user.toObject();
    delete userSafe.password;

    res.status(201).json({ success: true, data: userSafe, tempPassword });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create user', error: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const id = req.user?.id;
    if (!id) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile', error: err.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const id = req.user?.id;
    if (!id) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const allowed = ['fullName', 'bio', 'phone', 'location', 'company', 'projectsCount', 'totalHours'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const user = await User.findByIdAndUpdate(id, { $set: updates }, { new: true }).select('-password');
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update profile', error: err.message });
  }
};

export const inviteUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ success: false, message: 'Name, email, and role are required' });
    }

    if (!['admin', 'consultant'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role. Must be admin or consultant' });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Generate random temporary password
    const tempPassword = crypto.randomBytes(5).toString('hex'); // 10 characters
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      role,
      password: passwordHash,
      status: 'Active',
    });

    // Send invitation email
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const loginUrl = `${frontendUrl}/signin`;

    await sendInvitationEmail({
      to: email,
      name,
      email,
      tempPassword,
      loginUrl,
    });

    const userSafe = user.toObject();
    delete userSafe.password;

    res.status(201).json({ 
      success: true, 
      message: 'User invited successfully. Invitation email sent.',
      data: userSafe 
    });
  } catch (error) {
    console.error('Invite user error:', error);
    res.status(500).json({ success: false, message: 'Failed to invite user', error: error.message });
  }
};