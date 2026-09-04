import { db, getDbStatus } from '../config/db.js';
import { calculateAiRisk } from '../services/aiRiskService.js';

export const simulateHeatStress = (req, res) => {
  db.set('simulationState', { activePreset: 'heat_stress', lastUpdated: new Date().toISOString() });

  const updatedVitals = {
    userId: 'usr_sanjiv',
    heartRate: 108,
    heartRateChange: '+23% above baseline',
    spO2: 94,
    spO2Change: '-3% below normal',
    temp: 38.4,
    tempChange: 'Elevated (+1.2°C)',
    hydration: 42,
    hydrationChange: 'Low (-36%)',
    activity: 8420,
    sleep: '7h 20m',
    healthScore: 58,
    statusText: 'Moderate heat-stress risk detected',
    statusSeverity: 'warning',
    updatedAt: new Date().toISOString()
  };

  const updatedEnv = {
    outsideTemp: 41,
    humidity: 78,
    aqi: 215,
    uvIndex: 8,
    heatIndex: 48,
    weatherCondition: 'Extreme Heatwave',
    pollutionLevel: 'Hazardous Smog',
    zone: 'Sector 4, Central Urban Hub',
    updatedAt: new Date().toISOString()
  };

  const baseline = db.get('health_baselines');
  const aiAssessment = calculateAiRisk(updatedVitals, updatedEnv, baseline);

  db.set('health_readings', updatedVitals);
  db.set('environmental_readings', updatedEnv);
  db.set('risk_assessments', aiAssessment);

  // Sync to Doctor Patient Roster
  db.update('patients', plist => plist.map(p => p.id === 'PAT-101' ? {
    ...p,
    heartRate: 108,
    spO2: 94,
    temp: 38.4,
    hydration: 42,
    riskLevel: 'High',
    heatStress: 87,
    healthScore: 58,
    alert: 'CRITICAL Heat Stress (41°C / 108 BPM)'
  } : p));

  // Update Admin Stats
  db.update('admin_stats', stats => ({
    ...stats,
    highRiskUsers: stats.highRiskUsers + 1,
    heatAlerts: stats.heatAlerts + 1,
  }));

  // Create High-Priority Alert
  const newAlert = {
    id: `alt_${Date.now()}`,
    userId: 'usr_sanjiv',
    category: 'Environmental',
    type: 'critical',
    title: '🔥 Heat-Stress Risk Increased',
    message: 'High temperature (41°C) & elevated HR (108 BPM) recorded for user Sanjiv.',
    status: 'ACTIVE',
    source: 'AI Predictive Engine',
    timestamp: new Date().toISOString()
  };
  db.update('alerts', alist => [newAlert, ...alist]);

  // Create Notification
  const newNotif = {
    id: `notif_${Date.now()}`,
    recipientId: 'usr_sanjiv',
    category: 'Critical',
    title: '🔥 Heat Stress Alert',
    message: 'Extreme heat risk (41°C / 108 BPM) detected. Take immediate shelter.',
    read: false,
    createdAt: new Date().toISOString()
  };
  db.update('notifications', nlist => [newNotif, ...nlist]);

  // Create Audit Log Entry
  db.update('audit_logs', logs => [
    {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'Demo Simulation Engine',
      action: 'Simulate Heat Stress triggered',
      details: 'Vitals: 41°C, 108 BPM, 78% humidity. Risk: 87/100 High'
    },
    ...logs
  ]);

  res.json({
    message: 'Heat Stress scenario applied across User, Doctor, and Admin state',
    preset: 'heat_stress',
    vitals: updatedVitals,
    riskAssessment: aiAssessment
  });
};

