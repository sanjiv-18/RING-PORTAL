import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Advanced Initial Seed Data
const initialData = {
  users: [
    {
      id: 'usr_sanjiv',
      name: 'Sanjiv Venkat',
      email: 'sanjiv@healthguard.ai',
      role: 'USER',
      passwordHash: '$2a$10$wT6qL...hashed_password_demo',
      age: 34,
      gender: 'Male',
      height: '178 cm',
      weight: '74 kg',
      bloodType: 'O+',
      conditions: 'Mild Seasonal Asthma, Heat Sensitivity',
      locationPermission: true,
      dataSharing: false,
      notificationsEnabled: true,
      createdAt: '2026-01-15T10:00:00.000Z',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'doc_anita',
      name: 'Dr. Anita Roy',
      email: 'dr.anita@healthguard.ai',
      role: 'DOCTOR',
      specialty: 'Cardiology & Environmental Medicine',
      createdAt: '2026-01-10T09:00:00.000Z',
      updatedAt: new Date().toISOString()
    },
    {
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
  health_readings: {
    heartRate: 82,
    heartRateChange: '+0%',
    spO2: 97,
    spO2Change: '0%',
    temp: 36.8,
    tempChange: 'Optimal',
    hydration: 78,
    hydrationChange: 'Good',
    activity: 6240,
    sleep: '7h 20m',
    healthScore: 82,
    statusText: 'Your health condition is normal',
    statusSeverity: 'normal',
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  health_baselines: {
    heartRate: { min: 72, max: 88, unit: 'BPM', average: 78 },
    spO2: { min: 95, max: 100, unit: '%', average: 97.5 },
    temp: { min: 36.5, max: 37.2, unit: '°C', average: 36.8 },
    hydration: { min: 60, max: 100, unit: '%', average: 80 },
    activity: { goal: 8000, average: 7400 },
    sleep: { target: '8h', average: '7.5h' }
  },
  environmental_readings: {
    outsideTemp: 38,
    humidity: 72,
    aqi: 142,
    uvIndex: 8,
    heatIndex: 43,
    weatherCondition: 'Very Hot & Humid',
    pollutionLevel: 'Unhealthy for Sensitive Groups',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  risk_assessments: {
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
      spO2: 97,
      temp: 36.8,
      hydration: 78,
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
      riskLevel: 'Critical',
      heatStress: 94,
      healthScore: 54,
      lastActive: 'Just now',
      alert: 'Respiratory Distress & High Fever'
    }
  ],
  alerts: [
    { id: 'alt_1', category: 'Health', type: 'critical', title: 'Abnormal Heart Rate', message: 'Heart rate exceeded baseline during peak thermal hours.', status: 'ACTIVE', source: 'Telemetry Sensor', timestamp: new Date(Date.now() - 600000).toISOString() },
    { id: 'alt_2', category: 'Environmental', type: 'warning', title: 'Heat Stress Warning', message: 'High outside temperature (38°C) detected in your zone.', status: 'ACTIVE', source: 'Micro-Weather Engine', timestamp: new Date(Date.now() - 2100000).toISOString() },
    { id: 'alt_3', category: 'Environmental', type: 'warning', title: 'Hazardous Air Quality', message: 'AQI increased to 142. Take precaution outdoors.', status: 'ACKNOWLEDGED', source: 'AQI Sensor', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: 'alt_4', category: 'Recovery', type: 'info', title: 'Health Indicators Restored', message: 'Hydration level improved after water intake.', status: 'RESOLVED', source: 'Hydration Monitor', timestamp: new Date(Date.now() - 14400000).toISOString() }
  ],
  emergency_events: [
    { id: 'emg_1', userId: 'usr_sanjiv', patientName: 'Sanjiv Venkat', type: 'Fall Detected', status: 'RESOLVED', timestamp: new Date(Date.now() - 86400000).toISOString(), location: 'Sector 4, Central Urban Hub' }
  ],
  privacy_audit_logs: [
    { id: 'prv_1', timestamp: new Date().toISOString(), action: 'On-device local risk inference executed', details: 'Zero cloud data transmitted' },
    { id: 'prv_2', timestamp: new Date(Date.now() - 3600000).toISOString(), action: 'Location permission requested for micro-weather', details: 'Permission granted locally' }
  ],
  clinical_notes: [
    { id: 'note_1', patientId: 'PAT-101', doctor: 'Dr. Anita Roy', date: '2026-09-02', text: 'Patient shows good response to hydration regimen. Recommend monitoring during midday heat.' },
    { id: 'note_2', patientId: 'PAT-101', doctor: 'Dr. Vikram Patel', date: '2026-08-28', text: 'Baseline heart rate is slightly elevated during summer months. Edge AI tracking activated.' }
  ],
  admin_stats: {
    totalUsers: 1248,
    activeUsers: 842,
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

export const connectMongo = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('ℹ️ MONGODB_URI not set. Operating with persistent JSON Data Store.');
    return;
  }
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB database successfully.');
  } catch (err) {
    console.warn('⚠️ MongoDB connection failed. Operating with persistent JSON Data Store fallback:', err.message);
  }
};
