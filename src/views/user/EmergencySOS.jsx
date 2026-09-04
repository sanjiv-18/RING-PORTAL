import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { PhoneCall, AlertOctagon, UserCheck, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

export const EmergencySOS = () => {
  const { 
    emergencyContacts, 
    triggerFallSimulation, 
    triggerSosEmergency, 
    sosSent, 
    setSosSent 
  } = useHealth();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="glass-card p-6 rounded-2xl border-red-500/50 bg-red-950/20 text-center space-y-4">
        <div className="inline-flex p-4 rounded-full bg-red-600/20 text-red-500 border border-red-500/40">
          <AlertOctagon className="w-12 h-12 animate-pulse" />
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-widest uppercase">🚨 EMERGENCY / SOS HUB</h1>
          <p className="text-xs text-red-300 max-w-md mx-auto mt-1">
            Pressing SOS dispatches your live GPS coordinates, telemetry vitals, and emergency audio link to designated responders & guardians.
          </p>
        </div>

        {/* Huge SOS Trigger Button */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => triggerSosEmergency('Manual SOS button pressed by user')}
            className={`w-64 h-24 rounded-3xl font-black text-2xl tracking-widest uppercase shadow-2xl transition transform active:scale-95 flex flex-col items-center justify-center gap-1 ${
              sosSent
                ? 'bg-emerald-600 text-white border-2 border-emerald-400 animate-pulse'
                : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white border-2 border-red-400 shadow-red-600/40 animate-pulse'
            }`}
          >
            <PhoneCall className="w-8 h-8" />
            <span>{sosSent ? 'SOS DISPATCHED ✓' : '[ SEND SOS ]'}</span>
          </button>
        </div>

        {sosSent && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Emergency signal acknowledged by Local Dispatcher & Doctor. Help is en route!</span>
            <button 
              onClick={() => setSosSent(false)} 
              className="underline text-xs text-slate-400 hover:text-white ml-2"
            >
              Cancel SOS
            </button>
          </div>
        )}
      </div>

      {/* Fall Detection Simulator Box */}
      <div className="glass-card p-6 rounded-2xl border-amber-500/40 bg-amber-950/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase">
            <AlertTriangle className="w-5 h-5" />
            <span>Simulate Fall / Medical Distress Detection</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
            Accelerometer AI
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The problem statement includes automatic fall and sudden medical distress detection. Click below to launch the simulated interactive 10-second countdown prompt ("Are you okay?").
        </p>
        <button
          onClick={triggerFallSimulation}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
        >
          🚨 Launch Fall Detection Simulator
        </button>
      </div>

      {/* Emergency Contacts List */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-teal-400" />
          <span>Emergency Contacts (Auto-Notified on SOS)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="glass-card p-4 rounded-xl border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">👤</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {contact.relation}
                </span>
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">{contact.name}</h3>
                <p className="text-xs text-teal-400 font-mono font-semibold">{contact.phone}</p>
              </div>
              <div className="text-[10px] text-slate-500 border-t border-slate-800 pt-1">
                SMS + Automated Voice Call Enabled
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
