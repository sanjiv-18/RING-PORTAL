import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// POST /api/simulation/heat-stress
router.post('/heat-stress', (req, res) => {
  db.set('simulationState', { activePreset: 'heat_stress', lastUpdated: new Date().toISOString() });

  db.set('healthReading', {
    heartRate: 108,
    spO2: 94,
    temp: 38.4,
    hydration: 42,
    activity: 8420,
    sleep: '7h 20m',
    healthScore: 58,
    statusText: 'Moderate heat-stress risk detected',
    statusSeverity: 'warning',
    updatedAt: new Date().toISOString()
  });

  db.set('environmentalReading', {
    outsideTemp: 41,
    humidity: 78,
    aqi: 215,
    uvIndex: 8,
    heatIndex: 48,
    weatherCondition: 'Extreme Heatwave',
    pollutionLevel: 'Hazardous Smog',
    updatedAt: new Date().toISOString()
  });

  db.set('riskAssessment', {
    overallScore: 87,
    riskLevel: 'HIGH RISK',
    heatStress: 87,
    dehydration: 68,
    fatigue: 52,
    respiratory: 31,
    cardiac: 18,
    whyText: 'Heart rate is significantly above your personal baseline while environmental temperature (41°C) and humidity (78%) are elevated.',
    contributingFactors: [
      'Elevated heart rate (+20 BPM above baseline)',
      'High environmental temperature (41°C)',
      'High ambient humidity (78%)',
      'Low hydration status (42%)',
      'Air Quality Index at 215 AQI'
    ],
    recommendedActions: [
      { id: 'rec_1', action: 'Hydrate', text: 'Drink 750ml water or electrolyte solution', icon: 'Droplets' },
      { id: 'rec_2', action: 'Move to Cooler Area', text: 'Move immediately to air-conditioned room', icon: 'Thermometer' },
      { id: 'rec_3', action: 'Rest', text: 'Rest for 20 minutes with cold compress', icon: 'Moon' }
    ]
  });

  // Update Doctor's view of patient Sanjiv
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
  db.update('adminStats', stats => ({
    ...stats,
    highRiskUsers: stats.highRiskUsers + 1,
    heatAlerts: stats.heatAlerts + 1,
  }));

  // Create System Alert
  const newAlert = {
    id: `alt_${Date.now()}`,
    category: 'Environmental',
    type: 'critical',
    title: '🔥 Heat-Stress Risk Increased',
    message: 'High temperature (41°C) & elevated HR (108 BPM) recorded for user Sanjiv.',
    timestamp: new Date().toISOString()
  };
  db.update('alerts', alist => [newAlert, ...alist]);

  res.json({
    message: 'Simulated Heat Stress scenario applied to backend database',
    preset: 'heat_stress'
  });
});

// POST /api/simulation/high-aqi
router.post('/high-aqi', (req, res) => {
  db.set('simulationState', { activePreset: 'high_aqi', lastUpdated: new Date().toISOString() });

  db.update('environmentalReading', env => ({
    ...env,
    aqi: 215,
    pollutionLevel: 'Hazardous Smog',
    updatedAt: new Date().toISOString()
  }));

  db.update('riskAssessment', risk => ({
    ...risk,
    respiratory: 82,
    whyText: 'Hazardous air quality index (215 AQI) detected. Respiratory risk elevated.',
    recommendedActions: [
      { id: 'rec_1', action: 'Wear Respirator', text: 'Wear N95 protective mask outdoor', icon: 'Shield' },
      { id: 'rec_2', action: 'Air Filtration', text: 'Run indoor HEPA air purifier on max', icon: 'Wind' },
      { id: 'rec_3', action: 'Limit Outdoor Exposure', text: 'Avoid outdoor exercise', icon: 'Moon' }
    ]
  }));

  db.update('adminStats', stats => ({
    ...stats,
    respiratoryAlerts: stats.respiratoryAlerts + 1
  }));

  const newAlert = {
    id: `alt_${Date.now()}`,
    category: 'Environmental',
    type: 'warning',
    title: '🌫️ AQI Reached Hazardous Level',
    message: 'Air Quality Index spiked to 215 AQI in Sector 4.',
    timestamp: new Date().toISOString()
  };
  db.update('alerts', alist => [newAlert, ...alist]);

  res.json({ message: 'High AQI scenario applied to backend', preset: 'high_aqi' });
});

// POST /api/simulation/fall
router.post('/fall', (req, res) => {
  db.set('simulationState', { activePreset: 'fall_detected', lastUpdated: new Date().toISOString() });
  res.json({ message: 'Fall simulation triggered on backend', preset: 'fall_detected' });
});

