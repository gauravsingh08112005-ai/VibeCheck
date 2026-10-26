// server/src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { roomsRouter } from './modules/rooms/routes.js';
import { checkinsRouter } from './modules/checkins/routes.js';
import { vibeRouter } from './modules/vibe/routes.js';
import { playlistRouter } from './modules/playlist/routes.js';
import { adminRouter } from './modules/admin/routes.js';
import { errorHandler } from './middleware/errorHandler.js';

export const app = express();

// Trust reverse proxy (e.g. Render, Vercel)
app.set('trust proxy', 1);

// Security Headers
app.use(helmet());

// CORS Configuration
const allowedOrigins = env.CORS_ORIGINS.split(',').map((s) => s.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    credentials: true,
  })
);

// Body Parser with payload limit
app.use(express.json({ limit: '15kb' }));

// Rate Limiter: General
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests from this IP, please try again in 15 minutes.',
    },
  },
});
app.use(globalLimiter);

// Public Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'VibeCheck Rooms API',
  });
});

// Mount Routes
app.use('/api/rooms', roomsRouter);
app.use('/api/rooms', vibeRouter);
app.use('/api/rooms', playlistRouter);
app.use('/api/rooms', adminRouter);
app.use('/api', checkinsRouter);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `The requested endpoint ${req.method} ${req.path} was not found.`,
    },
  });
});

// Central Error Handler
app.use(errorHandler);
