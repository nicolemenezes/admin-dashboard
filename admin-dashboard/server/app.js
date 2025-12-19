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
import revenueRoutes from './routes/revenueRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import apiKeyRoutes from './routes/apiKeyRoutes.js';
import sessionRoutes from './routes/sessions.js';

connectDB();

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
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
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/revenue`, revenueRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);
app.use(`${API_PREFIX}/api-keys`, apiKeyRoutes);
app.use(`${API_PREFIX}/sessions`, sessionRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;