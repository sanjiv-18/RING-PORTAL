import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { Sliders, AlertTriangle, CheckCircle2, Heart, Wind, Thermometer, ShieldCheck } from 'lucide-react';

export const PersonalBaseline = () => {
  const { vitals, baseline } = useHealth();

  const isHrDeviated = vitals.heartRate < baseline.heartRate.min || vitals.heartRate > baseline.heartRate.max;
  const isSpo2Deviated = vitals.spO2 < baseline.spO2.min;
  const isTempDeviated = vitals.temp < baseline.temp.min || vitals.temp > baseline.temp.max;

  const hrDiff = vitals.heartRate - baseline.heartRate.max;
  const spo2Diff = vitals.spO2 - baseline.spO2.min;
  const tempDiff = (vitals.temp - baseline.temp.max).toFixed(1);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Personal Baseline Engine</h1>
            <p className="text-xs text-slate-400">Customized 30-Day Physiological Baseline Benchmark</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-teal-400 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Calibrated via Edge ML</span>
        </div>
      </div>

      {/* Baseline Deviation Callout */}
      {isHrDeviated || isSpo2Deviated || isTempDeviated ? (
        <div className="p-5 rounded-2xl border border-amber-500/60 bg-amber-950/20 text-amber-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-400 text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Significant Deviation From Your Personal Baseline Detected</span>
          </div>
          <p className="text-xs text-slate-300">
            HEALTHGUARD AI flags changes relative to your 30-day baseline rather than population averages. Current telemetry indicates physiological stress spikes.
          </p>
        </div>
      ) : (
        <div className="p-5 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 text-emerald-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-emerald-400 text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Vitals Aligned With Personal Baseline</span>
          </div>
          <p className="text-xs text-slate-300">
            All parameters are operating within your calibrated 30-day target thresholds.
          </p>
        </div>
      )}

      {/* Baseline vs Current Table */}
      <div className="glass-card p-6 rounded-2xl space-y-4 border-slate-800">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Personal Baseline Comparison Table</h2>

        <div className="space-y-3">
          {/* Heart Rate Row */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm">Heart Rate</h3>
                <p className="text-xs text-slate-400">Baseline Range: {baseline.heartRate.min}–{baseline.heartRate.max} BPM</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Current</span>
                <span className="font-bold text-white font-mono text-sm">{vitals.heartRate} BPM</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Deviation</span>
                <span className={`font-mono font-bold ${hrDiff > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {hrDiff > 0 ? `+${hrDiff} BPM` : '0 BPM'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Status</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                  isHrDeviated ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {isHrDeviated ? 'Above Baseline ⚠️' : 'Normal ✓'}
                </span>
              </div>
            </div>
          </div>

          {/* SpO2 Row */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm">SpO₂ Oxygen Saturation</h3>
                <p className="text-xs text-slate-400">Baseline Range: {baseline.spO2.min}–{baseline.spO2.max}%</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Current</span>
                <span className="font-bold text-white font-mono text-sm">{vitals.spO2}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Deviation</span>
                <span className={`font-mono font-bold ${spo2Diff < 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {spo2Diff < 0 ? `${spo2Diff}%` : '0%'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Status</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                  isSpo2Deviated ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {isSpo2Deviated ? 'Below Normal ⚠️' : 'Normal ✓'}
                </span>
              </div>
            </div>
          </div>

          {/* Body Temperature Row */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm">Body Temperature</h3>
                <p className="text-xs text-slate-400">Baseline Range: {baseline.temp.min}–{baseline.temp.max}°C</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Current</span>
                <span className="font-bold text-white font-mono text-sm">{vitals.temp}°C</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Deviation</span>
                <span className={`font-mono font-bold ${tempDiff > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {tempDiff > 0 ? `+${tempDiff}°C` : '0°C'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Status</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                  isTempDeviated ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {isTempDeviated ? 'Elevated ⚠️' : 'Normal ✓'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
