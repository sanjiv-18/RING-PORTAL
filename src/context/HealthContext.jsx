import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const HealthContext = createContext();

export const HealthProvider = ({ children }) => {
  // Navigation & Role State
  const [role, setRole] = useState('user'); // 'user' | 'doctor' | 'admin'
  const [userTab, setUserTab] = useState('dashboard');
  const [doctorTab, setDoctorTab] = useState('dashboard');
  const [adminTab, setAdminTab] = useState('overview');
  const [selectedPatientId, setSelectedPatientId] = useState('PAT-101');

  // Backend Connection Status
  const [isBackendConnected, setIsBackendConnected] = useState(true);
  const [loading, setLoading] = useState(true);

  // Simulation Preset State
  const [activeSimulation, setActiveSimulation] = useState('normal');

  // User Vitals State
  const [vitals, setVitals] = useState({
    heartRate: 82,
    spO2: 97,
    temp: 36.8,
    hydration: 78,
    activity: 6240,
    sleep: '7h 20m',
    healthScore: 82,
    statusText: 'Your health condition is normal',
    statusSeverity: 'normal',
  });

  // Baseline Benchmark Data
  const [baseline, setBaseline] = useState({
    heartRate: { min: 72, max: 88, unit: 'BPM' },
    spO2: { min: 95, max: 100, unit: '%' },
    temp: { min: 36.5, max: 37.2, unit: '°C' },
    hydration: { min: 60, max: 100, unit: '%' },
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
  });

  // AI Risk Assessment Engine State
  const [aiRisk, setAiRisk] = useState({
    overallScore: 72,
    riskLevel: 'MODERATE RISK',
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
      'Hydration level at 78%'
    ],
    recommendedActions: [
      { id: 'rec_1', action: 'Hydrate', text: 'Drink 500ml water immediately', icon: 'Droplets' },
      { id: 'rec_2', action: 'Move to Cooler Area', text: 'Seek air-conditioned shelter', icon: 'Thermometer' },
      { id: 'rec_3', action: 'Rest', text: 'Rest for 15 minutes in shade', icon: 'Moon' }
    ]
  });

  // Emergency & Fall Detection State
  const [fallModalOpen, setFallModalOpen] = useState(false);
  const [fallTimer, setFallTimer] = useState(10);
  const [sosSent, setSosSent] = useState(false);
  const [emergencyEvents, setEmergencyEvents] = useState([]);

  // Emergency Contacts
  const [emergencyContacts] = useState([
    { name: 'Father', phone: '+91 98765 43210', relation: 'Primary Contact' },
    { name: 'Mother', phone: '+91 98765 43211', relation: 'Secondary Contact' },
    { name: 'Dr. Anita Roy', phone: '+91 94432 10987', relation: 'Cardiologist' }
  ]);

  // Notifications Feed
  const [notifications, setNotifications] = useState([]);

  // Doctor Patients State
  const [patients, setPatients] = useState([]);
  const [clinicalNotes, setClinicalNotes] = useState([]);

  // Admin Dashboard Global Statistics
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
    { name: 'AI Risk Engine', status: 'Operational', latency: '28ms' },
    { name: 'Simulation Engine', status: 'Operational', latency: '8ms' },
    { name: 'Notification Service', status: 'Operational', latency: '15ms' }
  ]);

  // FETCH ALL DATA FROM EXPRESS REST API
  const fetchAllData = useCallback(async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'x-demo-role': role.toUpperCase()
      };

      // Concurrent REST API calls
      const [
        healthRes,
        envRes,
        aiRes,
        alertsRes,
        patientsRes,
        adminRes,
        notesRes,
        eventsRes
      ] = await Promise.all([
        fetch('/api/health/current', { headers }).then(r => r.ok ? r.json() : null),
        fetch('/api/environment/current', { headers }).then(r => r.ok ? r.json() : null),
        fetch('/api/ai/risk', { headers }).then(r => r.ok ? r.json() : null),
        fetch('/api/alerts', { headers }).then(r => r.ok ? r.json() : null),
        fetch('/api/doctor/patients', { headers: { ...headers, 'x-demo-role': 'DOCTOR' } }).then(r => r.ok ? r.json() : null),
        fetch('/api/admin/statistics', { headers: { ...headers, 'x-demo-role': 'ADMIN' } }).then(r => r.ok ? r.json() : null),
        fetch('/api/doctor/patients/PAT-101', { headers: { ...headers, 'x-demo-role': 'DOCTOR' } }).then(r => r.ok ? r.json() : null),
        fetch('/api/emergency/events', { headers }).then(r => r.ok ? r.json() : null)
      ]);

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
        setNotifications(alertsRes.alerts);
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

      setIsBackendConnected(true);
    } catch (err) {
      console.warn('Backend polling error:', err);
      setIsBackendConnected(false);
    } finally {
      setLoading(false);
    }
  }, [role]);

  // Initial fetch and 2-second background sync polling
  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 2000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  // Handle Fall Detection Timer Countdown
  useEffect(() => {
    let timer;
    if (fallModalOpen && fallTimer > 0) {
      timer = setInterval(() => {
        setFallTimer(prev => prev - 1);
      }, 1000);
    } else if (fallModalOpen && fallTimer === 0) {
      triggerSosEmergency('Fall detected! No response from user within 10 seconds.');
    }
    return () => clearInterval(timer);
  }, [fallModalOpen, fallTimer]);

  // REST API SIMULATION CONTROLLERS
  const triggerSimulationEndpoint = async (endpoint, presetName) => {
    setActiveSimulation(presetName);
    try {
      const res = await fetch(`/api/simulation/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (err) {
      console.error(`Simulation API error (${endpoint}):`, err);
    }
  };

  const simulateHeatStress = () => triggerSimulationEndpoint('heat-stress', 'heat_stress');
  const simulateHighAQI = () => triggerSimulationEndpoint('high-aqi', 'high_aqi');
  const triggerFallSimulation = () => {
    triggerSimulationEndpoint('fall', 'fall_detected');
    setFallTimer(10);
    setFallModalOpen(true);
    setSosSent(false);
  };
  const normalizeVitals = () => triggerSimulationEndpoint('normalize', 'normal');
  const simulateBaselineShift = () => triggerSimulationEndpoint('baseline-shift', 'baseline_shift');
  const resetSimulation = () => triggerSimulationEndpoint('reset', 'normal');

  // REST API EMERGENCY CONTROLLERS
  const triggerSosEmergency = async (reason = 'Manual SOS Alert Sent by User') => {
    setFallModalOpen(false);
    setSosSent(true);

    try {
      const res = await fetch('/api/emergency/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (err) {
      console.error('Emergency SOS API error:', err);
    }
  };

  const addClinicalNote = async (text, patientId = 'PAT-101') => {
    try {
      const res = await fetch('/api/doctor/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-demo-role': 'DOCTOR'
        },
        body: JSON.stringify({ patientId, text })
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (err) {
      console.error('Add clinical note error:', err);
    }
  };

  return (
    <HealthContext.Provider value={{
      role, setRole,
      userTab, setUserTab,
      doctorTab, setDoctorTab,
      adminTab, setAdminTab,
      selectedPatientId, setSelectedPatientId,
      isBackendConnected,
      loading,
      activeSimulation,
      vitals, setVitals,
      baseline, setBaseline,
      environment, setEnvironment,
      aiRisk, setAiRisk,
      emergencyContacts,
      notifications, setNotifications,
      patients, setPatients,
      adminStats, setAdminStats,
      systemServices,
      clinicalNotes, addClinicalNote,
      emergencyEvents,
      fallModalOpen, setFallModalOpen,
      fallTimer, setFallTimer,
      sosSent, setSosSent,
      // API Simulation triggers
      simulateHeatStress,
      simulateHighAQI,
      triggerFallSimulation,
      normalizeVitals,
      simulateBaselineShift,
      resetSimulation,
      triggerSosEmergency,
      fetchAllData
    }}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => useContext(HealthContext);
