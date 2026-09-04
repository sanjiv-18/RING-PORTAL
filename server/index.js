import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase, getDbStatus } from './src/config/db.js';
import { errorHandler } from './src/middleware/errorHandler.js';

// Route imports
import authRoutes from './src/routes/authRoutes.js';
import healthRoutes from './src/routes/healthRoutes.js';
import environmentRoutes from './src/routes/environmentRoutes.js';
import aiRoutes from './src/routes/aiRoutes.js';
import alertRoutes from './src/routes/alertRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
import profileRoutes from './src/routes/profileRoutes.js';
import recommendationRoutes from './src/routes/recommendationRoutes.js';
import doctorRoutes from './src/routes/doctorRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import emergencyRoutes from './src/routes/emergencyRoutes.js';
import simulationRoutes from './src/routes/simulationRoutes.js';
import deviceRoutes from './src/routes/deviceRoutes.js';
import wearableRoutes from './src/routes/wearableRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[HEALTHGUARD API] ${req.method} ${req.originalUrl} (${new Date().toLocaleTimeString()})`);
  next();
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/environment', environmentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/simulation', simulationRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/wearables', wearableRoutes);

// Health check endpoint with DB mode & latency
app.get('/api/status', (req, res) => {
  const dbStatus = getDbStatus();
  res.json({
    status: 'Operational',
    server: 'HealthGuard AI Enterprise REST Engine',
    uptime: process.uptime(),
    dbStatus,
    timestamp: new Date().toISOString()
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint Not Found', path: req.originalUrl });
});

// Global Error Handler
app.use(errorHandler);

// Initialize DB
connectDatabase();

// Only listen directly if not running on Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 HEALTHGUARD AI Enterprise Server listening on http://localhost:${PORT}`);
  });
}

export default app;
