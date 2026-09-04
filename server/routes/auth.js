import express from 'express';
import { db } from '../db.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, password, role = 'USER' } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const users = db.get('users');
  const existing = users.find(u => u.email === email);
  if (existing) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    name,
    email,
    role: role.toUpperCase(),
    createdAt: new Date().toISOString()
  };

  db.update('users', uList => [...uList, newUser]);
  const token = generateToken(newUser);

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: newUser
  });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = db.get('users');
  const user = users.find(u => u.email === email) || users[0]; // Fallback to first user for demo convenience

  const token = generateToken(user);
  res.json({
    message: 'Login successful',
    token,
    user
  });
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  const users = db.get('users');
  const user = users.find(u => u.id === req.user.id) || users[0];
  res.json({ user });
});

export default router;
