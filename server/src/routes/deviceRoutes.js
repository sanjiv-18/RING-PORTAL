import express from 'express';
import {
  getDevices,
  addDevice,
  updateDeviceStatus,
  syncDevice,
  deleteDevice
} from '../controllers/deviceController.js';

const router = express.Router();

router.get('/', getDevices);
router.post('/', addDevice);
router.put('/:id/status', updateDeviceStatus);
router.post('/:id/sync', syncDevice);
router.delete('/:id', deleteDevice);

export default router;
