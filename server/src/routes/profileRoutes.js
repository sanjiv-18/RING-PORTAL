import express from 'express';
import { db } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/profile
router.get('/', authenticateToken, (req, res) => {
  const users = db.get('users');
  const profile = users.find(u => u.id === (req.user ? req.user.id : 'usr_sanjiv')) || users[0];
  const contacts = db.get('emergency_contacts') || [];
  res.json({ profile, emergencyContacts: contacts });
});

// PUT /api/profile
router.put('/', authenticateToken, (req, res) => {
  const updates = req.body;
  let updatedProfile = null;

  db.update('users', users => users.map(u => {
    if (u.id === (req.user ? req.user.id : 'usr_sanjiv') || u.id === 'usr_sanjiv') {
      updatedProfile = { ...u, ...updates, updatedAt: new Date().toISOString() };
      return updatedProfile;
    }
    return u;
  }));

  res.json({ message: 'Profile updated successfully', profile: updatedProfile });
});

export default router;
