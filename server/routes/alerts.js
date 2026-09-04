import express from 'express';
import { db } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/alerts
router.get('/', authenticateToken, (req, res) => {
  const alerts = db.get('alerts');
  res.json({ alerts });
});

// POST /api/alerts
router.post('/', authenticateToken, (req, res) => {
  const { title, message, type = 'warning', category = 'Health', source = 'Telemetry Sensor' } = req.body;
  const newAlert = {
    id: `alt_${Date.now()}`,
    category,
    type,
    title,
    message,
    status: 'ACTIVE',
    source,
    timestamp: new Date().toISOString()
  };

  db.update('alerts', alist => [newAlert, ...alist]);
  res.status(201).json({ message: 'Alert created successfully', alert: newAlert });
});

// POST /api/alerts/:id/acknowledge
router.post('/:id/acknowledge', authenticateToken, (req, res) => {
  const { id } = req.params;
  let updatedAlert = null;

  db.update('alerts', alist => alist.map(a => {
    if (a.id === id) {
      updatedAlert = { ...a, status: 'ACKNOWLEDGED', acknowledgedAt: new Date().toISOString() };
      return updatedAlert;
    }
    return a;
  }));

  if (!updatedAlert) return res.status(404).json({ error: 'Alert not found' });
  res.json({ message: 'Alert acknowledged', alert: updatedAlert });
});

// POST /api/alerts/:id/resolve
router.post('/:id/resolve', authenticateToken, (req, res) => {
  const { id } = req.params;
  let updatedAlert = null;

  db.update('alerts', alist => alist.map(a => {
    if (a.id === id) {
      updatedAlert = { ...a, status: 'RESOLVED', resolvedAt: new Date().toISOString() };
      return updatedAlert;
    }
    return a;
  }));

  if (!updatedAlert) return res.status(404).json({ error: 'Alert not found' });
  res.json({ message: 'Alert resolved', alert: updatedAlert });
});

export default router;
