import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { AlertTriangle, Flame, Wind, PhoneCall, CheckCircle2 } from 'lucide-react';

export const DoctorAlerts = () => {
  const { patients, notifications } = useHealth();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="glass-card p-6 rounded-2xl border-amber-500/30">
        <h1 className="text-2xl font-extrabold text-white">DOCTOR ALERTS & CLINICAL QUEUE</h1>
        <p className="text-xs text-slate-400">High-risk patients, abnormal vitals, heat stress flags, and emergency SOS dispatches.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {patients.map(p => (
          <div key={p.id} className={`glass-card p-5 rounded-2xl border ${p.riskLevel === 'Critical' ? 'border-red-500/50 bg-red-950/20' : 'border-slate-800'}`}>
            <div className="flex items-center justify-between">
              <div className="font-extrabold text-white text-base">{p.name}</div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.riskLevel === 'Critical' ? 'bg-red-500 text-white' : 'bg-amber-500 text-slate-950'}`}>
                {p.riskLevel}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2 font-medium">Alert: {p.alert}</p>
            <div className="mt-3 text-xs text-slate-400 font-mono">
              HR: {p.heartRate} BPM • Temp: {p.temp}°C • SpO₂: {p.spO2}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
