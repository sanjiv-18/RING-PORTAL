import express from 'express';
import { db } from '../config/db.js';
import { calculateAiRisk } from '../services/aiRiskService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/ai/risk
router.get('/risk', authenticateToken, (req, res) => {
  const assessment = db.get('risk_assessments');
  res.json({
    disclaimer: 'Prototype AI Risk Assessment — Not a Medical Diagnosis',
    assessment
  });
});

// POST /api/ai/analyze
router.post('/analyze', authenticateToken, (req, res) => {
  const vitals = db.get('health_readings');
  const env = db.get('environmental_readings');
  const baseline = db.get('health_baselines');

  const assessment = calculateAiRisk(vitals, env, baseline);
  db.set('risk_assessments', assessment);

  res.json({
    disclaimer: 'Prototype AI Risk Assessment — Not a Medical Diagnosis',
    assessment
  });
});

export default router;
