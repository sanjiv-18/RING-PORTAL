import mongoose from 'mongoose';

const clinicalNoteSchema = new mongoose.Schema({
  patientId: { type: String, required: true, index: true },
  doctorId: { type: String, required: true },
  doctor: { type: String, required: true },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  text: { type: String, required: true },
  category: { type: String, default: 'General Clinical Observation' }
}, {
  timestamps: true
});

export const ClinicalNote = mongoose.models.ClinicalNote || mongoose.model('ClinicalNote', clinicalNoteSchema);
export default ClinicalNote;
