import express from 'express';
import { db } from '../db.js';
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

  const notes = db.get('clinicalNotes').filter(n => n.patientId === patient.id);
  const vitals = db.get('healthReading');
  const baseline = db.get('healthBaseline');
  const risk = db.get('riskAssessment');

  res.json({
    patient,
    vitals,
    baseline,
    risk,
    clinicalNotes: notes
  });
});

// GET /api/doctor/alerts
router.get('/alerts', authenticateToken, requireRole('DOCTOR', 'ADMIN'), (req, res) => {
  const patients = db.get('patients');
  const highRiskPatients = patients.filter(p => p.riskLevel === 'High' || p.riskLevel === 'Critical');
  const systemAlerts = db.get('alerts');

  res.json({
    highRiskPatients,
    alerts: systemAlerts
  });
});

// POST /api/doctor/notes
router.post('/notes', authenticateToken, requireRole('DOCTOR', 'ADMIN'), (req, res) => {
  const { patientId = 'PAT-101', text } = req.body;
  if (!text) return res.status(400).json({ error: 'Note text is required' });

  const newNote = {
    id: `note_${Date.now()}`,
    patientId,
    doctor: req.user.name || 'Dr. Anita Roy',
    date: new Date().toISOString().split('T')[0],
    text
  };

  db.update('clinicalNotes', notes => [newNote, ...notes]);
  res.status(201).json({ message: 'Clinical note added', note: newNote });
});

export default router;
