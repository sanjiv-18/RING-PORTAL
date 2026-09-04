import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { Sparkles, AlertTriangle, ShieldCheck, Flame, Droplets, Wind, Heart, BatteryCharging, CheckCircle2, Info } from 'lucide-react';

export const AIHealthAnalysis = () => {
  const { aiRisk } = useHealth();

  const riskFactors = [
    { name: 'Heat Stress', value: aiRisk.heatStress || 87, icon: Flame, color: 'from-amber-500 to-red-500' },
    { name: 'Dehydration', value: aiRisk.dehydration || 68, icon: Droplets, color: 'from-cyan-500 to-blue-500' },
    { name: 'Fatigue / Strain', value: aiRisk.fatigue || 52, icon: BatteryCharging, color: 'from-emerald-500 to-teal-500' },
    { name: 'Respiratory Risk', value: aiRisk.respiratory || 31, icon: Wind, color: 'from-purple-500 to-indigo-500' },
    { name: 'Cardiac Strain', value: aiRisk.cardiac || 18, icon: Heart, color: 'from-rose-500 to-red-600' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-card p-6 rounded-2xl border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">AI Health Assessment</h1>
            <p className="text-xs text-slate-400">Multi-Factor Neural Risk Diagnostic & Environmental Correlation</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>On-Device Local AI Model</span>
        </div>
      </div>

      {/* Mandatory Medical Disclaimer Callout (Section 26) */}
      <div className="bg-amber-950/20 border border-amber-500/40 p-4 rounded-xl text-center">
        <span className="text-xs font-extrabold text-amber-300 tracking-wide uppercase">
          ⚠️ Prototype AI Risk Assessment — Not a Medical Diagnosis
        </span>
        <p className="text-[11px] text-slate-400 mt-0.5">
          This system provides non-diagnostic physiological risk telemetry. Consult a licensed healthcare provider for medical emergencies.
        </p>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Gauge: Overall Risk */}
        <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Risk Assessment</span>
          
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" className="text-slate-800 stroke-current" strokeWidth="10" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="40"
                className={`stroke-current transition-all duration-1000 ${
                  aiRisk.overallScore > 80 ? 'text-red-500' : aiRisk.overallScore > 50 ? 'text-amber-500' : 'text-emerald-500'
                }`}
                strokeWidth="10"
                strokeDasharray={`${(aiRisk.overallScore / 100) * 251.2} 251.2`}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-white font-mono">{aiRisk.overallScore}</span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
          </div>

          <div className={`px-4 py-1.5 rounded-xl text-xs font-extrabold tracking-wider uppercase ${
            aiRisk.overallScore > 80 ? 'bg-red-500 text-white' : aiRisk.overallScore > 50 ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
          }`}>
            {aiRisk.riskLevel}
          </div>
        </div>

        {/* Right 2 Spans: Progress Bars */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl space-y-4 border-slate-800">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
            Multi-Dimensional Risk Factor Breakdown
          </h2>

          <div className="space-y-3.5">
            {riskFactors.map((factor) => {
              const Icon = factor.icon;
              return (
                <div key={factor.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-200 font-semibold">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span>{factor.name}</span>
                    </div>
                    <span className="font-mono font-bold text-white">{factor.value}%</span>
                  </div>
                  
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${factor.color} transition-all duration-700`}
                      style={{ width: `${factor.value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Why & Contributing Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl space-y-3 border-slate-800">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Why Was This Detected?</span>
          </h3>
          <p className="text-sm font-semibold text-slate-100 leading-relaxed">
            {aiRisk.whyText}
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-3 border-slate-800">
          <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span>Contributing Factors</span>
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {(aiRisk.contributingFactors || [
              'Elevated heart rate (+20 BPM above baseline)',
              'High environmental temperature (41°C)',
              'High humidity (78%)',
              'Low hydration (42%)',
              'Personal baseline deviation'
            ]).map((factor, i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
