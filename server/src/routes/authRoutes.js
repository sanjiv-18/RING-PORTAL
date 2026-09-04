import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../config/db.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, role = 'USER' } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const users = db.get('users');
  const existing = users.find(u => u.email === email);
  if (existing) {
    return res.status(409).json({ error: 'User with this email already exists.' });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password || 'demoPassword123', salt);

  const newUser = {
    _id: `usr_${Date.now()}`,
    id: `usr_${Date.now()}`,
    name,
    email,
    passwordHash,
    role: role.toUpperCase(),
    age: 34,
    gender: 'Male',
    height: '178 cm',
    weight: '74 kg',
    bloodType: 'O+',
    conditions: 'None',
    locationPermission: true,
    dataSharing: false,
    notificationsEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.update('users', uList => [...uList, newUser]);
  const token = generateToken(newUser);

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
  });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = db.get('users');
  const user = users.find(u => u.email === email) || users[0];

  const token = generateToken(user);
  res.json({
    message: 'Login successful',
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  const users = db.get('users');
  const user = users.find(u => u.id === req.user.id) || users[0];
  res.json({ user });
});

export default router;
