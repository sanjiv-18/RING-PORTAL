import express from 'express';
import { db } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/emergency/fall
router.post('/fall', authenticateToken, (req, res) => {
  const newEvent = {
    id: `emg_${Date.now()}`,
    userId: req.user.id || 'usr_sanjiv',
    patientName: req.user.name || 'Sanjiv Venkat',
    type: 'Fall Detected',
    status: 'ACTIVE SOS DISPATCHED',
    timestamp: new Date().toISOString(),
    location: 'Sector 4, Central Urban Hub'
  };

  db.update('emergencyEvents', events => [newEvent, ...events]);

  // Update Sanjiv in Patients roster
  db.update('patients', plist => plist.map(p => p.id === 'PAT-101' ? {
    ...p,
    riskLevel: 'Critical',
    alert: '🚨 EMERGENCY SOS ACTIVE — Fall Detected'
  } : p));

  // Update Admin Stats
  db.update('adminStats', stats => ({
    ...stats,
    sosEvents: stats.sosEvents + 1,
    highRiskUsers: stats.highRiskUsers + 1
  }));

  // Add Notification
  const newAlert = {
    id: `alt_${Date.now()}`,
    category: 'Emergency',
    type: 'critical',
    title: '🚨 FALL DETECTED — SOS DISPATCHED',
    message: 'High-impact accelerometer drop detected. Emergency contacts & 108 Paramedics notified.',
    timestamp: new Date().toISOString()
  };
  db.update('alerts', alist => [newAlert, ...alist]);

  res.status(201).json({
    message: 'Fall emergency event logged and SOS dispatched',
    event: newEvent
  });
});

// POST /api/emergency/sos
router.post('/sos', authenticateToken, (req, res) => {
  const { reason = 'Manual SOS Button Pressed' } = req.body;
  const newEvent = {
    id: `emg_${Date.now()}`,
    userId: req.user.id || 'usr_sanjiv',
    patientName: req.user.name || 'Sanjiv Venkat',
    type: 'Manual SOS',
    status: 'ACTIVE SOS DISPATCHED',
    timestamp: new Date().toISOString(),
    location: 'Sector 4, Central Urban Hub',
    reason
  };

  db.update('emergencyEvents', events => [newEvent, ...events]);

  // Update Sanjiv in Patients roster
  db.update('patients', plist => plist.map(p => p.id === 'PAT-101' ? {
    ...p,
    riskLevel: 'Critical',
    alert: `🚨 EMERGENCY SOS — ${reason}`
  } : p));

  // Update Admin Stats
  db.update('adminStats', stats => ({
    ...stats,
    sosEvents: stats.sosEvents + 1,
    highRiskUsers: stats.highRiskUsers + 1
  }));

  res.status(201).json({
    message: 'Manual SOS dispatched to backend',
    event: newEvent
  });
});

// GET /api/emergency/events
router.get('/events', authenticateToken, (req, res) => {
  const events = db.get('emergencyEvents');
  res.json({ events });
});

export default router;
