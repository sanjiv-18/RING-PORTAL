import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

// Mongoose Models
import User from './models/User.js';
import Doctor from './models/Doctor.js';
import HealthReading from './models/HealthReading.js';
import HealthBaseline from './models/HealthBaseline.js';
import EnvironmentalReading from './models/EnvironmentalReading.js';
import RiskAssessment from './models/RiskAssessment.js';
import Alert from './models/Alert.js';
import Notification from './models/Notification.js';
import EmergencyContact from './models/EmergencyContact.js';
import EmergencyEvent from './models/EmergencyEvent.js';
import ClinicalNote from './models/ClinicalNote.js';
import AuditLog from './models/AuditLog.js';
import WearableDevice from './models/WearableDevice.js';
import WearableReading from './models/WearableReading.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthguard';

export const seedDatabase = async () => {
  console.log('🌱 Starting HealthGuard AI Database Seeding process...');

  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
      console.log(`✅ Connected to MongoDB at ${MONGODB_URI}`);
    }

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Doctor.deleteMany({}),
      HealthReading.deleteMany({}),
      HealthBaseline.deleteMany({}),
      EnvironmentalReading.deleteMany({}),
      RiskAssessment.deleteMany({}),
      Alert.deleteMany({}),
      Notification.deleteMany({}),
      EmergencyContact.deleteMany({}),
      EmergencyEvent.deleteMany({}),
      ClinicalNote.deleteMany({}),
      AuditLog.deleteMany({}),
      WearableDevice.deleteMany({}),
      WearableReading.deleteMany({})
    ]);

    console.log('🧹 Cleared existing database records.');

    // 1. Password Hashes
    const userPasswordHash = await bcrypt.hash('User@123456', 10);
    const doctorPasswordHash = await bcrypt.hash('Doctor@123456', 10);
    const adminPasswordHash = await bcrypt.hash('Admin@123456', 10);

    // 2. Create Users & Admin
    const sanjivUser = await User.create({
      name: 'Sanjiv Venkat',
      email: 'sanjiv@healthguard.ai',
      passwordHash: userPasswordHash,
      role: 'USER',
      age: 34,
      gender: 'Male',
      height: '178 cm',
      weight: '74 kg',
      bloodType: 'O+',
      conditions: 'Mild Seasonal Asthma, Heat Sensitivity',
      locationPermission: true,
      dataSharing: false,
      notificationsEnabled: true
    });

    const priyaUser = await User.create({
      name: 'Priya Sharma',
      email: 'priya@healthguard.ai',
      passwordHash: userPasswordHash,
      role: 'USER',
      age: 28,
      gender: 'Female',
      height: '165 cm',
      weight: '58 kg',
      bloodType: 'A+',
      conditions: 'Dust Allergy'
    });

    const rajeshUser = await User.create({
      name: 'Rajesh Kumar',
      email: 'rajesh@healthguard.ai',
      passwordHash: userPasswordHash,
      role: 'USER',
      age: 52,
      gender: 'Male',
      height: '172 cm',
      weight: '82 kg',
      bloodType: 'B+',
      conditions: 'Hypertension, Mild Heat Intolerance'
    });

    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@healthguard.ai',
      passwordHash: adminPasswordHash,
      role: 'ADMIN'
    });

    const doctorUser = await User.create({
      name: 'Dr. Anita Roy',
      email: 'dr.anita@healthguard.ai',
      passwordHash: doctorPasswordHash,
      role: 'DOCTOR'
    });

    const doctorUser2 = await User.create({
      name: 'Dr. Vikram Seth',
      email: 'dr.vikram@healthguard.ai',
      passwordHash: doctorPasswordHash,
      role: 'DOCTOR'
    });

    // 3. Create Doctor Roster Records
    const doctorRecord = await Doctor.create({
      userId: doctorUser._id,
      name: 'Dr. Anita Roy',
      specialty: 'Cardiology & Environmental Medicine',
      licenseNumber: 'MED-IND-2026-884',
      assignedPatientIds: [sanjivUser._id, priyaUser._id, rajeshUser._id],
      hospitalAffiliation: 'Apollo Metro Cardiac Care'
    });

    await Doctor.create({
      userId: doctorUser2._id,
      name: 'Dr. Vikram Seth',
      specialty: 'Pulmonology & Respiratory Care',
      licenseNumber: 'MED-IND-2026-912',
      assignedPatientIds: [priyaUser._id],
      hospitalAffiliation: 'Central City Hospital'
    });

    // Assign doctorId back to User
    sanjivUser.assignedDoctorId = doctorRecord._id;
    await sanjivUser.save();

    // 4. Seed Health Baseline
    await HealthBaseline.create({
      userId: sanjivUser._id.toString(),
      heartRate: { min: 72, max: 88, unit: 'BPM', average: 78 },
      spO2: { min: 95, max: 100, unit: '%', average: 97.5 },
      temp: { min: 36.5, max: 37.2, unit: '°C', average: 36.8 },
      hydration: { min: 60, max: 100, unit: '%', average: 80 },
      activity: { goal: 8000, average: 7400 },
      sleep: { target: '8h', average: '7.5h' },
      isCalculated: true,
      lastUpdated: new Date()
    });

    // 5. Seed Health Readings
    await HealthReading.create({
      userId: sanjivUser._id.toString(),
      heartRate: 82,
      spO2: 97,
      temp: 36.8,
      hydration: 78,
      activity: 8500,
      sleep: '7h 20m',
      healthScore: 82,
      statusText: 'Your health condition is normal',
      statusSeverity: 'normal',
      readingSource: 'IoT Smart Wearable PPG'
    });

    // 6. Seed Environmental Telemetry
    await EnvironmentalReading.create({
      userId: sanjivUser._id.toString(),
      outsideTemp: 38,
      humidity: 72,
      aqi: 142,
      uvIndex: 8,
      heatIndex: 43,
      weatherCondition: 'Very Hot & Humid',
      pollutionLevel: 'Unhealthy for Sensitive Groups',
      zone: 'Sector 4, Central Urban Hub'
    });

    // 7. Seed AI Risk Assessment
    await RiskAssessment.create({
      userId: sanjivUser._id.toString(),
      overallScore: 72,
      riskLevel: 'MODERATE RISK',
      confidenceScore: 92,
      heatStress: 72,
      dehydration: 61,
      fatigue: 48,
      respiratory: 24,
      cardiac: 12,
      whyText: 'Elevated temperature (38°C) + elevated heart rate (+10 BPM) + high humidity (72%) detected.',
      contributingFactors: [
        'Elevated heart rate (+10 BPM above baseline)',
        'High environmental temperature (38°C)',
        'High ambient humidity (72%)',
        'Hydration status at 78%'
      ],
      recommendedActions: [
        { id: 'rec_1', action: 'Hydrate Immediately', text: 'Drink 500ml electrolyte solution', icon: 'Droplets', priority: 'High' },
        { id: 'rec_2', action: 'Cooling Shelter', text: 'Seek air-conditioned room', icon: 'Thermometer', priority: 'High' }
      ],
      disclaimer: 'Prototype AI Risk Assessment — Not a Medical Diagnosis'
    });

    // 8. Seed Wearables
    const appleWatch = await WearableDevice.create({
      userId: sanjivUser._id.toString(),
      deviceName: 'Apple Watch Ultra 2',
      deviceType: 'Smart Watch',
      manufacturer: 'Apple Inc.',
      modelNumber: 'A2986 (Cellular + GPS)',
      connectionStatus: 'CONNECTED',
      batteryLevel: 88,
      isCharging: false,
      firmwareVersion: 'watchOS 10.4',
      lastSyncTime: new Date(),
      sensorsEnabled: ['Optical Heart Rate (PPG)', 'SpO2 Sensor', 'Skin Temperature', 'Fall Detection Accelerometer', 'ECG Sensor']
    });

    await WearableDevice.create({
      userId: sanjivUser._id.toString(),
      deviceName: 'Oura Ring Gen 3 Horizon',
      deviceType: 'Smart Ring',
      manufacturer: 'Oura Health',
      modelNumber: 'HERO-SILVER-10',
      connectionStatus: 'CONNECTED',
      batteryLevel: 74,
      isCharging: false,
      firmwareVersion: 'v2.9.22',
      lastSyncTime: new Date(),
      sensorsEnabled: ['Infrared PPG', 'Negative Temperature Coefficient (NTC)', '3D Accelerometer', 'Sleep Staging AI']
    });

    await WearableReading.create({
      userId: sanjivUser._id.toString(),
      deviceId: appleWatch._id.toString(),
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
      timestamp: new Date()
    });

    // 9. Seed Alerts & Notifications
    await Alert.create({
      userId: sanjivUser._id.toString(),
      type: 'warning',
      category: 'Environmental',
      title: '🔥 Heat Index Surge Warning',
      message: 'Apparent temperature reached 43°C in Sector 4 zone.',
      status: 'ACTIVE',
      source: 'AI Predictive Engine'
    });

    await Notification.create({
      recipientId: sanjivUser._id.toString(),
      recipientRole: 'USER',
      category: 'Weather Alert',
      title: '🔥 Heat Index Surge',
      message: 'Outdoor heat index reached 43°C. Take frequent cooling breaks.',
      read: false
    });

    // 10. Seed Emergency Contacts
    await EmergencyContact.create({
      userId: sanjivUser._id.toString(),
      name: 'Father (Ramesh Venkat)',
      phone: '+91 98765 43210',
      relationship: 'Primary Contact',
      priority: 1
    });

    // 11. Seed Clinical Note
    await ClinicalNote.create({
      doctorId: doctorUser._id.toString(),
      patientId: sanjivUser._id.toString(),
      doctorName: 'Dr. Anita Roy',
      noteText: 'Patient exhibits mild heat sensitivity during high ambient humidity (>70%). Recommended electrolyte rehydration therapy.',
      createdAt: new Date()
    });

    // 12. Seed Audit Log
    await AuditLog.create({
      actor: 'System Auto-Seed',
      actorRole: 'SYSTEM',
      action: 'DATABASE_SEEDED',
      details: 'HealthGuard AI database successfully populated with full-stack enterprise test dataset.'
    });

    console.log('✅ HealthGuard AI Database Seeding Completed Successfully!');
    console.log('----------------------------------------------------');
    console.log('🔑 Seed Credentials for Testing:');
    console.log('   User:   sanjiv@healthguard.ai  /  User@123456');
    console.log('   Doctor: dr.anita@healthguard.ai /  Doctor@123456');
    console.log('   Admin:  admin@healthguard.ai    /  Admin@123456');
    console.log('----------------------------------------------------');

  } catch (error) {
    console.error('❌ Database Seeding Error:', error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB.');
    }
  }
};

// Execute if run directly
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase().then(() => process.exit(0));
}
