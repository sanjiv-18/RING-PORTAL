import { db } from '../config/db.js';

// GET /api/devices - Get all connected wearable devices
export const getDevices = (req, res) => {
  const devices = db.get('wearable_devices') || [];
  const activeDevice = devices.find(d => d.connectionStatus === 'CONNECTED') || devices[0] || null;
  
  res.json({
    devices,
    totalDevices: devices.length,
    activeDevice,
    lastSyncTime: activeDevice ? activeDevice.lastSyncTime : new Date().toISOString()
  });
};

// POST /api/devices - Register/Add a new wearable device
export const addDevice = (req, res) => {
  const {
    deviceName,
    deviceType = 'Smart Watch',
    manufacturer = 'Generic HealthTech',
    modelNumber,
    sensorsEnabled = ['Optical Heart Rate (PPG)', 'SpO2 Pulse Oximeter', '3-Axis Accelerometer']
  } = req.body;

  if (!deviceName) {
    return res.status(400).json({ error: 'Device name is required' });
  }

  const newDevice = {
    _id: `dev_${Date.now()}`,
    id: `dev_${Date.now()}`,
    userId: req.user?.id || 'usr_sanjiv',
    deviceName,
    deviceType,
    manufacturer,
    modelNumber: modelNumber || `${deviceType.toUpperCase().replace(/\s+/g, '-')}-${Math.floor(1000 + Math.random() * 9000)}`,
    connectionStatus: 'CONNECTED',
    batteryLevel: Math.floor(75 + Math.random() * 25),
    isCharging: false,
    firmwareVersion: 'v2.4.1',
    lastSyncTime: new Date().toISOString(),
    sensorsEnabled,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.update('wearable_devices', (devices = []) => {
    return [...devices, newDevice];
  });

  // Log audit event
  db.update('audit_logs', (logs = []) => [
    {
      id: `log_${Date.now()}`,
      action: 'DEVICE_PAIRED',
      userId: req.user?.id || 'usr_sanjiv',
      details: `Paired new IoT device: ${newDevice.deviceName} (${newDevice.deviceType})`,
      timestamp: new Date().toISOString()
    },
    ...logs
  ]);

  res.status(201).json({
    message: 'Wearable device paired successfully',
    device: newDevice
  });
};

// PUT /api/devices/:id/status - Connect / Disconnect or update device
export const updateDeviceStatus = (req, res) => {
  const { id } = req.params;
  const { connectionStatus, batteryLevel, isCharging } = req.body;

  let updatedDevice = null;

  db.update('wearable_devices', (devices = []) => {
    return devices.map((dev) => {
      if (dev.id === id || dev._id === id) {
        updatedDevice = {
          ...dev,
          connectionStatus: connectionStatus !== undefined ? connectionStatus : dev.connectionStatus,
          batteryLevel: batteryLevel !== undefined ? batteryLevel : dev.batteryLevel,
          isCharging: isCharging !== undefined ? isCharging : dev.isCharging,
          lastSyncTime: connectionStatus === 'CONNECTED' ? new Date().toISOString() : dev.lastSyncTime,
          updatedAt: new Date().toISOString()
        };
        return updatedDevice;
      }
      return dev;
    });
  });

  if (!updatedDevice) {
    return res.status(404).json({ error: 'Device not found' });
  }

  res.json({
    message: `Device status updated to ${updatedDevice.connectionStatus}`,
    device: updatedDevice
  });
};

// POST /api/devices/:id/sync - Force sync device telemetry
export const syncDevice = (req, res) => {
  const { id } = req.params;
  let syncedDevice = null;

  db.update('wearable_devices', (devices = []) => {
    return devices.map((dev) => {
      if (dev.id === id || dev._id === id) {
        syncedDevice = {
          ...dev,
          connectionStatus: 'CONNECTED',
          lastSyncTime: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return syncedDevice;
      }
      return dev;
    });
  });

  if (!syncedDevice) {
    return res.status(404).json({ error: 'Device not found' });
  }

  res.json({
    message: 'Device synchronization successful',
    device: syncedDevice,
    syncTimestamp: new Date().toISOString()
  });
};

// DELETE /api/devices/:id - Unpair / Remove device
export const deleteDevice = (req, res) => {
  const { id } = req.params;
  let deleted = false;

  db.update('wearable_devices', (devices = []) => {
    const filtered = devices.filter(d => d.id !== id && d._id !== id);
    if (filtered.length !== devices.length) {
      deleted = true;
    }
    return filtered;
  });

  if (!deleted) {
    return res.status(404).json({ error: 'Device not found' });
  }

  res.json({ message: 'Device unpaired successfully', deviceId: id });
};
