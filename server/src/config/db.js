import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_SERVER_DIR = path.resolve(__dirname, '../../');
const DATA_DIR = path.join(ROOT_SERVER_DIR, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let dbMode = 'Demo JSON Store';
let isMongoConnected = false;
let lastDbLatency = '2ms';

const initialData = {
  users: [
    {
      _id: 'usr_sanjiv',
      id: 'usr_sanjiv',
      name: 'Sanjiv Venkat',
      email: 'sanjiv@healthguard.ai',
      role: 'USER',
      passwordHash: '$2a$10$wT6qL6286.mockHashedPasswordExample2026',
      age: 34,
      gender: 'Male',
      height: '178 cm',
      weight: '74 kg',
      bloodType: 'O+',
      conditions: 'Mild Seasonal Asthma, Heat Sensitivity',
      locationPermission: true,
      dataSharing: false,
      notificationsEnabled: true,
      assignedDoctorId: 'doc_anita',
      createdAt: '2026-01-15T10:00:00.000Z',
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'doc_anita',
      id: 'doc_anita',
      name: 'Dr. Anita Roy',
      email: 'dr.anita@healthguard.ai',
      role: 'DOCTOR',
      specialty: 'Cardiology & Environmental Medicine',
      assignedPatientIds: ['usr_sanjiv', 'PAT-102', 'PAT-103', 'PAT-104'],
      createdAt: '2026-01-10T09:00:00.000Z',
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'adm_system',
      id: 'adm_system',
      name: 'System Admin',
      email: 'admin@healthguard.ai',
      role: 'ADMIN',
      createdAt: '2026-01-01T08:00:00.000Z',
      updatedAt: new Date().toISOString()
    }
  ],
  simulationState: {
    activePreset: 'normal',
    lastUpdated: new Date().toISOString(),
  },
  wearable_devices: [
    {
      _id: 'dev_apple_watch',
      id: 'dev_apple_watch',
      userId: 'usr_sanjiv',
      deviceName: 'Apple Watch Ultra 2',
      deviceType: 'Smart Watch',
      manufacturer: 'Apple Inc.',
      modelNumber: 'A2986 (Cellular + GPS)',
      connectionStatus: 'CONNECTED',
      batteryLevel: 88,
      isCharging: false,
      firmwareVersion: 'watchOS 10.4',
      lastSyncTime: new Date().toISOString(),
      sensorsEnabled: ['Optical Heart Rate (PPG)', 'SpO2 Sensor', 'Skin Temperature', 'Fall Detection Accelerometer', 'ECG Sensor'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'dev_oura_ring',
      id: 'dev_oura_ring',
      userId: 'usr_sanjiv',
      deviceName: 'Oura Ring Gen 3 Horizon',
      deviceType: 'Smart Ring',
      manufacturer: 'Oura Health',
      modelNumber: 'HERO-SILVER-10',
      connectionStatus: 'CONNECTED',
      batteryLevel: 74,
      isCharging: false,
      firmwareVersion: 'v2.9.22',
      lastSyncTime: new Date().toISOString(),
      sensorsEnabled: ['Infrared PPG', 'Negative Temperature Coefficient (NTC)', '3D Accelerometer', 'Sleep Staging AI'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'dev_garmin_band',
      id: 'dev_garmin_band',
      userId: 'usr_sanjiv',
      deviceName: 'Garmin Forerunner 965',
      deviceType: 'Fitness Band',
      manufacturer: 'Garmin Ltd.',
      modelNumber: 'FR-965-TITANIUM',
      connectionStatus: 'DISCONNECTED',
      batteryLevel: 92,
      isCharging: false,
      firmwareVersion: 'v18.23',
      lastSyncTime: new Date(Date.now() - 86400000).toISOString(),
      sensorsEnabled: ['Elevate v4 Optical HR', 'Pulse Ox', 'Barometric Altimeter', 'VO2 Max Analyzer'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  wearable_readings: {
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
  },
  health_readings: {
    userId: 'usr_sanjiv',
    heartRate: 82,
    heartRateChange: '+0%',
    spO2: 97,
    spO2Change: '0%',
    temp: 36.8,
    tempChange: 'Optimal',
    hydration: 78,
    hydrationChange: 'Good',
    activity: 8500,
    sleep: '7h 20m',
    healthScore: 82,
    statusText: 'Your health condition is normal',
    statusSeverity: 'normal',
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  health_baselines: {
    userId: 'usr_sanjiv',
    heartRate: { min: 72, max: 88, unit: 'BPM', average: 78 },
    spO2: { min: 95, max: 100, unit: '%', average: 97.5 },
    temp: { min: 36.5, max: 37.2, unit: '°C', average: 36.8 },
    hydration: { min: 60, max: 100, unit: '%', average: 80 },
    activity: { goal: 8000, average: 7400 },
    sleep: { target: '8h', average: '7.5h' },
    stress: { maxSafeScore: 45, average: 28 },
    calibratedDays: 30,
    updatedAt: new Date().toISOString()
  },
  environmental_readings: {
    outsideTemp: 38,
    humidity: 72,
    aqi: 142,
    uvIndex: 8,
    heatIndex: 43,
    weatherCondition: 'Very Hot & Humid',
    pollutionLevel: 'Unhealthy for Sensitive Groups',
    zone: 'Sector 4, Central Urban Hub',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  risk_assessments: {
    userId: 'usr_sanjiv',
    overallScore: 72,
    riskLevel: 'MODERATE RISK',
    confidenceScore: 89,
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
      'Hydration status at 78%'
    ],
    recommendedActions: [
      { id: 'rec_1', action: 'Hydrate', text: 'Drink 500ml water immediately', icon: 'Droplets', priority: 'High' },
      { id: 'rec_2', action: 'Move to Cooler Area', text: 'Seek air-conditioned shelter', icon: 'Thermometer', priority: 'High' },
      { id: 'rec_3', action: 'Rest', text: 'Rest for 15 minutes in shade', icon: 'Moon', priority: 'Medium' }
    ],
    disclaimer: 'Prototype AI Risk Assessment — Not a Medical Diagnosis',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  patients: [
    {
      id: 'PAT-101',
      userId: 'usr_sanjiv',
      name: 'Sanjiv Venkat',
      age: 34,
      gender: 'Male',
      heartRate: 82,
      spO2: 98,
      temp: 36.8,
      hydration: 78,
      connectedDevice: 'Apple Watch Ultra 2 (88% 🔋)',
      stressLevel: 'Low',
      sleepDuration: '7h 20m',
      riskLevel: 'Moderate',
      heatStress: 72,
      healthScore: 82,
      lastActive: '10s ago',
      alert: 'Heat Stress Risk 72%'
    },
    {
      id: 'PAT-102',
      userId: 'usr_priya',
      name: 'Priya Sharma',
      age: 29,
      gender: 'Female',
      heartRate: 98,
      spO2: 94,
      temp: 37.4,
      hydration: 55,
      connectedDevice: 'Oura Ring Gen 3 (74% 🔋)',
      stressLevel: 'Moderate',
      sleepDuration: '5h 15m',
      riskLevel: 'High',
      heatStress: 88,
      healthScore: 68,
      lastActive: '5m ago',
      alert: 'Elevated HR & Dehydration'
    },
    {
      id: 'PAT-103',
      userId: 'usr_rajesh',
      name: 'Rajesh Kumar',
      age: 52,
      gender: 'Male',
      heartRate: 74,
      spO2: 98,
      temp: 36.6,
      hydration: 85,
      connectedDevice: 'Fitbit Charge 6 (62% 🔋)',
      stressLevel: 'Low',
      sleepDuration: '8h 05m',
      riskLevel: 'Low',
      heatStress: 18,
      healthScore: 92,
      lastActive: '12m ago',
      alert: 'Normal Baseline'
    },
    {
      id: 'PAT-104',
      userId: 'usr_anita',
      name: 'Anita Desai',
      age: 61,
      gender: 'Female',
      heartRate: 104,
      spO2: 92,
      temp: 38.1,
      hydration: 40,
      connectedDevice: 'Medical Bio-Patch (95% 🔋)',
      stressLevel: 'High',
      sleepDuration: '4h 10m',
      riskLevel: 'Critical',
      heatStress: 94,
      healthScore: 54,
      lastActive: 'Just now',
      alert: 'Respiratory Distress & High Fever'
    }
  ],
  alerts: [
    { id: 'alt_1', userId: 'usr_sanjiv', category: 'Health', type: 'critical', title: 'Abnormal Heart Rate', message: 'Heart rate exceeded baseline during peak thermal hours.', status: 'ACTIVE', source: 'Apple Watch Ultra 2', timestamp: new Date(Date.now() - 600000).toISOString() },
    { id: 'alt_2', userId: 'usr_sanjiv', category: 'Environmental', type: 'warning', title: 'Heat Stress Warning', message: 'High outside temperature (38°C) detected in your zone.', status: 'ACTIVE', source: 'Micro-Weather Engine', timestamp: new Date(Date.now() - 2100000).toISOString() },
    { id: 'alt_3', userId: 'usr_sanjiv', category: 'Environmental', type: 'warning', title: 'Hazardous Air Quality', message: 'AQI increased to 142. Take precaution outdoors.', status: 'ACKNOWLEDGED', source: 'AQI Sensor', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: 'alt_4', userId: 'usr_sanjiv', category: 'Recovery', type: 'info', title: 'Health Indicators Restored', message: 'Hydration level improved after water intake.', status: 'RESOLVED', source: 'Hydration Monitor', timestamp: new Date(Date.now() - 14400000).toISOString() }
  ],
  notifications: [
    { id: 'notif_1', recipientId: 'usr_sanjiv', category: 'Critical', title: '🚨 Heat Stress Advisory', message: 'Ambient temperature reached 38°C. Stay hydrated.', read: false, createdAt: new Date(Date.now() - 600000).toISOString() },
    { id: 'notif_2', recipientId: 'usr_sanjiv', category: 'Health', title: '💧 Hydration Reminder', message: 'Drink 500ml water to meet your daily target.', read: true, createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: 'notif_3', recipientId: 'usr_sanjiv', category: 'Environmental', title: '🌫️ Air Quality Alert', message: 'AQI index elevated in Sector 4.', read: true, createdAt: new Date(Date.now() - 7200000).toISOString() }
  ],
  emergency_events: [
    { id: 'emg_1', userId: 'usr_sanjiv', patientName: 'Sanjiv Venkat', eventType: 'Fall Detected', triggerSource: 'Apple Watch Accelerometer', status: 'RESOLVED', location: 'Sector 4, Central Urban Hub', responseTime: '8s', timestamp: new Date(Date.now() - 86400000).toISOString() }
  ],
  emergency_contacts: [
    { id: 'cnt_1', userId: 'usr_sanjiv', name: 'Father', phone: '+91 98765 43210', relation: 'Primary Contact' },
    { id: 'cnt_2', userId: 'usr_sanjiv', name: 'Mother', phone: '+91 98765 43211', relation: 'Secondary Contact' },
    { id: 'cnt_3', userId: 'usr_sanjiv', name: 'Dr. Anita Roy', phone: '+91 94432 10987', relation: 'Cardiologist' }
  ],
  clinical_notes: [
    { id: 'note_1', patientId: 'PAT-101', doctorId: 'doc_anita', doctor: 'Dr. Anita Roy', date: '2026-09-02', text: 'Patient shows good response to hydration regimen. Recommend monitoring during midday heat.' },
    { id: 'note_2', patientId: 'PAT-101', doctorId: 'doc_anita', doctor: 'Dr. Vikram Patel', date: '2026-08-28', text: 'Baseline heart rate is slightly elevated during summer months. Edge AI tracking activated.' }
  ],
  audit_logs: [
    { id: 'aud_1', timestamp: new Date().toISOString(), actor: 'System AI Engine', action: 'Multi-factor risk diagnostic computed', details: 'Risk: 72/100 Moderate' },
    { id: 'aud_2', timestamp: new Date(Date.now() - 3600000).toISOString(), actor: 'usr_sanjiv', action: 'User login verified', details: 'Role: USER' },
    { id: 'aud_3', timestamp: new Date(Date.now() - 7200000).toISOString(), actor: 'Apple Watch Ultra 2', action: 'BLE Wearable Telemetry Ingested', details: 'HR: 82 BPM, SpO2: 98%, HRV: 68ms' }
  ],
  admin_stats: {
    totalUsers: 1248,
    activeUsers: 842,
    connectedDevicesCount: 924,
    activeWearableUsers: 780,
    highRiskUsers: 37,
    heatAlerts: 84,
    respiratoryAlerts: 52,
    sosEvents: 6,
    totalDoctors: 42,
  }
};

class DataStore {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to load db.json, re-initializing:', e.message);
    }
    this.save(initialData);
    return initialData;
  }

  save(dataToSave = this.data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf8');
    } catch (e) {
      console.error('Failed to write db.json:', e.message);
    }
  }

  get(key) {
    return this.data[key] || initialData[key];
  }

  set(key, value) {
    this.data[key] = value;
    this.save();
  }

  update(key, fn) {
    this.data[key] = fn(this.data[key] || initialData[key]);
    this.save();
  }
}

export const db = new DataStore();

export const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    dbMode = 'Demo JSON Store';
    console.log('ℹ️ MONGODB_URI not provided. Operating seamlessly in [Demo JSON Store] mode.');
    return { mode: dbMode, connected: false };
  }

  try {
    const startTime = Date.now();
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    isMongoConnected = true;
    dbMode = 'MongoDB';
    lastDbLatency = `${Date.now() - startTime}ms`;
    console.log('✅ Database connected successfully: MongoDB Enterprise cluster active.');
    return { mode: dbMode, connected: true };
  } catch (err) {
    isMongoConnected = false;
    dbMode = 'Demo JSON Store';
    console.warn(`⚠️ MongoDB connection failed (${err.message}). Defaulting to [Demo JSON Store] mode.`);
    return { mode: dbMode, connected: false, error: err.message };
  }
};

export const getDbStatus = () => ({
  mode: dbMode,
  isMongoConnected,
  latency: lastDbLatency,
  status: isMongoConnected ? 'Operational (MongoDB)' : 'Operational (Persistent JSON Store)',
  timestamp: new Date().toISOString()
});
