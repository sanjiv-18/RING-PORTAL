import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { Stethoscope, Users, AlertTriangle, Activity, Heart, ArrowUpRight, Search } from 'lucide-react';

export const DoctorDashboard = () => {
  const { patients, setDoctorTab, setSelectedPatientId, notifications } = useHealth();

  const needingAttention = patients.filter(p => p.riskLevel === 'High' || p.riskLevel === 'Critical');
  const activeAlertsCount = notifications.filter(n => n.type === 'critical' || n.type === 'warning').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Doctor Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-card p-6 rounded-2xl border-blue-500/30">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Stethoscope className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">CLINICAL DASHBOARD — DR. ANITA ROY</h1>
            <p className="text-xs text-slate-400">Cardiology & Environmental Medicine • Real-time Telemetry Monitor</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-blue-950 px-3 py-1.5 rounded-xl border border-blue-500/30 text-xs text-blue-300 font-bold">
          <span>Live Patient Sync Active</span>
        </div>
      </div>

      {/* Top 4 Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Patients */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Patients</span>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{patients.length}</div>
          <div className="text-xs text-slate-400">Active roster</div>
        </div>

        {/* Patients Needing Attention */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl space-y-2 border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Needing Attention</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400">{needingAttention.length}</div>
          <div className="text-xs text-amber-300 font-semibold">High or Critical Risk</div>
        </div>

        {/* Active Alerts */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Active Alerts</span>
            <Activity className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{activeAlertsCount}</div>
          <div className="text-xs text-slate-400">Realtime telemetry flags</div>
        </div>

        {/* Recent Events */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Recent SOS / Heat Events</span>
            <Heart className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">2</div>
          <div className="text-xs text-slate-400">Last 24 hours</div>
        </div>
      </div>

      {/* Patients Needing Attention Alert Section */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>High Risk Patients Monitored</span>
          </h2>
          <button
            onClick={() => setDoctorTab('patient_list')}
            className="text-xs text-blue-400 hover:underline font-semibold"
          >
            View Full Patient Directory →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patients.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setSelectedPatientId(p.id);
                setDoctorTab('patient_view');
              }}
              className={`p-4 rounded-xl border cursor-pointer transition glass-card-hover flex items-center justify-between ${
                p.riskLevel === 'Critical'
                  ? 'border-red-500/60 bg-red-950/20'
                  : p.riskLevel === 'High'
                  ? 'border-amber-500/60 bg-amber-950/20'
                  : 'border-slate-800 bg-slate-950'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-white text-base">{p.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    p.riskLevel === 'Critical' ? 'bg-red-500 text-white animate-pulse' : p.riskLevel === 'High' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {p.riskLevel} Risk
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-3">
                  <span>HR: <strong className="text-white font-mono">{p.heartRate} BPM</strong></span>
                  <span>SpO₂: <strong className="text-white font-mono">{p.spO2}%</strong></span>
                  <span>Temp: <strong className="text-white font-mono">{p.temp}°C</strong></span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium">Alert: {p.alert}</p>
              </div>

              <div className="p-2 rounded-xl bg-slate-900 text-blue-400 border border-slate-800">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
