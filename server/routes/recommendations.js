import express from 'express';
import { db } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/recommendations
router.get('/', authenticateToken, (req, res) => {
  const vitals = db.get('healthReading');
  const env = db.get('environmentalReading');

  const recommendations = [
    {
      id: 'rec_hydration',
      category: 'Hydration',
      title: 'Hydration Target',
      text: vitals.hydration < 50
        ? `CRITICAL: Your hydration level is ${vitals.hydration}%. Drink 750ml electrolyte solution immediately due to heat (${env.outsideTemp}°C).`
        : `Your hydration level is ${vitals.hydration}%. Drink 500ml water to offset high ambient temperature (${env.outsideTemp}°C).`,
      target: 'Target: 2.5L / day minimum'
    },
    {
      id: 'rec_rest',
      category: 'Rest',
      title: 'Rest & Recovery',
      text: vitals.heartRate > 95
        ? `Your heart rate (${vitals.heartRate} BPM) and environmental temperature indicate that a short rest period is essential.`
        : `Your activity level (${vitals.activity} steps) is higher than normal. Schedule 15 minutes rest in shade.`,
      target: 'Target: 15-min rest interval'
    },
    {
      id: 'rec_air',
      category: 'Air Quality',
      title: 'Air Quality Protection',
      text: env.aqi > 200
        ? `AQI is currently HAZARDOUS (${env.aqi}). Wear N95 respirator and avoid all outdoor exposure.`
        : `AQI is currently ${env.aqi}. Reduce prolonged outdoor activity.`,
      target: 'Action: Stay indoors'
    },
    {
      id: 'rec_activity',
      category: 'Activity',
      title: 'Daily Activity Guidance',
      text: `You have completed ${Math.round((vitals.activity / 8000) * 100)}% of today's activity goal. Moderate indoor exercise recommended.`,
      target: 'Goal: 8,000 steps daily'
    }
  ];

  res.json({ recommendations });
});

export default router;
