import mongoose from 'mongoose';

const emergencyContactSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  relation: { type: String, default: 'Emergency Contact' },
  isPrimary: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const EmergencyContact = mongoose.models.EmergencyContact || mongoose.model('EmergencyContact', emergencyContactSchema);
export default EmergencyContact;
