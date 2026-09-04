import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { FileText, CheckCircle2 } from 'lucide-react';

export const DoctorNotes = () => {
  const { clinicalNotes } = useHealth();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="glass-card p-6 rounded-2xl border-blue-500/30">
        <h1 className="text-2xl font-extrabold text-white">CLINICAL NOTES & PRESCRIPTIONS LOG</h1>
        <p className="text-xs text-slate-400">Historical records of doctor observations and advice.</p>
      </div>

      <div className="space-y-4">
        {clinicalNotes.map(n => (
          <div key={n.id} className="glass-card p-5 rounded-2xl border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-blue-400 flex items-center gap-2">
                <FileText className="w-4 h-4" /> {n.doctor}
              </span>
              <span className="text-slate-400 font-mono">{n.date}</span>
            </div>
            <p className="text-sm text-slate-200">{n.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
