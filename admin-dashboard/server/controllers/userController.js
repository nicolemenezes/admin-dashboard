import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { sendInvitationEmail } from '../utils/emailService.js';
import { hashPassword } from '../utils/passwordUtils.js';

// GET /api/users
export const getAllUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select('-password');
  res.status(200).json({ success: true, count: users.length, data: users || [] });
});

// POST /api/users
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, isActive } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User already exists with this email' });
  }
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
    isActive: isActive !== undefined ? isActive : true,
  });
  res.status(201).json({ success: true, message: 'User created successfully', data: { user } });
});

// DELETE /api/users/:id
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
  }
  await user.deleteOne();
  res.status(200).json({ success: true, message: 'User deleted successfully' });
});

// PUT /api/users/:id
export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, isActive, avatar } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  if (avatar !== undefined) user.avatar = avatar;

  await user.save();
  res.status(200).json({ success: true, message: 'User updated successfully', data: { user } });
});

// GET /api/users/me
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.status(200).json({ success: true, data: user });
});

// GET /api/users/stats
export const getUserStats = asyncHandler(async (_req, res) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const inactiveUsers = await User.countDocuments({ isActive: false });
  const usersByRoleAgg = await User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]);
  const usersByRole = usersByRoleAgg.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

  res.status(200).json({
    success: true,
    data: { totalUsers, activeUsers, inactiveUsers, newUsers, usersByRole },
  });
});

// POST /api/users/invite
export const inviteUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ success: false, message: 'Valid email address is required' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User with this email already exists' });
  }

  const tempPassword = Math.random().toString(36).slice(-12);
  const hashedPassword = await hashPassword(tempPassword);

  const newUser = await User.create({
    name: email.split('@')[0],
    email,
    password: hashedPassword,
    role: 'user',
    isInvited: true,
  });

  try {
    await sendInvitationEmail(email, tempPassword, newUser.name);
  } catch (emailError) {
    console.error('[inviteUser] Email send error:', emailError);
  }

  res.status(201).json({
    success: true,
    message: 'Invitation sent successfully',
    data: { _id: newUser._id, email: newUser.email, name: newUser.name },
  });
});

// GET /api/users/:id
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.status(200).json({ success: true, data: user });
});

// POST /api/users/temp-password
export const createUserWithTempPassword = asyncHandler(async (req, res) => {
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

  const user = await User.create({ name, email, role, password: passwordHash, status: 'Active' });
  const userSafe = user.toObject();
  delete userSafe.password;

  res.status(201).json({ success: true, data: userSafe, tempPassword });
});

// PUT /api/users/me
export const updateMyProfile = asyncHandler(async (req, res) => {
  const id = req.user?.id;
  if (!id) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const allowed = ['fullName', 'bio', 'phone', 'location', 'company', 'projectsCount', 'totalHours'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  const user = await User.findByIdAndUpdate(id, { $set: updates }, { new: true }).select('-password');
  res.status(200).json({ success: true, data: user });
});