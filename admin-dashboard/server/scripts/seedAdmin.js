import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import path from 'path';
import User from '../models/User.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function seedAdmin() {
  let exitCode = 0;
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in /server/.env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ 
      email: 'admin@consultancy.com' 
    });
    
    if (existingAdmin) {
      console.log('⚠ Admin user already exists. Deleting old admin...');
      await User.deleteOne({ email: 'admin@consultancy.com' });
      console.log('✓ Old admin user deleted');
    }

    // Hash the password
    console.log('Hashing password: admin123');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    console.log('✓ Password hashed');
    console.log('Hash preview:', hashedPassword.substring(0, 20) + '...');

    // Create new admin user
    const adminUser = new User({
      name: 'Super Admin',
      email: 'admin@consultancy.com',
      password: hashedPassword,
      role: 'admin',
      isFirstLogin: false,
      isActive: true,
    });

    await adminUser.save();
    console.log('✓ Admin user created successfully');
    console.log(`  Email: ${adminUser.email}`);
    console.log(`  Name: ${adminUser.name}`);
    console.log(`  Role: ${adminUser.role}`);
    console.log(`  Password hash stored: ${adminUser.password.substring(0, 20)}...`);
  } catch (error) {
    exitCode = 1;
    console.error('✗ Error seeding admin user:', error.message);
    console.error('Full error:', error);
  } finally {
    await mongoose.connection.close().catch(() => {});
    process.exit(exitCode);
  }
}

seedAdmin();