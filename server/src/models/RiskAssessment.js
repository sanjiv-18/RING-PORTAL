import mongoose from 'mongoose';

const riskAssessmentSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  overallScore: { type: Number, required: true, min: 0, max: 100 },
  riskLevel: { type: String, enum: ['LOW RISK', 'MODERATE RISK', 'HIGH RISK', 'CRITICAL RISK'], default: 'MODERATE RISK' },
  confidenceScore: { type: Number, default: 89 },
  heatStress: { type: Number, default: 72 },
  dehydration: { type: Number, default: 61 },
  fatigue: { type: Number, default: 48 },
  respiratory: { type: Number, default: 24 },
  cardiac: { type: Number, default: 12 },
  whyText: { type: String, required: true },
  contributingFactors: [{ type: String }],
  recommendedActions: [{
    id: String,
    action: String,
    text: String,
    icon: String,
    priority: String
  }],
  disclaimer: { type: String, default: 'Prototype AI Risk Assessment — Not a Medical Diagnosis' }
}, {
  timestamps: true
});

export const RiskAssessment = mongoose.models.RiskAssessment || mongoose.model('RiskAssessment', riskAssessmentSchema);
export default RiskAssessment;
