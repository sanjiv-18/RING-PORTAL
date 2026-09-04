import mongoose from 'mongoose';

const healthReadingSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  heartRate: { type: Number, required: true, min: 30, max: 240 },
  spO2: { type: Number, required: true, min: 50, max: 100 },
  temp: { type: Number, required: true, min: 30.0, max: 45.0 },
  hydration: { type: Number, required: true, min: 0, max: 100 },
  activity: { type: Number, default: 6240 },
  sleep: { type: String, default: '7h 20m' },
  healthScore: { type: Number, default: 82, min: 0, max: 100 },
  statusText: { type: String, default: 'Your health condition is normal' },
  statusSeverity: { type: String, enum: ['normal', 'warning', 'critical'], default: 'normal' },
  readingSource: { type: String, default: 'Edge Sensor Telemetry' }
}, {
  timestamps: true
});

export const HealthReading = mongoose.models.HealthReading || mongoose.model('HealthReading', healthReadingSchema);
export default HealthReading;
