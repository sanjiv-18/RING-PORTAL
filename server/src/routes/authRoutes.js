import express from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { db, getDbStatus } from '../config/db.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, role = 'USER' } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const isMongo = mongoose.connection.readyState === 1;
  const userRole = role.toUpperCase();

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password || 'User@123456', salt);

    if (isMongo) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(409).json({ error: 'User with this email already exists.' });
      }

      const newUser = await User.create({
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: userRole
      });

      const token = generateToken(newUser);
      return res.status(201).json({
        message: 'User registered successfully in MongoDB',
        token,
        user: { id: newUser._id.toString(), name: newUser.name, email: newUser.email, role: newUser.role }
      });
    } else {
      const users = db.get('users') || [];
      const existing = users.find(u => u.email === email.toLowerCase());
      if (existing) {
        return res.status(409).json({ error: 'User with this email already exists.' });
      }

      const newUser = {
        _id: `usr_${Date.now()}`,
        id: `usr_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: userRole,
        age: 34,
        gender: 'Male',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      db.update('users', uList => [...uList, newUser]);
      const token = generateToken(newUser);

      return res.status(201).json({
        message: 'User registered successfully in persistent JSON store',
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
      });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ error: 'Failed to register user', details: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const isMongo = mongoose.connection.readyState === 1;

  try {
    let user = null;
    if (isMongo) {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    if (!user) {
      const users = db.get('users') || [];
      user = users.find(u => u.email === email.toLowerCase()) || users[0];
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify password if provided
    if (password && user.passwordHash && !user.passwordHash.includes('mock')) {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
    }

    const token = generateToken(user);
    const userId = user._id ? user._id.toString() : (user.id || 'usr_sanjiv');

    res.json({
      message: 'Authentication successful',
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role || 'USER',
        age: user.age,
        gender: user.gender
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  const isMongo = mongoose.connection.readyState === 1;
  try {
    let user = null;
    if (isMongo && req.user?.id && req.user.id.length === 24) {
      user = await User.findById(req.user.id).select('-passwordHash');
    }

    if (!user) {
      const users = db.get('users') || [];
      user = users.find(u => u.id === req.user?.id || u._id === req.user?.id) || users[0];
    }

    res.json({ user, dbStatus: getDbStatus() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
