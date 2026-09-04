import mongoose from 'mongoose';

const wearableReadingSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  deviceId: { type: String, required: true, index: true },
  deviceName: { type: String, default: 'Apple Watch Ultra 2' },
  heartRate: { type: Number, required: true },
  spo2: { type: Number, required: true },
  temperature: { type: Number, required: true },
  sleepData: {
    duration: { type: String, default: '7h 20m' },
    qualityScore: { type: Number, default: 85 }, // 0 - 100
    deepSleepMinutes: { type: Number, default: 110 },
    remSleepMinutes: { type: Number, default: 95 },
    lightSleepMinutes: { type: Number, default: 235 },
    awakeMinutes: { type: Number, default: 20 }
  },
  steps: { type: Number, default: 8500 },
  calories: { type: Number, default: 620 },
  stressLevel: { type: String, enum: ['Low', 'Moderate', 'High', 'Extreme'], default: 'Low' },
  stressScore: { type: Number, default: 24 }, // 0 - 100
  activityLevel: { type: String, enum: ['Sedentary', 'Light', 'Moderate', 'Active', 'High Intensity'], default: 'Moderate' },
  hrv: { type: Number, default: 68 }, // Heart Rate Variability (ms)
  fallDetected: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const WearableReading = mongoose.models.WearableReading || mongoose.model('WearableReading', wearableReadingSchema);
export default WearableReading;
