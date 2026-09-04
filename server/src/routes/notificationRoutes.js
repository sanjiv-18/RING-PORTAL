import express from 'express';
import { db } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/notifications
router.get('/', authenticateToken, (req, res) => {
  const notifications = db.get('notifications') || [];
  res.json({
    notifications,
    unreadCount: notifications.filter(n => !n.read).length
  });
});

// POST /api/notifications/:id/read
router.post('/:id/read', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.update('notifications', nlist => nlist.map(n => n.id === id ? { ...n, read: true } : n));
  res.json({ message: 'Notification marked as read' });
});

export default router;
