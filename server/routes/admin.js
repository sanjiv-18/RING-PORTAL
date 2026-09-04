import express from 'express';
import { db } from '../db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/admin/statistics
router.get('/statistics', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const stats = db.get('adminStats');
  const alerts = db.get('alerts');

  res.json({
    statistics: stats,
    systemServices: [
      { name: 'API Server', status: 'Operational', latency: '12ms' },
      { name: 'Database', status: 'Operational', latency: '4ms' },
      { name: 'AI Risk Engine', status: 'Operational', latency: '28ms' },
      { name: 'Simulation Engine', status: 'Operational', latency: '8ms' },
      { name: 'Notification Service', status: 'Operational', latency: '15ms' }
    ],
    recentEvents: alerts.slice(0, 5)
  });
});

// GET /api/admin/users
router.get('/users', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const users = db.get('users');
  res.json({ users });
});

// GET /api/admin/doctors
router.get('/doctors', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const users = db.get('users').filter(u => u.role === 'DOCTOR');
  res.json({ doctors: users });
});

export default router;
