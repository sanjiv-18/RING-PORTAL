import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  category: { type: String, enum: ['Health', 'Environmental', 'Emergency', 'Recovery', 'System'], default: 'Health' },
  type: { type: String, enum: ['critical', 'warning', 'info', 'success'], default: 'warning' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['DETECTED', 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'], default: 'ACTIVE' },
  source: { type: String, default: 'Telemetry Sensor' },
  acknowledgedAt: { type: Date },
  acknowledgedBy: { type: String },
  resolvedAt: { type: Date },
  resolvedBy: { type: String }
}, {
  timestamps: true
});

export const Alert = mongoose.models.Alert || mongoose.model('Alert', alertSchema);
export default Alert;
