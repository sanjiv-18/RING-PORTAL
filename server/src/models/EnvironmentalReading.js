import mongoose from 'mongoose';

const environmentalReadingSchema = new mongoose.Schema({
  outsideTemp: { type: Number, required: true },
  humidity: { type: Number, required: true },
  aqi: { type: Number, required: true },
  uvIndex: { type: Number, required: true },
  heatIndex: { type: Number, required: true },
  weatherCondition: { type: String, default: 'Very Hot & Humid' },
  pollutionLevel: { type: String, default: 'Unhealthy for Sensitive Groups' },
  zone: { type: String, default: 'Sector 4, Central Urban Hub' }
}, {
  timestamps: true
});

export const EnvironmentalReading = mongoose.models.EnvironmentalReading || mongoose.model('EnvironmentalReading', environmentalReadingSchema);
export default EnvironmentalReading;
