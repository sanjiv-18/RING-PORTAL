import express from 'express';
import {
  getCurrentWearable,
  syncWearableData,
  getWearableHistory,
  getWearableInsights,
  handleWearableFall
} from '../controllers/wearableController.js';

const router = express.Router();

router.get('/current', getCurrentWearable);
router.post('/sync', syncWearableData);
router.get('/history', getWearableHistory);
router.get('/insights', getWearableInsights);
router.post('/fall', handleWearableFall);

export default router;
