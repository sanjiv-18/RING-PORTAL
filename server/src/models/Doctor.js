import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  specialty: { type: String, default: 'Cardiology & Environmental Medicine' },
  licenseNumber: { type: String, default: 'MED-IND-2026-884' },
  assignedPatientIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  hospitalAffiliation: { type: String, default: 'Apollo Metro Cardiac Care' }
}, {
  timestamps: true
});

export const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
export default Doctor;
