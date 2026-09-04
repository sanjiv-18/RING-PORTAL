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

// Wearable Simulation: HR Increase
export const simulateHrIncrease = (req, res) => {
  db.set('simulationState', { activePreset: 'hr_increase', lastUpdated: new Date().toISOString() });

  db.update('health_readings', h => ({
    ...h,
    heartRate: 124,
    heartRateChange: '+42% Tachycardia spike',
    healthScore: 62,
    statusText: 'Sudden Heart Rate Elevation (124 BPM)',
    statusSeverity: 'warning',
    updatedAt: new Date().toISOString()
  }));

  db.update('wearable_readings', w => ({
    ...w,
    heartRate: 124,
    stressScore: 78,
    stressLevel: 'High',
    hrv: 38,
    timestamp: new Date().toISOString()
  }));

  const vitals = db.get('health_readings');
  const env = db.get('environmental_readings');
  const baseline = db.get('health_baselines');
  const wearable = db.get('wearable_readings');
  const aiAssessment = calculateAiRisk(vitals, env, baseline, wearable);
  db.set('risk_assessments', aiAssessment);

  // Sync to Doctor Patient Roster
  db.update('patients', plist => plist.map(p => p.id === 'PAT-101' ? {
    ...p,
    heartRate: 124,
    riskLevel: 'Moderate',
    healthScore: 62,
    alert: '⌚ Wearable HR Spike: 124 BPM'
  } : p));

  db.update('alerts', alist => [
    {
      id: `alt_${Date.now()}`,
      userId: 'usr_sanjiv',
      category: 'Wearable Telemetry',
      type: 'warning',
      title: '⌚ Tachycardia Warning Detected by Smart Wearable',
      message: 'Resting heart rate surged to 124 BPM while stationary.',
      status: 'ACTIVE',
      source: 'Optical PPG Wearable Sensor',
      timestamp: new Date().toISOString()
    },
    ...alist
  ]);

  res.json({
    message: 'Heart Rate Increase scenario simulated',
    preset: 'hr_increase',
    heartRate: 124,
    riskAssessment: aiAssessment
  });
};

// Wearable Simulation: Dehydration
export const simulateDehydration = (req, res) => {
  db.set('simulationState', { activePreset: 'dehydration', lastUpdated: new Date().toISOString() });

  db.update('health_readings', h => ({
    ...h,
    hydration: 36,
    hydrationChange: 'Severely Depleted (-42%)',
    temp: 38.2,
    tempChange: 'Elevated (+0.8°C)',
    healthScore: 54,
    statusText: 'Severe cellular dehydration risk',
    statusSeverity: 'warning',
    updatedAt: new Date().toISOString()
  }));

  const vitals = db.get('health_readings');
  const env = db.get('environmental_readings');
  const baseline = db.get('health_baselines');
  const aiAssessment = calculateAiRisk(vitals, env, baseline);
  db.set('risk_assessments', aiAssessment);

  db.update('alerts', alist => [
    {
      id: `alt_${Date.now()}`,
      userId: 'usr_sanjiv',
      category: 'Hydration',
      type: 'warning',
      title: '💧 Critical Dehydration Level (36%)',
      message: 'Body fluid levels depleted below physiological safety threshold.',
      status: 'ACTIVE',
      source: 'Bio-impedance Sensor',
      timestamp: new Date().toISOString()
    },
    ...alist
  ]);

  res.json({
    message: 'Dehydration scenario simulated',
    preset: 'dehydration',
    hydration: 36,
    riskAssessment: aiAssessment
  });
};

// Wearable Simulation: Poor Sleep
export const simulatePoorSleep = (req, res) => {
  db.set('simulationState', { activePreset: 'poor_sleep', lastUpdated: new Date().toISOString() });

  db.update('wearable_readings', w => ({
    ...w,
    stressScore: 72,
    stressLevel: 'High',
    hrv: 42,
    sleepData: {
      duration: '4h 10m',
      qualityScore: 42,
      deepSleepMinutes: 28,
      remSleepMinutes: 35,
      lightSleepMinutes: 162,
      awakeMinutes: 65
    },
    timestamp: new Date().toISOString()
  }));

  db.update('health_readings', h => ({
    ...h,
    sleep: '4h 10m',
    healthScore: 66,
    statusText: 'Severe Sleep Fragmentation (4h 10m)',
    statusSeverity: 'warning',
    updatedAt: new Date().toISOString()
  }));

  const vitals = db.get('health_readings');
  const env = db.get('environmental_readings');
  const baseline = db.get('health_baselines');
  const wearable = db.get('wearable_readings');
  const aiAssessment = calculateAiRisk(vitals, env, baseline, wearable);
  db.set('risk_assessments', aiAssessment);

  db.update('alerts', alist => [
    {
      id: `alt_${Date.now()}`,
      userId: 'usr_sanjiv',
      category: 'Sleep Architecture',
      type: 'info',
      title: '😴 Sleep Debt & Autonomic Fatigue Warning',
      message: 'Wearable recorded 4h 10m total sleep with only 28m deep restorative sleep.',
      status: 'ACTIVE',
      source: 'Smart Wearable Sleep Tracker',
      timestamp: new Date().toISOString()
    },
    ...alist
  ]);

  res.json({
    message: 'Poor Sleep scenario simulated',
    preset: 'poor_sleep',
    sleepData: db.get('wearable_readings').sleepData,
    riskAssessment: aiAssessment
  });
};

export const simulateFall = (req, res) => {
  db.set('simulationState', { activePreset: 'fall_detected', lastUpdated: new Date().toISOString() });
  
  db.update('wearable_readings', w => ({
    ...w,
    fallDetected: true,
    timestamp: new Date().toISOString()
  }));

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

  const normalWearable = {
    userId: 'usr_sanjiv',
    deviceId: 'dev_apple_watch',
    deviceName: 'Apple Watch Ultra 2',
    heartRate: 82,
    spo2: 98,
    temperature: 36.8,
    steps: 8500,
    calories: 620,
    stressLevel: 'Low',
    stressScore: 24,
    activityLevel: 'Moderate',
    hrv: 68,
    sleepData: {
      duration: '7h 20m',
      qualityScore: 85,
      deepSleepMinutes: 110,
      remSleepMinutes: 95,
      lightSleepMinutes: 235,
      awakeMinutes: 20
    },
    fallDetected: false,
    timestamp: new Date().toISOString()
  };

  const baseline = db.get('health_baselines');
  const assessment = calculateAiRisk(normalVitals, normalEnv, baseline, normalWearable);

  db.set('health_readings', normalVitals);
  db.set('environmental_readings', normalEnv);
  db.set('wearable_readings', normalWearable);
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
