import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

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

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.status(200).json({ success: true, data: { user } });
});

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