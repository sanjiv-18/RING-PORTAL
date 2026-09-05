import mongoose from 'mongoose';
import { db } from '../config/db.js';
import { validateHealthReading } from '../validators/healthValidator.js';
import { calculateAiRisk } from '../services/aiRiskService.js';
import HealthReading from '../models/HealthReading.js';
import HealthBaseline from '../models/HealthBaseline.js';
import RiskAssessment from '../models/RiskAssessment.js';
import AuditLog from '../models/AuditLog.js';

export const getCurrentHealth = async (req, res) => {
  const isMongo = mongoose.connection.readyState === 1;
  const userId = req.user?.id || 'usr_sanjiv';

  try {
    let vitals = null;
    let baseline = null;

    if (isMongo) {
      const latestReading = await HealthReading.findOne({ userId }).sort({ createdAt: -1 });
      if (latestReading) {
        vitals = {
          userId: latestReading.userId,
          heartRate: latestReading.heartRate,
          spO2: latestReading.spO2,
          temp: latestReading.temp,
          hydration: latestReading.hydration,
          activity: latestReading.activity,
          sleep: latestReading.sleep,
          healthScore: latestReading.healthScore,
          statusText: latestReading.statusText,
          statusSeverity: latestReading.statusSeverity,
          lastUpdated: latestReading.updatedAt || latestReading.createdAt
        };
      }

      const baselineDoc = await HealthBaseline.findOne({ userId });
      if (baselineDoc) {
        baseline = {
          heartRate: baselineDoc.heartRate,
          spO2: baselineDoc.spO2,
          temp: baselineDoc.temp,
          hydration: baselineDoc.hydration,
          activity: baselineDoc.activity,
          sleep: baselineDoc.sleep
        };
      }
    }

    if (!vitals) {
      vitals = db.get('health_readings');
    }
    if (!baseline) {
      baseline = db.get('health_baselines');
    }

    res.json({
      vitals,
      baseline,
      lastSync: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching current health:', error);
    res.json({
      vitals: db.get('health_readings'),
      baseline: db.get('health_baselines'),
      lastSync: new Date().toISOString()
    });
  }
};

export const getHealthHistory = async (req, res) => {
  const { range = '7_days' } = req.query;
  const isMongo = mongoose.connection.readyState === 1;
  const userId = req.user?.id || 'usr_sanjiv';

  try {
    if (isMongo) {
      const limit = range === 'today' ? 6 : range === '30_days' ? 30 : 7;
      const readings = await HealthReading.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit);

      if (readings && readings.length > 0) {
        const history = readings.reverse().map((r, i) => ({
          time: new Date(r.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i % 7],
          heartRate: r.heartRate,
          spO2: r.spO2,
          temp: r.temp,
          hydration: r.hydration,
          activity: r.activity,
          sleep: r.sleep,
          risk: r.healthScore
        }));

        return res.json({ range, history });
      }
    }
  } catch (err) {
    console.warn('Fallback to JSON history:', err.message);
  }

  // Fallback history data
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
      { day: 'Mon', heartRate: 72, spO2: 98, temp: 36.5, sleep: '7.5h', activity: 7200, hydration: 85, aqi: 95 },
      { day: 'Tue', heartRate: 75, spO2: 97, temp: 36.6, sleep: '7.2h', activity: 8100, hydration: 80, aqi: 110 },
      { day: 'Wed', heartRate: 88, spO2: 96, temp: 37.0, sleep: '6.8h', activity: 9400, hydration: 62, aqi: 145 },
      { day: 'Thu', heartRate: current.heartRate, spO2: current.spO2, temp: current.temp, sleep: '7.3h', activity: current.activity, hydration: current.hydration, aqi: env.aqi },
      { day: 'Fri', heartRate: 79, spO2: 97, temp: 36.7, sleep: '8.0h', activity: 6500, hydration: 78, aqi: 130 },
      { day: 'Sat', heartRate: 73, spO2: 98, temp: 36.5, sleep: '8.5h', activity: 5200, hydration: 88, aqi: 105 },
      { day: 'Sun', heartRate: 71, spO2: 99, temp: 36.4, sleep: '8.2h', activity: 6100, hydration: 90, aqi: 90 },
    ];
  }

  res.json({ range, history });
};

export const postHealthReading = async (req, res) => {
  const newReadings = req.body;
  const validation = validateHealthReading(newReadings);

  if (!validation.isValid) {
    return res.status(400).json({ error: 'Validation Error', details: validation.errors });
  }

  const isMongo = mongoose.connection.readyState === 1;
  const userId = req.user?.id || 'usr_sanjiv';
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

  if (isMongo) {
    try {
      await HealthReading.create({
        userId,
        heartRate: updated.heartRate,
        spO2: updated.spO2,
        temp: updated.temp,
        hydration: updated.hydration,
        activity: updated.activity || 6240,
        sleep: updated.sleep || '7h 20m',
        healthScore: assessment.overallScore,
        statusText: updated.statusText || 'Health telemetry updated',
        statusSeverity: assessment.riskLevel === 'HIGH RISK' ? 'critical' : assessment.riskLevel === 'MODERATE RISK' ? 'warning' : 'normal'
      });

      await RiskAssessment.create({
        userId,
        overallScore: assessment.overallScore,
        riskLevel: assessment.riskLevel,
        confidenceScore: assessment.confidenceScore || 92,
        heatStress: assessment.heatStress,
        dehydration: assessment.dehydration,
        fatigue: assessment.fatigue,
        respiratory: assessment.respiratory,
        cardiac: assessment.cardiac,
        whyText: assessment.whyText,
        contributingFactors: assessment.contributingFactors,
        recommendedActions: assessment.recommendedActions,
        disclaimer: assessment.disclaimer
      });

      await AuditLog.create({
        actor: req.user?.name || 'Sanjiv Venkat',
        actorRole: req.user?.role || 'USER',
        action: 'HEALTH_READING_SUBMITTED',
        details: `HR: ${updated.heartRate} BPM, SpO2: ${updated.spO2}%, Temp: ${updated.temp}°C, Risk: ${assessment.overallScore}/100`
      });
    } catch (err) {
      console.warn('MongoDB persistence error in postHealthReading:', err.message);
    }
  }

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

  res.json({
    message: 'Health reading successfully processed and evaluated',
    vitals: updated,
    riskAssessment: assessment
  });
};
