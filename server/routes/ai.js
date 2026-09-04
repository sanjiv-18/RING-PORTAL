import express from 'express';
import { db } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/ai/risk
router.get('/risk', authenticateToken, (req, res) => {
  const riskAssessment = db.get('riskAssessment');
  res.json({
    disclaimer: 'Prototype AI Risk Assessment — Not a Medical Diagnosis',
    assessment: riskAssessment
  });
});

// POST /api/ai/analyze
router.post('/analyze', authenticateToken, (req, res) => {
  const vitals = db.get('healthReading');
  const env = db.get('environmentalReading');

  // Dynamic Rule-based AI Risk Engine
  let heatStress = Math.min(100, Math.round(((env.outsideTemp - 30) * 4) + ((vitals.heartRate - 75) * 1.2) + ((100 - vitals.hydration) * 0.5)));
  heatStress = Math.max(10, heatStress);

  let respiratory = Math.min(100, Math.round((env.aqi / 250) * 100));
  let dehydration = Math.min(100, Math.round((100 - vitals.hydration) + (env.outsideTemp > 35 ? 15 : 0)));
  let fatigue = Math.min(100, Math.round((vitals.activity / 10000) * 40 + (vitals.heartRate > 95 ? 30 : 10)));
  let cardiac = Math.min(100, Math.round(vitals.heartRate > 100 ? 45 : 15));

  const overallScore = Math.max(heatStress, respiratory, dehydration);
  let riskLevel = 'LOW RISK';
  if (overallScore > 80) riskLevel = 'HIGH RISK';
  else if (overallScore > 50) riskLevel = 'MODERATE RISK';

  let whyText = 'Normal baseline vitals and environmental metrics observed.';
  if (overallScore > 80) {
    whyText = `CRITICAL: High temperature (${env.outsideTemp}°C) + Elevated Heart Rate (${vitals.heartRate} BPM) + Low Hydration (${vitals.hydration}%) detected.`;
  } else if (overallScore > 50) {
    whyText = `High temperature (${env.outsideTemp}°C) + elevated heart rate (${vitals.heartRate} BPM) + increased activity detected.`;
  }

  const newAssessment = {
    overallScore,
    riskLevel,
    heatStress,
    dehydration,
    fatigue,
    respiratory,
    cardiac,
    whyText,
    contributingFactors: [
      `Heart rate at ${vitals.heartRate} BPM`,
      `Outside temperature at ${env.outsideTemp}°C`,
      `Ambient humidity at ${env.humidity}%`,
      `Hydration status at ${vitals.hydration}%`,
      `Air Quality Index at ${env.aqi} AQI`
    ],
    recommendedActions: [
      { id: 'rec_1', action: 'Hydrate', text: 'Drink 500ml water immediately', icon: 'Droplets' },
      { id: 'rec_2', action: 'Move to Cooler Area', text: 'Seek air-conditioned shelter', icon: 'Thermometer' },
      { id: 'rec_3', action: 'Rest', text: 'Rest for 15 minutes in shade', icon: 'Moon' }
    ]
  };

  db.set('riskAssessment', newAssessment);

  res.json({
    disclaimer: 'Prototype AI Risk Assessment — Not a Medical Diagnosis',
    assessment: newAssessment
  });
});

export default router;
