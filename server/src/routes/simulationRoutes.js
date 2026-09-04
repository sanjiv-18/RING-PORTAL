import express from 'express';
import { 
  simulateHeatStress, 
  simulateHighAqi, 
  simulateFall, 
  simulateHrIncrease,
  simulatePoorSleep,
  simulateDehydration,
  normalizeVitals, 
  simulateBaselineShift, 
  resetSimulation 
} from '../controllers/simulationController.js';

const router = express.Router();

router.post('/heat-stress', simulateHeatStress);
router.post('/high-aqi', simulateHighAqi);
router.post('/fall', simulateFall);
router.post('/simulate-hr-increase', simulateHrIncrease);
router.post('/simulate-poor-sleep', simulatePoorSleep);
router.post('/simulate-dehydration', simulateDehydration);
router.post('/normalize', normalizeVitals);
router.post('/baseline-shift', simulateBaselineShift);
router.post('/reset', resetSimulation);

export default router;
