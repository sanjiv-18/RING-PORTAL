import express from 'express';
import { db } from '../config/db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/doctor/patients
router.get('/patients', authenticateToken, requireRole('DOCTOR', 'ADMIN'), (req, res) => {
  const patients = db.get('patients');
  res.json({ patients });
});

// GET /api/doctor/patients/:id
router.get('/patients/:id', authenticateToken, requireRole('DOCTOR', 'ADMIN'), (req, res) => {
  const { id } = req.params;
  const patients = db.get('patients');
  const patient = patients.find(p => p.id === id || p.userId === id);
  
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const notes = (db.get('clinical_notes') || []).filter(n => n.patientId === patient.id);
  const vitals = db.get('health_readings');
  const baseline = db.get('health_baselines');
  const risk = db.get('risk_assessments');
  const env = db.get('environmental_readings');
  const alerts = (db.get('alerts') || []).filter(a => a.userId === patient.userId);
  const emergencyEvents = (db.get('emergency_events') || []).filter(e => e.userId === patient.userId);

  res.json({
    patient,
    vitals,
    baseline,
    risk,
    environment: env,
    alerts,
    emergencyEvents,
    clinicalNotes: notes
  });
});

// GET /api/doctor/alerts
router.get('/alerts', authenticateToken, requireRole('DOCTOR', 'ADMIN'), (req, res) => {
  const patients = db.get('patients');
  const highRiskPatients = patients.filter(p => p.riskLevel === 'High' || p.riskLevel === 'Critical');
  const alerts = db.get('alerts');

  res.json({
    highRiskPatients,
    alerts
  });
});

// POST /api/doctor/notes
router.post('/notes', authenticateToken, requireRole('DOCTOR', 'ADMIN'), (req, res) => {
  const { patientId = 'PAT-101', text } = req.body;
  if (!text) return res.status(400).json({ error: 'Note text is required' });

  const newNote = {
    id: `note_${Date.now()}`,
    patientId,
    doctorId: req.user ? req.user.id : 'doc_anita',
    doctor: req.user ? req.user.name : 'Dr. Anita Roy',
    date: new Date().toISOString().split('T')[0],
    text
  };

  db.update('clinical_notes', notes => [newNote, ...notes]);

  // Log Audit Entry
  db.update('audit_logs', logs => [
    {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: req.user ? req.user.name : 'Dr. Anita Roy',
      action: 'Doctor added clinical observation note',
      details: `Patient: ${patientId}`
    },
    ...logs
  ]);

  res.status(201).json({ message: 'Clinical note added successfully', note: newNote });
});

export default router;
