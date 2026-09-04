import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipientId: { type: String, required: true, index: true },
  category: { type: String, enum: ['Critical', 'Warning', 'Health', 'Environmental', 'Emergency', 'Recovery', 'System'], default: 'Health' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  relatedEventId: { type: String },
  actionUrl: { type: String }
}, {
  timestamps: true
});

export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;
