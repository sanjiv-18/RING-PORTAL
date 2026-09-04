import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  actor: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String },
  ipAddress: { type: String, default: '127.0.0.1' },
  status: { type: String, default: 'SUCCESS' }
}, {
  timestamps: true
});

export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
