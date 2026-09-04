import mongoose from 'mongoose';

const healthBaselineSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  heartRate: {
    min: { type: Number, default: 72 },
    max: { type: Number, default: 88 },
    unit: { type: String, default: 'BPM' },
    average: { type: Number, default: 78 }
  },
  spO2: {
    min: { type: Number, default: 95 },
    max: { type: Number, default: 100 },
    unit: { type: String, default: '%' },
    average: { type: Number, default: 97.5 }
  },
  temp: {
    min: { type: Number, default: 36.5 },
    max: { type: Number, default: 37.2 },
    unit: { type: String, default: '°C' },
    average: { type: Number, default: 36.8 }
  },
  hydration: {
    min: { type: Number, default: 60 },
    max: { type: Number, default: 100 },
    unit: { type: String, default: '%' },
    average: { type: Number, default: 80 }
  },
  activity: {
    goal: { type: Number, default: 8000 },
    average: { type: Number, default: 7400 }
  },
  sleep: {
    target: { type: String, default: '8h' },
    average: { type: String, default: '7.5h' }
  },
  calibratedDays: { type: Number, default: 30 }
}, {
  timestamps: true
});

export const HealthBaseline = mongoose.models.HealthBaseline || mongoose.model('HealthBaseline', healthBaselineSchema);
export default HealthBaseline;
