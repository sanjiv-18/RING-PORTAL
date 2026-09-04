import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { Search, User, ArrowUpRight, Filter } from 'lucide-react';

export const PatientList = () => {
  const { patients, setSelectedPatientId, setDoctorTab } = useHealth();
  const [search, setSearch] = useState('');

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white">PATIENT DIRECTORY</h1>
          <p className="text-xs text-slate-400">Search and monitor continuous vital metrics across your patient roster.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search patient name or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Patients Table / Grid */}
      <div className="glass-card rounded-2xl overflow-hidden border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Patient Name & ID</th>
              <th className="p-4">Vitals Summary</th>
              <th className="p-4">Risk Level</th>
              <th className="p-4">Heat Stress</th>
              <th className="p-4">Last Activity</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredPatients.map((p) => (
              <tr key={p.id} className="hover:bg-slate-850/50 transition">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-sm">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-extrabold text-white text-sm">{p.name}</div>
                      <div className="text-[10px] text-slate-400">{p.id} • {p.age}y, {p.gender}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-mono text-slate-300">
                    HR: <strong className="text-white">{p.heartRate}</strong> | SpO₂: <strong className="text-white">{p.spO2}%</strong> | Temp: <strong className="text-white">{p.temp}°C</strong>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold tracking-wider uppercase ${
                    p.riskLevel === 'Critical' ? 'bg-red-500 text-white animate-pulse' : p.riskLevel === 'High' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {p.riskLevel}
                  </span>
                </td>
                <td className="p-4">
                  <div className="font-mono font-bold text-slate-200">{p.heatStress}%</div>
                </td>
                <td className="p-4 text-slate-400">{p.lastActive}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => {
                      setSelectedPatientId(p.id);
                      setDoctorTab('patient_view');
                    }}
                    className="flex items-center gap-1 ml-auto px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition text-[11px]"
                  >
                    <span>View Telemetry</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
