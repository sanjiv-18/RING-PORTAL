/**
 * Centralized HealthGuard API Service Client
 * Handles headers, JWT auth tokens, role injection, timeout resilience, and unified responses.
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
  getHeaders: (role = 'USER') => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('healthguard_token') : null;
    const headers = {
      'Content-Type': 'application/json',
      'x-demo-role': role.toUpperCase()
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  // Authentication API Methods
  async login(email, password) {
    const res = await fetchWithTimeout(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('healthguard_token', data.token);
    }
    return data;
  },

  async register(name, email, password, role = 'USER') {
    const res = await fetchWithTimeout(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('healthguard_token', data.token);
    }
    return data;
  },

  async getCurrentUser() {
    const res = await fetchWithTimeout(`${API_BASE}/auth/me`, {
      headers: this.getHeaders()
    });
    return res.ok ? res.json() : null;
  },

  async logout() {
    localStorage.removeItem('healthguard_token');
    const res = await fetchWithTimeout(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    return res.ok ? res.json() : null;
  },

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

  // IoT Smart Wearables & Device Integration
  async getDevices(role = 'USER') {
    const res = await fetchWithTimeout(`${API_BASE}/devices`, {
      headers: this.getHeaders(role)
    });
    return res.ok ? res.json() : null;
  },

  async addDevice(data, role = 'USER') {
    const res = await fetchWithTimeout(`${API_BASE}/devices`, {
      method: 'POST',
      headers: this.getHeaders(role),
      body: JSON.stringify(data)
    });
    return res.ok ? res.json() : null;
  },

  async updateDeviceStatus(id, data, role = 'USER') {
    const res = await fetchWithTimeout(`${API_BASE}/devices/${id}/status`, {
      method: 'PUT',
      headers: this.getHeaders(role),
      body: JSON.stringify(data)
    });
    return res.ok ? res.json() : null;
  },

  async syncDevice(id, role = 'USER') {
    const res = await fetchWithTimeout(`${API_BASE}/devices/${id}/sync`, {
      method: 'POST',
      headers: this.getHeaders(role)
    });
    return res.ok ? res.json() : null;
  },

  async deleteDevice(id, role = 'USER') {
    const res = await fetchWithTimeout(`${API_BASE}/devices/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(role)
    });
    return res.ok ? res.json() : null;
  },

  // Wearable Telemetry & Analytics
  async getCurrentWearable(role = 'USER') {
    const res = await fetchWithTimeout(`${API_BASE}/wearables/current`, {
      headers: this.getHeaders(role)
    });
    return res.ok ? res.json() : null;
  },

  async syncWearableData(data, role = 'USER') {
    const res = await fetchWithTimeout(`${API_BASE}/wearables/sync`, {
      method: 'POST',
      headers: this.getHeaders(role),
      body: JSON.stringify(data)
    });
    return res.ok ? res.json() : null;
  },

  async getWearableHistory(range = '7_days', role = 'USER') {
    const res = await fetchWithTimeout(`${API_BASE}/wearables/history?range=${range}`, {
      headers: this.getHeaders(role)
    });
    return res.ok ? res.json() : null;
  },

  async getWearableInsights(role = 'USER') {
    const res = await fetchWithTimeout(`${API_BASE}/wearables/insights`, {
      headers: this.getHeaders(role)
    });
    return res.ok ? res.json() : null;
  },

  async triggerWearableFall(data = {}, role = 'USER') {
    const res = await fetchWithTimeout(`${API_BASE}/wearables/fall`, {
      method: 'POST',
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
