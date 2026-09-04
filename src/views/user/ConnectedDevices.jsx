import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { 
  Watch, 
  Battery, 
  BatteryCharging, 
  RefreshCw, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Radio, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  X,
  Smartphone,
  CircleDot
} from 'lucide-react';

export const ConnectedDevices = () => {
  const { 
    devices, 
    activeDevice, 
    pairDevice, 
    updateDeviceStatus, 
    syncDevice, 
    removeDevice 
  } = useHealth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [syncingId, setSyncingId] = useState(null);
  const [formData, setFormData] = useState({
    deviceName: '',
    deviceType: 'Smart Watch',
    manufacturer: 'Apple',
    modelNumber: '',
    sensors: ['Optical Heart Rate (PPG)', 'SpO2 Pulse Oximeter', '3-Axis Accelerometer']
  });

  const availableDeviceTypes = [
    { type: 'Smart Watch', icon: Watch, popular: 'Apple Watch Ultra, Galaxy Watch 6' },
    { type: 'Smart Ring', icon: CircleDot, popular: 'Oura Ring Gen 3, Ultrahuman Ring Air' },
    { type: 'Fitness Band', icon: Activity, popular: 'Garmin Forerunner, Fitbit Charge 6' },
    { type: 'Medical Wearable', icon: Cpu, popular: 'Bio-Patch ECG, Continuous Pulse Monitor' }
  ];

  const handleSync = async (id) => {
    setSyncingId(id);
    try {
      await syncDevice(id);
    } finally {
      setTimeout(() => setSyncingId(null), 800);
    }
  };

  const handleToggleConnection = async (device) => {
    const newStatus = device.connectionStatus === 'CONNECTED' ? 'DISCONNECTED' : 'CONNECTED';
    await updateDeviceStatus(device.id || device._id, { connectionStatus: newStatus });
  };

  const handleSubmitNewDevice = async (e) => {
    e.preventDefault();
    if (!formData.deviceName.trim()) return;

    await pairDevice({
      deviceName: formData.deviceName,
      deviceType: formData.deviceType,
      manufacturer: formData.manufacturer,
      modelNumber: formData.modelNumber || undefined,
      sensorsEnabled: formData.sensors
    });

    setIsModalOpen(false);
    setFormData({
      deviceName: '',
      deviceType: 'Smart Watch',
      manufacturer: 'Apple',
      modelNumber: '',
      sensors: ['Optical Heart Rate (PPG)', 'SpO2 Pulse Oximeter', '3-Axis Accelerometer']
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Watch className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-white tracking-wide">Connected Wearable Devices</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              IoT Telemetry Engine
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Pair and manage continuous health streams from smart watches, fitness bands, smart rings, and clinical biosensors.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Pair New Device
        </button>
      </div>

      {/* Device Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {devices.map((device) => {
          const isConnected = device.connectionStatus === 'CONNECTED';
          const isSyncing = syncingId === (device.id || device._id);

          return (
            <div
              key={device.id || device._id}
              className={`bg-slate-900/80 border rounded-2xl p-5 transition relative overflow-hidden flex flex-col justify-between ${
                isConnected
                  ? 'border-teal-500/40 shadow-lg shadow-teal-950/40 ring-1 ring-teal-500/20'
                  : 'border-slate-800/80 opacity-80'
              }`}
            >
              {/* Active Indicator Top Glow */}
              {isConnected && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400" />
              )}

              <div>
                {/* Header Info */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl border ${
                      device.deviceType === 'Smart Ring' 
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
                        : device.deviceType === 'Fitness Band'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        : 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                    }`}>
                      {device.deviceType === 'Smart Ring' ? <CircleDot className="w-6 h-6" /> : <Watch className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">{device.deviceName}</h3>
                      <p className="text-[11px] text-slate-400">{device.manufacturer} • {device.deviceType}</p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    isConnected
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 animate-pulse'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {device.connectionStatus}
                  </span>
                </div>

                {/* Battery & Status Section */}
                <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 space-y-2.5 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      {device.isCharging ? (
                        <BatteryCharging className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Battery className={`w-4 h-4 ${device.batteryLevel < 20 ? 'text-rose-400' : 'text-emerald-400'}`} />
                      )}
                      Battery Status
                    </span>
                    <span className="font-bold text-white font-mono">{device.batteryLevel}% {device.isCharging ? '(Charging)' : ''}</span>
                  </div>

                  {/* Battery bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        device.batteryLevel < 20 
                          ? 'bg-rose-500' 
                          : device.batteryLevel < 50 
                          ? 'bg-amber-400' 
                          : 'bg-emerald-400'
                      }`}
                      style={{ width: `${device.batteryLevel}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                    <span>Firmware:</span>
                    <span className="font-mono text-slate-300">{device.firmwareVersion || 'v2.4.1'}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Last Synced:</span>
                    <span className="text-slate-300 font-mono">
                      {device.lastSyncTime ? new Date(device.lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Enabled Sensors List */}
                <div className="mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1.5">
                    Active Telemetry Sensors ({device.sensorsEnabled?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {device.sensorsEnabled?.map((sensor, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 text-[10px] border border-slate-700/60 font-medium"
                      >
                        {sensor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => handleToggleConnection(device)}
                  className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition border ${
                    isConnected
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      : 'bg-teal-600 hover:bg-teal-500 text-white border-teal-500'
                  }`}
                >
                  {isConnected ? 'Disconnect' : 'Connect'}
                </button>

                <button
                  onClick={() => handleSync(device.id || device._id)}
                  disabled={!isConnected || isSyncing}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 transition disabled:opacity-40"
                  title="Force telemetry synchronization"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
                </button>

                <button
                  onClick={() => removeDevice(device.id || device._id)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition"
                  title="Unpair device"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pair New Device Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                  <Watch className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">Pair Smart Wearable Device</h3>
                  <p className="text-xs text-slate-400">Discover and bind BLE or Cloud-synced health wearables</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewDevice} className="space-y-4 pt-4">
              {/* Device Category Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Wearable Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableDeviceTypes.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = formData.deviceType === cat.type;
                    return (
                      <button
                        type="button"
                        key={cat.type}
                        onClick={() => setFormData({ ...formData, deviceType: cat.type })}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition ${
                          isSelected
                            ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 ring-1 ring-teal-500/30'
                            : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-white">{cat.type}</div>
                          <div className="text-[9px] text-slate-500 truncate">{cat.popular}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Device Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Device Name / Model</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apple Watch Series 9, Oura Ring Gen 3"
                  value={formData.deviceName}
                  onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Manufacturer */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Manufacturer</label>
                  <select
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Apple">Apple Inc.</option>
                    <option value="Oura Health">Oura Health</option>
                    <option value="Garmin">Garmin Ltd.</option>
                    <option value="Fitbit / Google">Fitbit / Google</option>
                    <option value="Samsung">Samsung Electronics</option>
                    <option value="Whoop">Whoop Inc.</option>
                    <option value="Generic BioTech">Generic BioTech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Model Code (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. A2984 / HER-102"
                    value={formData.modelNumber}
                    onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 transition shadow-lg shadow-teal-500/20"
                >
                  Pair & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
