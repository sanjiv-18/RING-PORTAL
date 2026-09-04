import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectMongo } from './db.js';

// Route imports
import authRoutes from './routes/auth.js';
import healthRoutes from './routes/health.js';
import environmentRoutes from './routes/environment.js';
import aiRoutes from './routes/ai.js';
import alertRoutes from './routes/alerts.js';
import recommendationRoutes from './routes/recommendations.js';
import profileRoutes from './routes/profile.js';
import doctorRoutes from './routes/doctor.js';
import adminRoutes from './routes/admin.js';
import emergencyRoutes from './routes/emergency.js';
import simulationRoutes from './routes/simulation.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.originalUrl} (${new Date().toLocaleTimeString()})`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/environment', environmentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/simulation', simulationRoutes);

// Health check endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'Operational',
    server: 'HealthGuard AI REST API Engine',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Global 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint Not Found', path: req.originalUrl });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start Server
connectMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 HEALTHGUARD AI Backend Server listening on http://localhost:${PORT}`);
  });
});
