import express from 'express';
import { db } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/environment/current
router.get('/current', authenticateToken, (req, res) => {
  const environment = db.get('environmentalReading');
  res.json({ environment });
});

// GET /api/environment/history
router.get('/history', authenticateToken, (req, res) => {
  const current = db.get('environmentalReading');
  const history = [
    { time: '06:00', temp: 28, humidity: 65, aqi: 90, uv: 2 },
    { time: '09:00', temp: 32, humidity: 68, aqi: 115, uv: 5 },
    { time: '12:00', temp: 36, humidity: 70, aqi: 140, uv: 9 },
    { time: '15:00', temp: current.outsideTemp, humidity: current.humidity, aqi: current.aqi, uv: current.uvIndex },
    { time: '18:00', temp: 34, humidity: 74, aqi: 130, uv: 4 },
    { time: '21:00', temp: 30, humidity: 76, aqi: 105, uv: 0 },
  ];
  res.json({ history });
});

export default router;
