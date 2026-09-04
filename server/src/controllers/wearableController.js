import { db } from '../config/db.js';
import { calculateAiRisk } from '../services/aiRiskService.js';

// GET /api/wearables/current - Get current wearable telemetry
export const getCurrentWearable = (req, res) => {
  const reading = db.get('wearable_readings') || {
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

  const devices = db.get('wearable_devices') || [];
  const activeDevice = devices.find(d => d.connectionStatus === 'CONNECTED') || devices[0] || null;

  res.json({
    reading,
    activeDevice,
    timestamp: new Date().toISOString()
  });
};

// POST /api/wearables/sync - Ingest data from wearable device / phone companion
export const syncWearableData = (req, res) => {
  const {
    deviceId,
    heartRate,
    spo2,
    temperature,
    steps,
    calories,
    stressLevel,
    stressScore,
    hrv,
    sleepData,
    fallDetected
  } = req.body;

  const currentReading = db.get('wearable_readings') || {};
  const currentHealth = db.get('health_readings') || {};
  const env = db.get('environmental_readings') || { aqi: 110, temperature: 28, humidity: 55 };

  // Calculate stress score and level if not provided
  let computedStressScore = stressScore !== undefined ? stressScore : currentReading.stressScore || 25;
  let computedStressLevel = stressLevel || (computedStressScore > 70 ? 'High' : computedStressScore > 40 ? 'Moderate' : 'Low');

  const updatedWearable = {
    userId: req.user?.id || 'usr_sanjiv',
    deviceId: deviceId || currentReading.deviceId || 'dev_apple_watch',
    deviceName: currentReading.deviceName || 'Smart Wearable',
    heartRate: heartRate !== undefined ? Number(heartRate) : currentReading.heartRate,
    spo2: spo2 !== undefined ? Number(spo2) : currentReading.spo2,
    temperature: temperature !== undefined ? Number(temperature) : currentReading.temperature,
    steps: steps !== undefined ? Number(steps) : currentReading.steps,
    calories: calories !== undefined ? Number(calories) : currentReading.calories,
    stressLevel: computedStressLevel,
    stressScore: computedStressScore,
    activityLevel: steps > 10000 ? 'High' : steps > 5000 ? 'Moderate' : 'Sedentary',
    hrv: hrv !== undefined ? Number(hrv) : (currentReading.hrv || 65),
    sleepData: sleepData || currentReading.sleepData || {
      duration: '7h 20m',
      qualityScore: 85,
      deepSleepMinutes: 110,
      remSleepMinutes: 95,
      lightSleepMinutes: 235,
      awakeMinutes: 20
    },
    fallDetected: Boolean(fallDetected),
    timestamp: new Date().toISOString()
  };

  db.set('wearable_readings', updatedWearable);

  // Synchronize base health_readings vitals
  const updatedHealth = {
    ...currentHealth,
    heartRate: updatedWearable.heartRate,
    spO2: updatedWearable.spo2,
    temp: updatedWearable.temperature,
    activity: updatedWearable.steps,
    sleep: updatedWearable.sleepData.duration,
    lastUpdated: new Date().toISOString()
  };

  // Recompute AI risk using unified vitals
  const aiRisk = calculateAiRisk(updatedHealth, env);
  updatedHealth.healthScore = aiRisk.healthScore;
  updatedHealth.statusText = aiRisk.statusText;
  updatedHealth.statusSeverity = aiRisk.statusSeverity;
  db.set('health_readings', updatedHealth);

  // If fall detected, register emergency alert
  if (fallDetected) {
    db.update('alerts', (alerts = []) => [
      {
        id: `alt_fall_${Date.now()}`,
        type: 'DANGER',
        title: '🚨 CRITICAL: Fall Detected by Wearable Accelerometer',
        message: `High-impact deceleration registered on ${updatedWearable.deviceName}. Immediate assistance dispatched.`,
        severity: 'critical',
        source: 'IoT Wearable IMU',
        timestamp: new Date().toISOString(),
        read: false
      },
      ...alerts
    ]);
  }

  res.json({
    message: 'Wearable telemetry synchronized successfully',
    wearable: updatedWearable,
    health: updatedHealth,
    aiRisk
  });
};

// GET /api/wearables/history - Get time-series wearable trends
export const getWearableHistory = (req, res) => {
  const { range = '7_days' } = req.query;
  const current = db.get('wearable_readings') || {};

  let sleepTrends = [];
  let stressTrends = [];
  let activityTrends = [];

  if (range === 'today') {
    sleepTrends = [
      { time: '00:00', stage: 'Light Sleep', heartRate: 62 },
      { time: '01:30', stage: 'Deep Sleep', heartRate: 56 },
      { time: '03:00', stage: 'REM Sleep', heartRate: 65 },
      { time: '04:30', stage: 'Deep Sleep', heartRate: 55 },
      { time: '06:00', stage: 'Light Sleep', heartRate: 64 },
      { time: '07:15', stage: 'Awake', heartRate: 72 }
    ];

    stressTrends = [
      { time: '06:00', stressScore: 18, level: 'Low' },
      { time: '09:00', stressScore: 35, level: 'Low' },
      { time: '12:00', stressScore: 68, level: 'Moderate' },
      { time: '15:00', stressScore: current.stressScore || 45, level: current.stressLevel || 'Moderate' },
      { time: '18:00', stressScore: 30, level: 'Low' },
      { time: '21:00', stressScore: 22, level: 'Low' }
    ];

    activityTrends = [
      { time: '08:00', steps: 1200, calories: 95 },
      { time: '11:00', steps: 3400, calories: 240 },
      { time: '14:00', steps: 5800, calories: 410 },
      { time: '17:00', steps: current.steps || 8500, calories: current.calories || 620 },
      { time: '20:00', steps: current.steps ? current.steps + 600 : 9100, calories: 680 }
    ];
  } else {
    // 7 days default
    sleepTrends = [
      { day: 'Mon', deep: 95, rem: 80, light: 240, awake: 25, score: 82 },
      { day: 'Tue', deep: 105, rem: 90, light: 230, awake: 15, score: 88 },
      { day: 'Wed', deep: 70, rem: 65, light: 210, awake: 45, score: 68 },
      { day: 'Thu', deep: current.sleepData?.deepSleepMinutes || 110, rem: current.sleepData?.remSleepMinutes || 95, light: current.sleepData?.lightSleepMinutes || 235, awake: current.sleepData?.awakeMinutes || 20, score: current.sleepData?.qualityScore || 85 },
      { day: 'Fri', deep: 115, rem: 100, light: 250, awake: 15, score: 90 },
      { day: 'Sat', deep: 125, rem: 110, light: 260, awake: 10, score: 94 },
      { day: 'Sun', deep: 120, rem: 105, light: 255, awake: 12, score: 92 }
    ];

    stressTrends = [
      { day: 'Mon', avgStress: 28, peakStress: 55, hrv: 72 },
      { day: 'Tue', avgStress: 34, peakStress: 62, hrv: 68 },
      { day: 'Wed', avgStress: 58, peakStress: 84, hrv: 48 },
      { day: 'Thu', avgStress: current.stressScore || 32, peakStress: 65, hrv: current.hrv || 68 },
      { day: 'Fri', avgStress: 30, peakStress: 58, hrv: 70 },
      { day: 'Sat', avgStress: 20, peakStress: 40, hrv: 78 },
      { day: 'Sun', avgStress: 22, peakStress: 38, hrv: 76 }
    ];

    activityTrends = [
      { day: 'Mon', steps: 8200, calories: 590, activeMins: 45 },
      { day: 'Tue', steps: 9100, calories: 640, activeMins: 55 },
      { day: 'Wed', steps: 6400, calories: 480, activeMins: 30 },
      { day: 'Thu', steps: current.steps || 8500, calories: current.calories || 620, activeMins: 50 },
      { day: 'Fri', steps: 10200, calories: 730, activeMins: 65 },
      { day: 'Sat', steps: 11500, calories: 810, activeMins: 75 },
      { day: 'Sun', steps: 7800, calories: 550, activeMins: 40 }
    ];
  }

  res.json({
    range,
    sleepTrends,
    stressTrends,
    activityTrends,
    timestamp: new Date().toISOString()
  });
};

// GET /api/wearables/insights - AI Insights derived from wearable sensors
export const getWearableInsights = (req, res) => {
  const current = db.get('wearable_readings') || {};
  const devices = db.get('wearable_devices') || [];
  const activeDevice = devices.find(d => d.connectionStatus === 'CONNECTED') || devices[0];

  const insights = [
    {
      id: 'ins_1',
      category: 'Sleep Architecture',
      title: 'Optimal Deep Sleep Recovery',
      description: `Your ${current.sleepData?.deepSleepMinutes || 110} minutes of deep sleep last night is 18% above your 30-day baseline, providing enhanced neurological regeneration.`,
      score: current.sleepData?.qualityScore || 85,
      tag: 'Positive Recovery',
      badgeColor: 'emerald'
    },
    {
      id: 'ins_2',
      category: 'Stress & Autonomic Nervous System',
      title: current.stressScore > 50 ? 'Elevated Sympathetic Activation' : 'Balanced Parasympathetic Tone',
      description: current.stressScore > 50 
        ? 'HRV dropped to below 50ms during peak hours. Consider taking a 5-minute diaphragmatic breathing session.' 
        : `HRV is robust at ${current.hrv || 68}ms indicating high autonomic flexibility and low chronic strain.`,
      score: current.stressScore || 24,
      tag: current.stressScore > 50 ? 'Action Recommended' : 'Optimal Balance',
      badgeColor: current.stressScore > 50 ? 'amber' : 'teal'
    },
    {
      id: 'ins_3',
      category: 'Cardiovascular Efficiency',
      title: 'Steady Resting Heart Rate',
      description: `Wearable optical PPG sensor reports steady cardiovascular rate with 0 arrhythmia episodes detected over the past 24 hours.`,
      score: 96,
      tag: 'Stable Rhythm',
      badgeColor: 'blue'
    }
  ];

  res.json({
    activeDevice,
    insights,
    wearableStatus: {
      battery: activeDevice?.batteryLevel || 88,
      isCharging: activeDevice?.isCharging || false,
      firmware: activeDevice?.firmwareVersion || 'v2.4.1',
      sensorsActive: activeDevice?.sensorsEnabled?.length || 4
    }
  });
};

// POST /api/wearables/fall - Dedicated Fall Detection Event handler
export const handleWearableFall = (req, res) => {
  const { deviceId, accelerationG, impactTimestamp, latitude, longitude } = req.body;
  const currentHealth = db.get('health_readings') || {};

  // Register Emergency Event
  const emergencyEvent = {
    id: `emg_fall_${Date.now()}`,
    userId: req.user?.id || 'usr_sanjiv',
    userName: 'Sanjiv Venkatachalam',
    type: 'WEARABLE_FALL_DETECTED',
    severity: 'CRITICAL',
    status: 'ACTIVE',
    location: {
      lat: latitude || 13.0827,
      lng: longitude || 80.2707,
      address: 'Chennai Healthcare Hub, Anna Salai'
    },
    telemetry: {
      accelerationG: accelerationG || 4.2,
      impactTime: impactTimestamp || new Date().toISOString(),
      heartRate: currentHealth.heartRate || 105,
      spO2: currentHealth.spO2 || 96
    },
    createdAt: new Date().toISOString()
  };

  db.update('emergency_events', (events = []) => [emergencyEvent, ...events]);

  // Add Alert
  db.update('alerts', (alerts = []) => [
    {
      id: `alt_${Date.now()}`,
      type: 'DANGER',
      title: '🚨 CRITICAL FALL IMPACT DETECTED',
      message: `Wearable device registered a high-G impact (${accelerationG || 4.2}G). Emergency response protocol initiated.`,
      severity: 'critical',
      source: 'Wearable IMU Accelerometer',
      timestamp: new Date().toISOString(),
      read: false
    },
    ...alerts
  ]);

  // Update wearable reading state
  db.update('wearable_readings', (reading = {}) => ({
    ...reading,
    fallDetected: true,
    timestamp: new Date().toISOString()
  }));

  res.status(201).json({
    message: 'Wearable Fall Detection Alert triggered and logged',
    emergencyEvent
  });
};
