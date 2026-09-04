import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { ShieldCheck, Cpu, CloudOff, MapPin, PhoneCall, Lock, History } from 'lucide-react';

export const PrivacyCenter = () => {
  const privacyControls = [
    { label: 'Local AI Processing', value: 'ON', status: 'active', icon: Cpu, desc: 'Local prototype risk analysis' },
    { label: 'Cloud Health Sharing', value: 'OFF', status: 'disabled', icon: CloudOff, desc: 'Zero cloud telemetry upload' },
    { label: 'Location Sharing', value: 'OFF', status: 'disabled', icon: MapPin, desc: 'Permission required for local AQI' },
    { label: 'Emergency Sharing', value: 'ON', status: 'active', icon: PhoneCall, desc: 'User controlled SOS dispatch' },
  ];

  const privacyLogs = [
    { time: '14:20:05', action: 'Local prototype risk analysis executed', status: 'Success' },
    { time: '13:15:22', action: 'Emergency contact sync completed', status: 'Verified' },
    { time: '11:40:10', action: 'Micro-weather API permission validated', status: 'Local Only' },
    { time: '09:00:00', action: 'On-device baseline memory check', status: 'Clean' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">PRIVACY CENTER</h1>
            <p className="text-xs text-slate-400">Zero-Trust Privacy & On-Device Data Security Architecture</p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl">
          On-Device Active
        </span>
      </div>

      {/* 4 Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {privacyControls.map((control, i) => {
          const Icon = control.icon;
          return (
            <div key={i} className="glass-card p-5 rounded-2xl border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase">{control.label}</span>
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded ${
                  control.value === 'ON' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {control.value}
                </span>
              </div>

              <div className="flex items-center gap-2 text-white font-bold text-sm pt-1">
                <Icon className="w-4 h-4 text-teal-400" />
                <span>{control.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Wording Explanation */}
      <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Local Prototype Risk Analysis Guarantee</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Your health information is processed locally whenever possible. Local prototype risk analysis minimizes sensitive biometric transmission. You maintain absolute control over emergency dispatch sharing.
        </p>
      </div>

      {/* Privacy Audit Log */}
      <div className="glass-card p-6 rounded-2xl space-y-3 border-slate-800">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <History className="w-4 h-4 text-teal-400" />
          <span>Privacy Audit Log</span>
        </h2>

        <div className="space-y-2">
          {privacyLogs.map((log, index) => (
            <div key={index} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-500 text-[11px]">{log.time}</span>
                <span className="text-slate-200 font-medium">{log.action}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-teal-400">
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
