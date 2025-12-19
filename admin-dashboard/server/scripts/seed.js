import mongoose from 'mongoose';
import env from '../config/env.js';
import User from '../models/User.js';
import Revenue from '../models/Revenue.js';
import DashboardStats from '../models/DashboardStats.js';

const seedDatabase = async () => {
  try {
    await mongoose.connect(env.db.uri);
    console.log('✅ MongoDB connected for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Revenue.deleteMany({});
    await DashboardStats.deleteMany({});

    // Seed users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'Admin@123456',
        role: 'admin',
        isActive: true
      },
      {
        name: 'Moderator User',
        email: 'moderator@example.com',
        password: 'Moderator@123456',
        role: 'moderator',
        isActive: true
      },
      {
        name: 'Regular User',
        email: 'user@example.com',
        password: 'User@123456',
        role: 'user',
        isActive: true
      }
    ]);

    console.log(`✅ Seeded ${users.length} users`);

    // Seed revenue
    const revenues = await Revenue.create([
      {
        date: new Date(),
        amount: 1000,
        source: 'subscription',
        category: 'Subscription',
        description: 'Monthly subscription',
        currency: 'USD',
        createdBy: users[0]._id
      },
      {
        date: new Date(),
        amount: 500,
        source: 'one-time',
        category: 'One-time Purchase',
        description: 'Single purchase',
        currency: 'USD',
        createdBy: users[0]._id
      }
    ]);

    console.log(`✅ Seeded ${revenues.length} revenue records`);

    // Seed dashboard stats
    const stats = await DashboardStats.create([
      {
        date: new Date(),
        totalUsers: users.length,
        activeUsers: users.filter((u) => u.isActive).length,
        totalRevenue: revenues.reduce((sum, r) => sum + r.amount, 0),
        newSubscriptions: 1
      }
    ]);

    console.log(`✅ Seeded ${stats.length} dashboard stats`);
    console.log('✅ Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();