// POST /api/simulation/normalize
router.post('/normalize', (req, res) => {
  db.set('simulationState', { activePreset: 'normal', lastUpdated: new Date().toISOString() });

  db.set('healthReading', {
    heartRate: 82,
    spO2: 97,
    temp: 36.8,
    hydration: 78,
    activity: 6240,
    sleep: '7h 20m',
    healthScore: 82,
    statusText: 'Your health condition is normal',
    statusSeverity: 'normal',
    updatedAt: new Date().toISOString()
  });

  db.set('environmentalReading', {
    outsideTemp: 32,
    humidity: 55,
    aqi: 65,
    uvIndex: 4,
    heatIndex: 33,
    weatherCondition: 'Pleasant & Warm',
    pollutionLevel: 'Good',
    updatedAt: new Date().toISOString()
  });

  db.set('riskAssessment', {
    overallScore: 22,
    riskLevel: 'LOW RISK',
    heatStress: 18,
    dehydration: 25,
    fatigue: 20,
    respiratory: 15,
    cardiac: 10,
    whyText: 'All vital metrics and environmental indicators are within normal bounds.',
    contributingFactors: [
      'Normal Heart Rate (82 BPM)',
      'Optimal SpO2 Saturation (97%)',
      'Normal Body Temperature (36.8°C)',
      'Clean Air Quality (65 AQI)'
    ],
    recommendedActions: [
      { id: 'rec_1', action: 'Maintain Hydration', text: 'Drink water regularly throughout the day', icon: 'Droplets' },
      { id: 'rec_2', action: 'Daily Walk', text: 'Enjoy light outdoor exercise', icon: 'Activity' }
    ]
  });

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
    category: 'Recovery',
    type: 'success',
    title: '🟢 Health Indicators Returned to Baseline',
    message: 'All vital signs normalized for user Sanjiv.',
    timestamp: new Date().toISOString()
  };
  db.update('alerts', alist => [newAlert, ...alist]);

  res.json({ message: 'Vitals normalized on backend', preset: 'normal' });
});

// POST /api/simulation/baseline-shift
router.post('/baseline-shift', (req, res) => {
  db.set('simulationState', { activePreset: 'baseline_shift', lastUpdated: new Date().toISOString() });

  db.update('healthReading', h => ({
    ...h,
    heartRate: 108,
    spO2: 94,
    temp: 38.4,
    statusText: 'Significant baseline deviation detected',
    statusSeverity: 'warning'
  }));

  res.json({ message: 'Baseline shift simulated on backend', preset: 'baseline_shift' });
});

// POST /api/simulation/reset
router.post('/reset', (req, res) => {
  db.set('simulationState', { activePreset: 'normal', lastUpdated: new Date().toISOString() });
  
  // Re-run normalize
  db.set('healthReading', {
    heartRate: 82,
    spO2: 97,
    temp: 36.8,
    hydration: 78,
    activity: 6240,
    sleep: '7h 20m',
    healthScore: 82,
    statusText: 'Your health condition is normal',
    statusSeverity: 'normal',
    updatedAt: new Date().toISOString()
  });

  db.set('environmentalReading', {
    outsideTemp: 38,
    humidity: 72,
    aqi: 142,
    uvIndex: 8,
    heatIndex: 43,
    weatherCondition: 'Very Hot & Humid',
    pollutionLevel: 'Unhealthy for Sensitive Groups',
    updatedAt: new Date().toISOString()
  });

  db.set('riskAssessment', {
    overallScore: 72,
    riskLevel: 'MODERATE RISK',
    heatStress: 72,
    dehydration: 61,
    fatigue: 48,
    respiratory: 24,
    cardiac: 12,
    whyText: 'High temperature + elevated heart rate + increased activity detected.',
    contributingFactors: [
      'Elevated heart rate (+10 BPM above baseline)',
      'High environmental temperature (38°C)',
      'High ambient humidity (72%)',
      'Hydration level at 78%'
    ],
    recommendedActions: [
      { id: 'rec_1', action: 'Hydrate', text: 'Drink 500ml water immediately', icon: 'Droplets' },
      { id: 'rec_2', action: 'Move to Cooler Area', text: 'Seek air-conditioned shelter', icon: 'Thermometer' },
      { id: 'rec_3', action: 'Rest', text: 'Rest for 15 minutes in shade', icon: 'Moon' }
    ]
  });

  db.update('patients', plist => plist.map(p => p.id === 'PAT-101' ? {
    ...p,
    heartRate: 82,
    spO2: 97,
    temp: 36.8,
    hydration: 78,
    riskLevel: 'Moderate',
    heatStress: 72,
    healthScore: 82,
    alert: 'Heat Stress Risk 72%'
  } : p));

  res.json({ message: 'Simulation state reset to default on backend', preset: 'normal' });
});

export default router;
