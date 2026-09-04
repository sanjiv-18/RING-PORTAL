import mongoose from 'mongoose';

const emergencyEventSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  patientName: { type: String, required: true },
  eventType: { type: String, enum: ['Fall Detected', 'Manual SOS', 'Critical Cardiac SpO2 Alert'], required: true },
  triggerSource: { type: String, default: 'Accelerometer ML Model' },
  status: { type: String, enum: ['ACTIVE_DISPATCH', 'RESOLVED', 'FALSE_ALARM'], default: 'ACTIVE_DISPATCH' },
  location: { type: String, default: 'Sector 4, Central Urban Hub' },
  responseTime: { type: String, default: '10s auto-dispatch' },
  resolvedAt: { type: Date }
}, {
  timestamps: true
});

export const EmergencyEvent = mongoose.models.EmergencyEvent || mongoose.model('EmergencyEvent', emergencyEventSchema);
export default EmergencyEvent;
