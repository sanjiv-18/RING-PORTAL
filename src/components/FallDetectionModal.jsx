import React from 'react';
import { useHealth } from '../context/HealthContext';
import { AlertOctagon, CheckCircle2, PhoneCall, ShieldAlert } from 'lucide-react';

export const FallDetectionModal = () => {
  const { fallModalOpen, setFallModalOpen, fallTimer, triggerSosEmergency } = useHealth();

  if (!fallModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-red-500/80 max-w-md w-full rounded-2xl p-6 text-center shadow-2xl shadow-red-950/50 space-y-6">
        <div className="relative inline-flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-20 w-20 rounded-full bg-red-500 opacity-30"></span>
          <div className="w-16 h-16 rounded-full bg-red-600/20 text-red-500 border border-red-500 flex items-center justify-center">
            <AlertOctagon className="w-10 h-10 animate-bounce" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-wide">Fall Detected!</h2>
          <p className="text-slate-300 text-sm">
            High impact accelerometer drop detected by local sensor. Are you okay?
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Emergency Auto-SOS Dispatch In</p>
          <div className="text-5xl font-extrabold text-red-500 font-mono my-2">{fallTimer}s</div>
          <p className="text-xs text-slate-400">Dispatching live location to Father, Mother & 108 Paramedics</p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => setFallModalOpen(false)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>YES, I'M OK</span>
          </button>

          <button
            onClick={() => triggerSosEmergency('Immediate manual SOS response from Fall Alert')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition animate-pulse"
          >
            <PhoneCall className="w-5 h-5" />
            <span>SEND SOS NOW</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Local Edge Processing active • No data leak</span>
        </div>
      </div>
    </div>
  );
};
