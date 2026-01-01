import express from 'express';
import cors from 'cors';
// Don't load dotenv here - it's already loaded in index.js
import healthRoutes from './routes/health.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import revenueRoutes from './routes/revenueRoutes.js';
import apiKeyRoutes from './routes/apiKeyRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { requestLogger } from './middleware/requestLogger.js';
import { sanitizeBody } from './middleware/validationMiddleware.js';

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeBody);
app.use(requestLogger);

// Root route
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin Dashboard API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      auth: '/api/signin, /api/register',
      dashboard: '/api/dashboard/stats',
    }
  });
});

// Health check routes
app.use('/api/health', healthRoutes);
app.get('/health', (_req, res) =>
  res.status(200).json({ success: true, message: 'Server is running' })
);

// API Routes with /api prefix
const API_PREFIX = '/api';
app.use(`${API_PREFIX}`, authRoutes); // /api/signin, /api/register, etc.
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/projects`, projectRoutes);
app.use(`${API_PREFIX}/subscriptions`, subscriptionRoutes);
app.use(`${API_PREFIX}/billing`, billingRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);
app.use(`${API_PREFIX}/transactions`, transactionRoutes);
app.use(`${API_PREFIX}/revenue`, revenueRoutes);
app.use(`${API_PREFIX}/api-keys`, apiKeyRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;