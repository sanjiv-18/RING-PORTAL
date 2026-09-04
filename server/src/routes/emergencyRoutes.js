import express from 'express';
import { handleFallEmergency, handleManualSos, getEmergencyEvents } from '../controllers/emergencyController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/fall', authenticateToken, handleFallEmergency);
router.post('/sos', authenticateToken, handleManualSos);
router.get('/events', authenticateToken, getEmergencyEvents);

export default router;
