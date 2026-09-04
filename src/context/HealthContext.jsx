import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

const HealthContext = createContext();

export const HealthProvider = ({ children }) => {
  // Navigation & Role State
  const [role, setRole] = useState('user'); // 'user' | 'doctor' | 'admin'
  const [userTab, setUserTab] = useState('dashboard');
  const [doctorTab, setDoctorTab] = useState('dashboard');
  const [adminTab, setAdminTab] = useState('overview');
  const [selectedPatientId, setSelectedPatientId] = useState('PAT-101');

  // Backend Connection & Database Status
  const [isBackendConnected, setIsBackendConnected] = useState(true);
  const [dbMode, setDbMode] = useState('Demo JSON Store');
  const [dbLatency, setDbLatency] = useState('2ms');
  const [loading, setLoading] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');

  // Active Simulation State
  const [activeSimulation, setActiveSimulation] = useState('normal');

  // User Vitals State
  const [vitals, setVitals] = useState({
    heartRate: 82,
    heartRateChange: '+0%',
    spO2: 97,
    spO2Change: '0%',
    temp: 36.8,
    tempChange: 'Optimal',
    hydration: 78,
    hydrationChange: 'Good',
    activity: 6240,
    sleep: '7h 20m',
    healthScore: 82,
    statusText: 'Your health condition is normal',
    statusSeverity: 'normal',
  });

  // IoT Connected Wearable Devices & Telemetry State
  const [devices, setDevices] = useState([]);
  const [activeDevice, setActiveDevice] = useState(null);
  const [wearableReading, setWearableReading] = useState({
    deviceId: 'dev_apple_watch',
    deviceName: 'Apple Watch Ultra 2',
    heartRate: 82,
    spo2: 98,
    temperature: 36.8,
    steps: 8500,
    calories: 620,
    stressLevel: 'Low',
    stressScore: 24,
    activityLevel: 'Moderate',
    hrv: 68,
    sleepData: {
      duration: '7h 20m',
      qualityScore: 85,
      deepSleepMinutes: 110,
      remSleepMinutes: 95,
      lightSleepMinutes: 235,
      awakeMinutes: 20
    },
    fallDetected: false,
    timestamp: new Date().toISOString()
  });
  const [wearableInsights, setWearableInsights] = useState([]);

  // Baseline Benchmark Data
  const [baseline, setBaseline] = useState({
    heartRate: { min: 72, max: 88, unit: 'BPM', average: 78 },
    spO2: { min: 95, max: 100, unit: '%', average: 97.5 },
    temp: { min: 36.5, max: 37.2, unit: '°C', average: 36.8 },
    hydration: { min: 60, max: 100, unit: '%', average: 80 },
    activity: { goal: 8000, average: 7400 },
    sleep: { target: '8h', average: '7.5h' }
  });

  // Environmental Metrics State
  const [environment, setEnvironment] = useState({
    outsideTemp: 38,
    humidity: 72,
    aqi: 142,
    uvIndex: 8,
    heatIndex: 43,
    weatherCondition: 'Very Hot & Humid',
    pollutionLevel: 'Unhealthy for Sensitive Groups',
    zone: 'Sector 4, Central Urban Hub'
  });

  // AI Risk Assessment Engine State
  const [aiRisk, setAiRisk] = useState({
    overallScore: 72,
    riskLevel: 'MODERATE RISK',
    confidenceScore: 89,
    heatStress: 72,
    dehydration: 61,
    fatigue: 48,
    respiratory: 24,
    cardiac: 12,
    whyText: 'High temperature + elevated heart rate + increased activity detected.',
    contributingFactors: [
      'Elevated heart rate (+10 BPM above baseline)',
      'High environmental temperature (38°C)',
      'High ambient humidity (72%)',
      'Hydration status at 78%'
    ],
    recommendedActions: [
      { id: 'rec_1', action: 'Hydrate', text: 'Drink 500ml water immediately', icon: 'Droplets', priority: 'High' },
      { id: 'rec_2', action: 'Move to Cooler Area', text: 'Seek air-conditioned shelter', icon: 'Thermometer', priority: 'High' },
      { id: 'rec_3', action: 'Rest', text: 'Rest for 15 minutes in shade', icon: 'Moon', priority: 'Medium' }
    ],
    disclaimer: 'Prototype AI Risk Assessment — Not a Medical Diagnosis'
  });

  // Emergency & Fall Detection State
  const [fallModalOpen, setFallModalOpen] = useState(false);
  const [fallTimer, setFallTimer] = useState(10);
  const [sosSent, setSosSent] = useState(false);
  const [emergencyEvents, setEmergencyEvents] = useState([]);

  // Emergency Contacts
  const [emergencyContacts, setEmergencyContacts] = useState([
    { name: 'Father', phone: '+91 98765 43210', relation: 'Primary Contact' },
    { name: 'Mother', phone: '+91 98765 43211', relation: 'Secondary Contact' },
    { name: 'Dr. Anita Roy', phone: '+91 94432 10987', relation: 'Cardiologist' }
  ]);

  // Notifications & Alerts Feeds
  const [notifications, setNotifications] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Doctor Patients State
  const [patients, setPatients] = useState([]);
  const [clinicalNotes, setClinicalNotes] = useState([]);

  // Admin Dashboard Statistics
  const [adminStats, setAdminStats] = useState({
    totalUsers: 1248,
    activeUsers: 842,
    highRiskUsers: 37,
    heatAlerts: 84,
    respiratoryAlerts: 52,
    sosEvents: 6,
    totalDoctors: 42,
  });

  const [systemServices, setSystemServices] = useState([
    { name: 'API Server', status: 'Operational', latency: '12ms' },
    { name: 'Database', status: 'Operational', latency: '4ms' },
    { name: 'IoT Telemetry Stream', status: 'Operational', latency: '18ms' },
    { name: 'AI Risk Engine', status: 'Operational', latency: '28ms' },
    { name: 'Simulation Engine', status: 'Operational', latency: '8ms' },
    { name: 'Notification Service', status: 'Operational', latency: '15ms' }
  ]);

  const [auditLogs, setAuditLogs] = useState([]);

  // FETCH ALL DATA FROM BACKEND REST API
  const fetchAllData = useCallback(async () => {
    try {
      const [
        statusRes,
        healthRes,
        envRes,
        aiRes,
        alertsRes,
        notifsRes,
        patientsRes,
        adminRes,
        notesRes,
        eventsRes,
        auditRes,
        devicesRes,
        wearableRes,
        insightsRes
      ] = await Promise.all([
        apiService.getSystemStatus().catch(() => null),
        apiService.getCurrentHealth(role).catch(() => null),
        apiService.getEnvironment(role).catch(() => null),
        apiService.getAiRisk(role).catch(() => null),
        apiService.getAlerts(role).catch(() => null),
        apiService.getNotifications(role).catch(() => null),
        apiService.getDoctorPatients().catch(() => null),
        apiService.getAdminStatistics().catch(() => null),
        apiService.getDoctorPatientDetails(selectedPatientId).catch(() => null),
        apiService.getEmergencyEvents(role).catch(() => null),
        apiService.getAdminAuditLogs().catch(() => null),
        apiService.getDevices(role).catch(() => null),
        apiService.getCurrentWearable(role).catch(() => null),
        apiService.getWearableInsights(role).catch(() => null)
      ]);

      if (statusRes) {
        if (statusRes.dbStatus) {
          setDbMode(statusRes.dbStatus.mode);
          setDbLatency(statusRes.dbStatus.latency);
        }
      }

      if (healthRes && healthRes.vitals) {
        setVitals(healthRes.vitals);
        if (healthRes.baseline) setBaseline(healthRes.baseline);
      }
      if (envRes && envRes.environment) {
        setEnvironment(envRes.environment);
      }
      if (aiRes && aiRes.assessment) {
        setAiRisk(aiRes.assessment);
      }
      if (alertsRes && alertsRes.alerts) {
        setAlerts(alertsRes.alerts);
      }
      if (notifsRes && notifsRes.notifications) {
        setNotifications(notifsRes.notifications);
      }
      if (patientsRes && patientsRes.patients) {
        setPatients(patientsRes.patients);
      }
      if (adminRes) {
        if (adminRes.statistics) setAdminStats(adminRes.statistics);
        if (adminRes.systemServices) setSystemServices(adminRes.systemServices);
      }
      if (notesRes && notesRes.clinicalNotes) {
        setClinicalNotes(notesRes.clinicalNotes);
      }
      if (eventsRes && eventsRes.events) {
        setEmergencyEvents(eventsRes.events);
      }
      if (auditRes && auditRes.auditLogs) {
        setAuditLogs(auditRes.auditLogs);
      }
      if (devicesRes && devicesRes.devices) {
        setDevices(devicesRes.devices);
        setActiveDevice(devicesRes.activeDevice || devicesRes.devices[0] || null);
      }
      if (wearableRes && wearableRes.reading) {
        setWearableReading(wearableRes.reading);
      }
      if (insightsRes && insightsRes.insights) {
        setWearableInsights(insightsRes.insights);
      }

      setIsBackendConnected(true);
      setLastSyncTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn('API polling update error:', err);
      setIsBackendConnected(false);
    } finally {
      setLoading(false);
    }
  }, [role, selectedPatientId]);

  // Initial fetch and 2-second background sync polling
  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 2000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  // Fall Detection Countdown Logic
  useEffect(() => {
    let timer;
    if (fallModalOpen && fallTimer > 0) {
      timer = setInterval(() => {
        setFallTimer(prev => prev - 1);
      }, 1000);
    } else if (fallModalOpen && fallTimer === 0) {
      triggerSosEmergency('Fall detected! No user response within 10 seconds.');
    }
    return () => clearInterval(timer);
  }, [fallModalOpen, fallTimer]);

  // SIMULATION HANDLERS
  const simulateHeatStress = async () => {
    setActiveSimulation('heat_stress');
    await apiService.triggerSimulation('heat-stress');
    await fetchAllData();
  };

  const simulateHighAQI = async () => {
    setActiveSimulation('high_aqi');
    await apiService.triggerSimulation('high-aqi');
    await fetchAllData();
  };

  const simulateHrIncrease = async () => {
    setActiveSimulation('hr_increase');
    await apiService.triggerSimulation('simulate-hr-increase');
    await fetchAllData();
  };

  const simulatePoorSleep = async () => {
    setActiveSimulation('poor_sleep');
    await apiService.triggerSimulation('simulate-poor-sleep');
    await fetchAllData();
  };

  const simulateDehydration = async () => {
    setActiveSimulation('dehydration');
    await apiService.triggerSimulation('simulate-dehydration');
    await fetchAllData();
  };

  const triggerFallSimulation = async () => {
    setActiveSimulation('fall_detected');
    setFallTimer(10);
    setFallModalOpen(true);
    setSosSent(false);
    await apiService.triggerSimulation('fall');
  };

  const normalizeVitals = async () => {
    setActiveSimulation('normal');
    await apiService.triggerSimulation('normalize');
    await fetchAllData();
  };

  const simulateBaselineShift = async () => {
    setActiveSimulation('baseline_shift');
    await apiService.triggerSimulation('baseline-shift');
    await fetchAllData();
  };

  const resetSimulation = async () => {
    setActiveSimulation('normal');
    setFallModalOpen(false);
    setSosSent(false);
    await apiService.triggerSimulation('reset');
    await fetchAllData();
  };

  // IOT WEARABLE DEVICE HANDLERS
  const pairDevice = async (deviceData) => {
    await apiService.addDevice(deviceData, role);
    await fetchAllData();
  };

  const updateDeviceStatus = async (id, statusData) => {
    await apiService.updateDeviceStatus(id, statusData, role);
    await fetchAllData();
  };

  const syncDevice = async (id) => {
    await apiService.syncDevice(id, role);
    await fetchAllData();
  };

  const removeDevice = async (id) => {
    await apiService.deleteDevice(id, role);
    await fetchAllData();
  };

  // EMERGENCY HANDLERS
  const triggerSosEmergency = async (reason = 'Manual SOS Alert Sent by User') => {
    setFallModalOpen(false);
    setSosSent(true);
    await apiService.triggerManualSos(reason);
    await fetchAllData();
  };

  // ALERT LIFECYCLE HANDLERS
  const acknowledgeAlert = async (id) => {
    await apiService.acknowledgeAlert(id, role);
    await fetchAllData();
  };

  const resolveAlert = async (id) => {
    await apiService.resolveAlert(id, role);
    await fetchAllData();
  };

  // DOCTOR CLINICAL NOTE
  const addClinicalNote = async (text, patientId = selectedPatientId) => {
    await apiService.addClinicalNote(patientId, text);
    await fetchAllData();
  };

  return (
    <HealthContext.Provider value={{
      role, setRole,
      userTab, setUserTab,
      doctorTab, setDoctorTab,
      adminTab, setAdminTab,
      selectedPatientId, setSelectedPatientId,
      isBackendConnected,
      dbMode,
      dbLatency,
      loading,
      lastSyncTime,
      activeSimulation,
      vitals, setVitals,
      baseline, setBaseline,
      environment, setEnvironment,
      aiRisk, setAiRisk,
      // IoT Wearables
      devices, setDevices,
      activeDevice, setActiveDevice,
      wearableReading, setWearableReading,
      wearableInsights,
      pairDevice,
      updateDeviceStatus,
      syncDevice,
      removeDevice,
      // Emergency & Others
      emergencyContacts,
      notifications, setNotifications,
      alerts, setAlerts,
      patients, setPatients,
      adminStats, setAdminStats,
      systemServices,
      auditLogs,
      clinicalNotes, addClinicalNote,
      emergencyEvents,
      fallModalOpen, setFallModalOpen,
      fallTimer, setFallTimer,
      sosSent, setSosSent,
      // Actions & Simulations
      simulateHeatStress,
      simulateHighAQI,
      simulateHrIncrease,
      simulatePoorSleep,
      simulateDehydration,
      triggerFallSimulation,
      normalizeVitals,
      simulateBaselineShift,
      resetSimulation,
      triggerSosEmergency,
      acknowledgeAlert,
      resolveAlert,
      fetchAllData
    }}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => useContext(HealthContext);