export const simulateHighAqi = (req, res) => {
  db.set('simulationState', { activePreset: 'high_aqi', lastUpdated: new Date().toISOString() });

  db.update('environmental_readings', env => ({
    ...env,
    aqi: 215,
    pollutionLevel: 'Hazardous Smog',
    updatedAt: new Date().toISOString()
  }));

  const vitals = db.get('health_readings');
  const env = db.get('environmental_readings');
  const baseline = db.get('health_baselines');
  const aiAssessment = calculateAiRisk(vitals, env, baseline);

  db.set('risk_assessments', aiAssessment);

  db.update('admin_stats', stats => ({
    ...stats,
    respiratoryAlerts: stats.respiratoryAlerts + 1
  }));

  const newAlert = {
    id: `alt_${Date.now()}`,
    userId: 'usr_sanjiv',
    category: 'Environmental',
    type: 'warning',
    title: '🌫️ Hazardous AQI Warning',
    message: 'Air Quality Index reached hazardous level (215 AQI).',
    status: 'ACTIVE',
    source: 'AQI Sensor Feed',
    timestamp: new Date().toISOString()
  };
  db.update('alerts', alist => [newAlert, ...alist]);

  res.json({
    message: 'High AQI scenario applied',
    preset: 'high_aqi',
    riskAssessment: aiAssessment
  });
};

export const simulateFall = (req, res) => {
  db.set('simulationState', { activePreset: 'fall_detected', lastUpdated: new Date().toISOString() });
  res.json({ message: 'Fall simulation countdown initialized', preset: 'fall_detected' });
};

export const normalizeVitals = (req, res) => {
  db.set('simulationState', { activePreset: 'normal', lastUpdated: new Date().toISOString() });

  const normalVitals = {
    userId: 'usr_sanjiv',
    heartRate: 82,
    heartRateChange: '0%',
    spO2: 97,
    spO2Change: 'Optimal',
    temp: 36.8,
    tempChange: 'Normal',
    hydration: 78,
    hydrationChange: 'Good',
    activity: 6240,
    sleep: '7h 20m',
    healthScore: 82,
    statusText: 'Your health condition is normal',
    statusSeverity: 'normal',
    updatedAt: new Date().toISOString()
  };

  const normalEnv = {
    outsideTemp: 32,
    humidity: 55,
    aqi: 65,
    uvIndex: 4,
    heatIndex: 33,
    weatherCondition: 'Pleasant & Warm',
    pollutionLevel: 'Good',
    zone: 'Sector 4, Central Urban Hub',
    updatedAt: new Date().toISOString()
  };

  const baseline = db.get('health_baselines');
  const assessment = calculateAiRisk(normalVitals, normalEnv, baseline);

  db.set('health_readings', normalVitals);
  db.set('environmental_readings', normalEnv);
  db.set('risk_assessments', assessment);

  db.update('patients', plist => plist.map(p => p.id === 'PAT-101' ? {
    ...p,
    heartRate: 82,
    spO2: 97,
    temp: 36.8,
    hydration: 78,
    riskLevel: 'Low',
    heatStress: 18,
    healthScore: 82,
    alert: 'Normal Baseline'
  } : p));

  const newAlert = {
    id: `alt_${Date.now()}`,
    userId: 'usr_sanjiv',
    category: 'Recovery',
    type: 'success',
    title: '🟢 Health Indicators Returned to Baseline',
    message: 'All vital telemetry and risk indices returned to normal benchmark.',
    status: 'RESOLVED',
    source: 'Edge AI Engine',
    timestamp: new Date().toISOString()
  };
  db.update('alerts', alist => [newAlert, ...alist]);

  res.json({ message: 'Vitals normalized to personal baseline', preset: 'normal' });
};

export const simulateBaselineShift = (req, res) => {
  db.set('simulationState', { activePreset: 'baseline_shift', lastUpdated: new Date().toISOString() });

  db.update('health_readings', h => ({
    ...h,
    heartRate: 108,
    spO2: 94,
    temp: 38.4,
    statusText: 'Significant baseline deviation detected',
    statusSeverity: 'warning',
    updatedAt: new Date().toISOString()
  }));

  res.json({ message: 'Baseline shift simulated', preset: 'baseline_shift' });
};

export const resetSimulation = (req, res) => {
  return normalizeVitals(req, res);
};
