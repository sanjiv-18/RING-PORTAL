import { db } from '../config/db.js';
import { validateHealthReading } from '../validators/healthValidator.js';
import { calculateAiRisk } from '../services/aiRiskService.js';

export const getCurrentHealth = (req, res) => {
  const vitals = db.get('health_readings');
  const baseline = db.get('health_baselines');
  res.json({
    vitals,
    baseline,
    lastSync: new Date().toISOString()
  });
};

export const getHealthHistory = (req, res) => {
  const { range = '7_days' } = req.query;
  const current = db.get('health_readings');
  const env = db.get('environmental_readings');

  let history = [];
  if (range === 'today') {
    history = [
      { time: '06:00', heartRate: 70, spO2: 98, temp: 36.5, hydration: 90, aqi: 110, risk: 20 },
      { time: '09:00', heartRate: 76, spO2: 97, temp: 36.7, hydration: 85, aqi: 125, risk: 35 },
      { time: '12:00', heartRate: 92, spO2: 96, temp: 37.1, hydration: 65, aqi: 155, risk: 65 },
      { time: '15:00', heartRate: current.heartRate, spO2: current.spO2, temp: current.temp, hydration: current.hydration, aqi: env.aqi, risk: current.healthScore },
      { time: '18:00', heartRate: Math.max(72, current.heartRate - 8), spO2: 97, temp: 36.9, hydration: 70, aqi: 140, risk: 45 },
      { time: '21:00', heartRate: 74, spO2: 98, temp: 36.6, hydration: 80, aqi: 120, risk: 25 },
    ];
  } else if (range === '30_days') {
    history = [
      { day: 'Week 1', heartRate: 74, spO2: 98, temp: 36.6, activity: 52000, hydration: 82, aqi: 105 },
      { day: 'Week 2', heartRate: 78, spO2: 97, temp: 36.8, activity: 58000, hydration: 75, aqi: 125 },
      { day: 'Week 3', heartRate: current.heartRate, spO2: current.spO2, temp: current.temp, activity: 61000, hydration: current.hydration, aqi: env.aqi },
      { day: 'Week 4', heartRate: 73, spO2: 98, temp: 36.5, activity: 54000, hydration: 86, aqi: 100 },
    ];
  } else {
    // 7 days default
    history = [
      { day: 'Mon', heartRate: 72, spO2: 98, temp: 36.5, sleep: 7.5, activity: 7200, hydration: 85, aqi: 95 },
      { day: 'Tue', heartRate: 75, spO2: 97, temp: 36.6, sleep: 7.2, activity: 8100, hydration: 80, aqi: 110 },
      { day: 'Wed', heartRate: 88, spO2: 96, temp: 37.0, sleep: 6.8, activity: 9400, hydration: 62, aqi: 145 },
      { day: 'Thu', heartRate: current.heartRate, spO2: current.spO2, temp: current.temp, sleep: 7.3, activity: current.activity, hydration: current.hydration, aqi: env.aqi },
      { day: 'Fri', heartRate: 79, spO2: 97, temp: 36.7, sleep: 8.0, activity: 6500, hydration: 78, aqi: 130 },
      { day: 'Sat', heartRate: 73, spO2: 98, temp: 36.5, sleep: 8.5, activity: 5200, hydration: 88, aqi: 105 },
      { day: 'Sun', heartRate: 71, spO2: 99, temp: 36.4, sleep: 8.2, activity: 6100, hydration: 90, aqi: 90 },
    ];
  }

  res.json({ range, history });
};

export const postHealthReading = (req, res) => {
  const newReadings = req.body;
  const validation = validateHealthReading(newReadings);

  if (!validation.isValid) {
    return res.status(400).json({ error: 'Validation Error', details: validation.errors });
  }

  const current = db.get('health_readings');
  const env = db.get('environmental_readings');
  const baseline = db.get('health_baselines');

  const updated = {
    ...current,
    ...newReadings,
    updatedAt: new Date().toISOString()
  };

  // Re-run AI Risk Calculation based on new readings
  const assessment = calculateAiRisk(updated, env, baseline);
  db.set('health_readings', updated);
  db.set('risk_assessments', assessment);

  // Sync to Doctor Patient Roster
  db.update('patients', plist => plist.map(p => p.id === 'PAT-101' ? {
    ...p,
    heartRate: updated.heartRate,
    spO2: updated.spO2,
    temp: updated.temp,
    hydration: updated.hydration,
    healthScore: updated.healthScore,
    riskLevel: assessment.riskLevel === 'HIGH RISK' ? 'High' : assessment.riskLevel === 'MODERATE RISK' ? 'Moderate' : 'Low'
  } : p));

  // Log Audit Entry
  db.update('audit_logs', logs => [
    {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: req.user ? req.user.id : 'usr_sanjiv',
      action: 'Health reading ingested & AI risk re-evaluated',
      details: `HR: ${updated.heartRate} BPM, Temp: ${updated.temp}°C, Risk: ${assessment.overallScore}/100`
    },
    ...logs
  ]);

  res.json({
    message: 'Health reading successfully processed and evaluated',
    vitals: updated,
    riskAssessment: assessment
  });
};
