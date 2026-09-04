import express from 'express';
import { getAdminStatistics, getSystemStatus, getAdminUsers, getAdminDoctors, getAuditLogs } from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/statistics', authenticateToken, requireRole('ADMIN'), getAdminStatistics);
router.get('/system-status', authenticateToken, requireRole('ADMIN'), getSystemStatus);
router.get('/users', authenticateToken, requireRole('ADMIN'), getAdminUsers);
router.get('/doctors', authenticateToken, requireRole('ADMIN'), getAdminDoctors);
router.get('/audit-logs', authenticateToken, requireRole('ADMIN'), getAuditLogs);

export default router;
