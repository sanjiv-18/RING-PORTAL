import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { Heart, Wind, Thermometer, Activity, Moon, ShieldCheck, Sparkles, Sliders, FileText, Send, ArrowLeft } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const PatientDetailView = () => {
  const { patients, selectedPatientId, setDoctorTab, clinicalNotes, setClinicalNotes } = useHealth();
  const patient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const [newNote, setNewNote] = useState('');

  const chartData = [
    { time: '08:00', hr: 74, temp: 36.6, risk: 20 },
    { time: '10:00', hr: 82, temp: 36.8, risk: 35 },
    { time: '12:00', hr: 94, temp: 37.2, risk: 60 },
    { time: '14:00', hr: patient.heartRate, temp: patient.temp, risk: patient.heatStress },
  ];

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setClinicalNotes(prev => [
      { id: Date.now(), doctor: 'Dr. Anita Roy', date: new Date().toISOString().split('T')[0], text: newNote },
      ...prev
    ]);
    setNewNote('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between glass-card p-6 rounded-2xl border-blue-500/30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDoctorTab('patient_list')}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">{patient.name}</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                {patient.id}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{patient.age} Yrs • {patient.gender} • Health Score: <strong className="text-teal-400">{patient.healthScore}/100</strong></p>
          </div>
        </div>

        <div className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wider uppercase ${
          patient.riskLevel === 'Critical' ? 'bg-red-500 text-white animate-pulse' : patient.riskLevel === 'High' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500/20 text-emerald-300'
        }`}>
          {patient.riskLevel} Risk Profile
        </div>
      </div>

      {/* Vitals Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Heart Rate</span>
            <Heart className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{patient.heartRate} BPM</div>
          <div className="text-[10px] text-slate-400">Normal range: 72–88</div>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>SpO₂ Saturation</span>
            <Wind className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{patient.spO2}%</div>
          <div className="text-[10px] text-slate-400">Normal range: 95–100%</div>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Body Temperature</span>
            <Thermometer className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{patient.temp}°C</div>
          <div className="text-[10px] text-slate-400">Normal range: 36.5–37.2°C</div>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Heat Stress Risk</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">{patient.heatStress}%</div>
          <div className="text-[10px] text-amber-300 font-semibold">{patient.alert}</div>
        </div>
      </div>

      {/* Health Trend Chart */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Telemetry Trend & Heat Stress Mapping</h2>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" domain={[40, 120]} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="hr" stroke="#f43f5e" strokeWidth={2} fillOpacity={0.2} fill="#f43f5e" name="Heart Rate (BPM)" />
              <Area type="monotone" dataKey="risk" stroke="#f59e0b" strokeWidth={2} fillOpacity={0.2} fill="#f59e0b" name="Heat Risk (%)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Doctor Clinical Notes */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          <span>Doctor Clinical Notes & Observations</span>
        </h2>

        <form onSubmit={handleAddNote} className="flex gap-2">
          <input
            type="text"
            placeholder="Add clinical observation or medical prescription note..."
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:border-blue-500 outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
          >
            <Send className="w-4 h-4" />
            <span>Add Note</span>
          </button>
        </form>

        <div className="space-y-3 pt-2">
          {clinicalNotes.map(n => (
            <div key={n.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-400">{n.doctor}</span>
                <span className="text-slate-400 font-mono text-[10px]">{n.date}</span>
              </div>
              <p className="text-xs text-slate-200">{n.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
