/**
 * Centralized HealthGuard API Service Client
 * Handles headers, role injection, timeout resilience, and unified responses.
 */

const API_BASE = '/api';

const fetchWithTimeout = async (url, options = {}, timeout = 6000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export const apiService = {
  getHeaders: (role = 'USER') => ({
    'Content-Type': 'application/json',
    'x-demo-role': role.toUpperCase()
  }),

  // System & Health Status
  async getSystemStatus() {
    const res = await fetchWithTimeout(`${API_BASE}/status`);
    return res.ok ? res.json() : null;
  },

  // Health Readings & Baseline
  async getCurrentHealth(role = 'USER') {
    const res = await fetchWithTimeout(`${API_BASE}/health/current`, {
      headers: this.getHeaders(role)
    });
    return res.ok ? res.json() : null;
  },

  async getHealthHistory(range = '7_days', role = 'USER') {
    const res = await fetchWithTimeout(`${API_BASE}/health/history?range=${range}`, {
      headers: this.getHeaders(role)
    });
    return res.ok ? res.json() : null;
  },

  async postHealthReading(data, role = 'USER') {
    const res = await fetchWithTimeout(`${API_BASE}/health/readings`, {
      method: 'POST',
      headers: this.getHeaders(role),
      body: JSON.stringify(data)
    });
    return res.ok ? res.json() : null;
  },

  // Environmental Telemetry
  async getEnvironment(role = 'USER') {
    const res = await fetchWithTimeout(`${API_BASE}/environment/current`, {
      headers: this.getHeaders(role)
    });
    return res.ok ? res.json() : null;
  },

  // AI Risk Assessment
  async getAiRisk(role = 'USER') {
    const res = await fetchWithTimeout(`${API_BASE}/ai/risk`, {
      headers: this.getHeaders(role)
    });
    return res.ok ? res.json() : null;
  },

  // Alerts & Notifications
  async getAlerts(role = 'USER') {
    const res = await fetchWithTimeout(`${API_BASE}/alerts`, {
      headers: this.getHeaders(role)
    });
    return res.ok ? res.json() : null;
  },

  async acknowledgeAlert(id, role = 'DOCTOR') {
    const res = await fetchWithTimeout(`${API_BASE}/alerts/${id}/acknowledge`, {
      method: 'POST',
      headers: this.getHeaders(role)
    });
    return res.ok ? res.json() : null;
  },

  async resolveAlert(id, role = 'DOCTOR') {
    const res = await fetchWithTimeout(`${API_BASE}/alerts/${id}/resolve`, {
      method: 'POST',
      headers: this.getHeaders(role)
    });
    return res.ok ? res.json() : null;
  },

  async getNotifications(role = 'USER') {
    const res = await fetchWithTimeout(`${API_BASE}/notifications`, {
      headers: this.getHeaders(role)
    });
    return res.ok ? res.json() : null;
  },

  // Recommendations
  async getRecommendations(role = 'USER') {
    const res = await fetchWithTimeout(`${API_BASE}/recommendations`, {
      headers: this.getHeaders(role)
    });
    return res.ok ? res.json() : null;
  },

  // User Profile
  async getProfile(role = 'USER') {
    const res = await fetchWithTimeout(`${API_BASE}/profile`, {
      headers: this.getHeaders(role)
    });
    return res.ok ? res.json() : null;
  },

  async updateProfile(data, role = 'USER') {
    const res = await fetchWithTimeout(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: this.getHeaders(role),
      body: JSON.stringify(data)
    });
    return res.ok ? res.json() : null;
  },

  // Doctor Portal
  async getDoctorPatients() {
    const res = await fetchWithTimeout(`${API_BASE}/doctor/patients`, {
      headers: this.getHeaders('DOCTOR')
    });
    return res.ok ? res.json() : null;
  },

  async getDoctorPatientDetails(id = 'PAT-101') {
    const res = await fetchWithTimeout(`${API_BASE}/doctor/patients/${id}`, {
      headers: this.getHeaders('DOCTOR')
    });
    return res.ok ? res.json() : null;
  },

  async addClinicalNote(patientId, text) {
    const res = await fetchWithTimeout(`${API_BASE}/doctor/notes`, {
      method: 'POST',
      headers: this.getHeaders('DOCTOR'),
      body: JSON.stringify({ patientId, text })
    });
    return res.ok ? res.json() : null;
  },

  // Admin Portal
  async getAdminStatistics() {
    const res = await fetchWithTimeout(`${API_BASE}/admin/statistics`, {
      headers: this.getHeaders('ADMIN')
    });
    return res.ok ? res.json() : null;
  },

  async getAdminAuditLogs() {
    const res = await fetchWithTimeout(`${API_BASE}/admin/audit-logs`, {
      headers: this.getHeaders('ADMIN')
    });
    return res.ok ? res.json() : null;
  },

  // Emergency SOS & Fall
  async triggerFallEvent() {
    const res = await fetchWithTimeout(`${API_BASE}/emergency/fall`, {
      method: 'POST',
      headers: this.getHeaders('USER')
    });
    return res.ok ? res.json() : null;
  },

  async triggerManualSos(reason) {
    const res = await fetchWithTimeout(`${API_BASE}/emergency/sos`, {
      method: 'POST',
      headers: this.getHeaders('USER'),
      body: JSON.stringify({ reason })
    });
    return res.ok ? res.json() : null;
  },

  async getEmergencyEvents(role = 'USER') {
    const res = await fetchWithTimeout(`${API_BASE}/emergency/events`, {
      headers: this.getHeaders(role)
    });
    return res.ok ? res.json() : null;
  },

  // Simulation Triggers
  async triggerSimulation(preset) {
    const res = await fetchWithTimeout(`${API_BASE}/simulation/${preset}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return res.ok ? res.json() : null;
  }
};
