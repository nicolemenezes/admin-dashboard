import mongoose from 'mongoose';
import env from '../config/env.js';

if (!env.db.uri) {
  console.error('❌ MongoDB Connection Error: MONGO_URI is not defined');
  process.exit(1);
}

const connectMongoDB = async () => {
  try {
    await mongoose.connect(env.db.uri);
    console.log('✅ MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
};

export default connectMongoDB;