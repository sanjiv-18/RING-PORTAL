import mongoose from 'mongoose';

const wearableDeviceSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  deviceName: { type: String, required: true },
  deviceType: { 
    type: String, 
    enum: ['Smart Watch', 'Smart Ring', 'Fitness Band', 'Medical Wearable'], 
    default: 'Smart Watch' 
  },
  manufacturer: { type: String, required: true }, // e.g., Apple, Samsung, Oura, Garmin, Fitbit, Noise
  modelNumber: { type: String, default: 'Gen-4 PRO' },
  connectionStatus: { 
    type: String, 
    enum: ['CONNECTED', 'DISCONNECTED', 'PAIRING', 'SYNCING'], 
    default: 'CONNECTED' 
  },
  batteryLevel: { type: Number, default: 88, min: 0, max: 100 },
  isCharging: { type: Boolean, default: false },
  firmwareVersion: { type: String, default: 'v4.2.1-BLE' },
  lastSyncTime: { type: Date, default: Date.now },
  sensorsEnabled: [{ type: String }], // ['Optical Heart Rate (PPG)', 'SpO2 Sensor', 'Skin Temperature', '3-Axis Accelerometer', 'ECG', 'EDA Stress']
}, {
  timestamps: true
});

export const WearableDevice = mongoose.models.WearableDevice || mongoose.model('WearableDevice', wearableDeviceSchema);
export default WearableDevice;
