import { db, getDbStatus } from '../config/db.js';

export const getAdminStatistics = (req, res) => {
  const stats = db.get('admin_stats');
  const alerts = db.get('alerts');
  const dbStatus = getDbStatus();

  res.json({
    statistics: stats,
    systemServices: [
      { name: 'API Server', status: 'Operational', latency: '12ms' },
      { name: 'Database', status: dbStatus.status, latency: dbStatus.latency },
      { name: 'AI Risk Engine', status: 'Operational', latency: '28ms' },
      { name: 'Simulation Engine', status: 'Operational', latency: '8ms' },
      { name: 'Notification Service', status: 'Operational', latency: '15ms' }
    ],
    dbStatus,
    recentEvents: alerts.slice(0, 6)
  });
};

export const getSystemStatus = (req, res) => {
  const dbStatus = getDbStatus();
  res.json({
    system: 'HEALTHGUARD AI Enterprise Engine',
    uptime: process.uptime(),
    dbStatus,
    timestamp: new Date().toISOString()
  });
};

export const getAdminUsers = (req, res) => {
  const users = db.get('users');
  res.json({ users });
};

export const getAdminDoctors = (req, res) => {
  const users = db.get('users').filter(u => u.role === 'DOCTOR');
  res.json({ doctors: users });
};

export const getAuditLogs = (req, res) => {
  const logs = db.get('audit_logs') || [];
  res.json({ auditLogs: logs });
};
