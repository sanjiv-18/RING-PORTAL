import express from 'express';
import { getCurrentHealth, getHealthHistory, postHealthReading } from '../controllers/healthController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/current', authenticateToken, getCurrentHealth);
router.get('/history', authenticateToken, getHealthHistory);
router.post('/readings', authenticateToken, postHealthReading);

export default router;
