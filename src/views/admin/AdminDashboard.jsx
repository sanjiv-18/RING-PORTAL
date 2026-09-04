import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { Settings, Users, Stethoscope, AlertTriangle, Flame, PhoneCall, Cpu, Activity, CheckCircle2, History, Database } from 'lucide-react';

export const AdminDashboard = () => {
  const { adminStats, alerts, systemServices, auditLogs, dbMode, dbLatency } = useHealth();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-card p-6 rounded-2xl border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">ADMINISTRATOR PORTAL</h1>
            <p className="text-xs text-slate-400">System Infrastructure, Population Health Telemetry & Event Stream</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-purple-300 font-bold">
          <Database className="w-4 h-4 text-teal-400" />
          <span>Engine: {dbMode} ({dbLatency})</span>
        </div>
      </div>

      {/* Top 5 Metrics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="glass-card p-4 rounded-2xl space-y-1 border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Users</span>
          <div className="text-2xl font-extrabold text-white font-mono">{adminStats.totalUsers.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-400 font-semibold">{adminStats.activeUsers} Active</span>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-1 border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Doctors</span>
          <div className="text-2xl font-extrabold text-white font-mono">{adminStats.totalDoctors}</div>
          <span className="text-[10px] text-blue-400 font-semibold">Active Roster</span>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-1 border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Active Users</span>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">{adminStats.activeUsers}</div>
          <span className="text-[10px] text-slate-400">Online Now</span>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-1 border-amber-500/40 bg-amber-950/10">
          <span className="text-[10px] font-bold text-slate-400 uppercase">High Risk Users</span>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">{adminStats.highRiskUsers}</div>
          <span className="text-[10px] text-amber-300 font-semibold">Needs Follow-up</span>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-1 border-red-500/40 bg-red-950/10 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">SOS Events</span>
          <div className="text-2xl font-extrabold text-red-400 font-mono">{adminStats.sosEvents}</div>
          <span className="text-[10px] text-red-300 font-semibold">Emergency Logs</span>
        </div>
      </div>

      {/* System Status Table */}
      <div className="glass-card p-6 rounded-2xl space-y-4 border-slate-800">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span>System Services Health & Operational Status</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {systemServices.map((srv, i) => (
            <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-white">{srv.name}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                  {srv.status}
                </span>
                <span className="text-slate-400 font-mono">{srv.latency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Breakdown & Live System Event Stream */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alert Statistics */}
        <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Environmental Alert Statistics</span>
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-300">Heat Stress Alerts Logged</span>
              <span className="text-base font-extrabold text-amber-400 font-mono">{adminStats.heatAlerts}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-300">Respiratory / AQI Alerts Logged</span>
              <span className="text-base font-extrabold text-purple-400 font-mono">{adminStats.respiratoryAlerts}</span>
            </div>
          </div>
        </div>

        {/* Live System Event Stream */}
        <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" />
            <span>Live System Event Stream</span>
          </h2>

          <div className="space-y-2">
            {alerts.slice(0, 4).map(a => (
              <div key={a.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{a.type === 'critical' ? '🔴' : a.type === 'warning' ? '🟠' : '🟢'}</span>
                  <span className="text-slate-200 font-medium">{a.title}: {a.message}</span>
                </div>
                <span className="text-slate-500 font-mono text-[10px] shrink-0 ml-2">
                  {a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : 'Just now'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Log Stream Section */}
      <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-3">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <History className="w-4 h-4 text-purple-400" />
          <span>System Audit & Security Logs</span>
        </h2>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {auditLogs.map((log, index) => (
            <div key={log.id || index} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-purple-300 font-mono">{log.actor}</span>
                  <span className="text-slate-200">{log.action}</span>
                </div>
                <p className="text-[11px] text-slate-400">{log.details}</p>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Recent'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
