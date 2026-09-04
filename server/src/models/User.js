import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['USER', 'DOCTOR', 'ADMIN'], default: 'USER' },
  age: { type: Number, default: 34 },
  gender: { type: String, default: 'Male' },
  height: { type: String, default: '178 cm' },
  weight: { type: String, default: '74 kg' },
  bloodType: { type: String, default: 'O+' },
  conditions: { type: String, default: 'Mild Seasonal Asthma, Heat Sensitivity' },
  locationPermission: { type: Boolean, default: true },
  dataSharing: { type: Boolean, default: false },
  notificationsEnabled: { type: Boolean, default: true },
  assignedDoctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
}, {
  timestamps: true
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
