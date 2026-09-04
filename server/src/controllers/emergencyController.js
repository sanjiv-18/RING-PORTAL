import { db } from '../config/db.js';

export const handleFallEmergency = (req, res) => {
  const newEvent = {
    id: `emg_${Date.now()}`,
    userId: req.user ? req.user.id : 'usr_sanjiv',
    patientName: req.user ? req.user.name : 'Sanjiv Venkat',
    eventType: 'Fall Detected',
    triggerSource: 'Accelerometer ML Model',
    status: 'ACTIVE_DISPATCH',
    location: 'Sector 4, Central Urban Hub',
    responseTime: '10s auto-dispatch',
    timestamp: new Date().toISOString()
  };

  db.update('emergency_events', events => [newEvent, ...events]);

  // Update Sanjiv in Patients roster to Critical
  db.update('patients', plist => plist.map(p => p.id === 'PAT-101' ? {
    ...p,
    riskLevel: 'Critical',
    alert: '🚨 EMERGENCY SOS ACTIVE — Fall Detected'
  } : p));

  // Update Admin Stats
  db.update('admin_stats', stats => ({
    ...stats,
    sosEvents: stats.sosEvents + 1,
    highRiskUsers: stats.highRiskUsers + 1
  }));

  // Create High-Severity Alert
  const newAlert = {
    id: `alt_${Date.now()}`,
    userId: 'usr_sanjiv',
    category: 'Emergency',
    type: 'critical',
    title: '🚨 FALL DETECTED — SOS DISPATCHED',
    message: 'High-impact accelerometer drop detected. Emergency contacts & 108 Paramedics notified.',
    status: 'ACTIVE',
    source: 'Accelerometer ML Model',
    timestamp: new Date().toISOString()
  };
  db.update('alerts', alist => [newAlert, ...alist]);

  // Log Audit Event
  db.update('audit_logs', logs => [
    {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'Fall ML Model',
      action: 'Emergency Fall Auto-SOS dispatched',
      details: 'Patient: Sanjiv Venkat, Location: Sector 4'
    },
    ...logs
  ]);

  res.status(201).json({
    message: 'Fall emergency event logged and SOS dispatched to paramedics',
    event: newEvent
  });
};

export const handleManualSos = (req, res) => {
  const { reason = 'Manual SOS Button Pressed by User' } = req.body;
  const newEvent = {
    id: `emg_${Date.now()}`,
    userId: req.user ? req.user.id : 'usr_sanjiv',
    patientName: req.user ? req.user.name : 'Sanjiv Venkat',
    eventType: 'Manual SOS',
    triggerSource: 'User UI Trigger',
    status: 'ACTIVE_DISPATCH',
    location: 'Sector 4, Central Urban Hub',
    responseTime: 'Instant',
    timestamp: new Date().toISOString()
  };

  db.update('emergency_events', events => [newEvent, ...events]);

  db.update('patients', plist => plist.map(p => p.id === 'PAT-101' ? {
    ...p,
    riskLevel: 'Critical',
    alert: `🚨 EMERGENCY SOS — ${reason}`
  } : p));

  db.update('admin_stats', stats => ({
    ...stats,
    sosEvents: stats.sosEvents + 1,
    highRiskUsers: stats.highRiskUsers + 1
  }));

  res.status(201).json({
    message: 'Manual SOS dispatched to emergency contacts & doctor portal',
    event: newEvent
  });
};

export const getEmergencyEvents = (req, res) => {
  const events = db.get('emergency_events') || [];
  res.json({ events });
};
