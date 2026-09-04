import express from 'express';
import { 
  simulateHeatStress, 
  simulateHighAqi, 
  simulateFall, 
  normalizeVitals, 
  simulateBaselineShift, 
  resetSimulation 
} from '../controllers/simulationController.js';

const router = express.Router();

router.post('/heat-stress', simulateHeatStress);
router.post('/high-aqi', simulateHighAqi);
router.post('/fall', simulateFall);
router.post('/normalize', normalizeVitals);
router.post('/baseline-shift', simulateBaselineShift);
router.post('/reset', resetSimulation);

export default router;
