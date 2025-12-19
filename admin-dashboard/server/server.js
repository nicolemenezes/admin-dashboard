import app from './app.js';
import env from './config/env.js';

const PORT = env.port || 5000;
const server = app.listen(PORT, () => {
  console.log(`⚡ Server running in ${env.nodeEnv} on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received: closing HTTP server');
  server.close(() => process.exit(0));
});