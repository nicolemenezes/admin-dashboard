import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import connectDB from './config/db.js';
import healthRoutes from './routes/health.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { requestLogger } from './middleware/requestLogger.js';
import { sanitizeBody } from './middleware/validationMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import billingRoutes from './routes/billingRoutes.js';

connectDB();

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

app.use('/api/health', healthRoutes);

app.get('/health', (_req, res) =>
  res.status(200).json({ success: true, message: 'Server is running' })
);

const API_PREFIX = '/api';
app.use(`${API_PREFIX}/projects`, projectRoutes);
app.use(`${API_PREFIX}/subscriptions`, subscriptionRoutes);
app.use(`${API_PREFIX}/billing`, billingRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;