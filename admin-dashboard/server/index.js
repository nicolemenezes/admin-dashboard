import dotenv from 'dotenv';
// Load env variables only once at the very top
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ API Base: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`✗ Error: ${err.message}`);
  server.close(() => process.exit(1));
});
