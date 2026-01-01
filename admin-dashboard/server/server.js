import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import app from './app.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✓ Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ API Base URL: http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`✗ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});