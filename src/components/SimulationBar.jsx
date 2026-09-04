import React from 'react';
import { useHealth } from '../context/HealthContext';
import { Flame, Wind, AlertTriangle, RefreshCw, Sliders, CheckCircle2, Wifi, WifiOff, Database } from 'lucide-react';

export const SimulationBar = () => {
  const { 
    activeSimulation, 
    simulateHeatStress, 
    simulateHighAQI, 
    triggerFallSimulation, 
    normalizeVitals,
    simulateBaselineShift,
    resetSimulation,
    isBackendConnected,
    dbMode,
    dbLatency,
    lastSyncTime
  } = useHealth();

  return (
    <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-1.5 text-[11px] flex flex-wrap items-center justify-between gap-2 sticky top-0 z-40">
      {/* Demo Badge, Database Engine & Sync Indicator */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-extrabold tracking-wider uppercase text-[10px] border border-purple-500/30">
          DEMO MODE
        </span>
        
        <span className="text-slate-600 hidden sm:inline">|</span>

        {/* Database Mode Badge */}
        <div className="flex items-center gap-1.5 text-slate-300">
          <Database className="w-3.5 h-3.5 text-teal-400" />
          <span className="text-slate-400">DB:</span>
          <span className={`font-semibold ${dbMode.includes('MongoDB') ? 'text-emerald-400' : 'text-teal-300'}`}>
            {dbMode}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">({dbLatency})</span>
        </div>

        <span className="text-slate-600 hidden sm:inline">|</span>

        <div className="flex items-center gap-1.5 text-slate-300">
          {isBackendConnected ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-emerald-400">REST Sync: {lastSyncTime}</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-red-400" />
              <span className="font-semibold text-red-400">Backend Disconnected</span>
            </>
          )}
        </div>
      </div>

      {/* Scenario Action Controls */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-slate-400 hidden lg:inline mr-1 text-[10px] uppercase font-bold">Scenarios:</span>

        <button
          onClick={simulateHeatStress}
          className={`flex items-center gap-1 px-2.5 py-1 rounded font-bold transition ${
            activeSimulation === 'heat_stress'
              ? 'bg-amber-500 text-slate-950 font-extrabold ring-1 ring-amber-400'
              : 'bg-slate-800 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}
          title="Simulate 41°C / 108 BPM heatwave scenario"
        >
          <Flame className="w-3 h-3" />
          <span>Heat Stress</span>
        </button>

        <button
          onClick={simulateHighAQI}
          className={`flex items-center gap-1 px-2.5 py-1 rounded font-bold transition ${
            activeSimulation === 'high_aqi'
              ? 'bg-purple-500 text-white font-extrabold ring-1 ring-purple-400'
              : 'bg-slate-800 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30'
          }`}
          title="Simulate 215 AQI hazardous smog scenario"
        >
          <Wind className="w-3 h-3" />
          <span>High AQI</span>
        </button>

        <button
          onClick={triggerFallSimulation}
          className={`flex items-center gap-1 px-2.5 py-1 rounded font-bold transition ${
            activeSimulation === 'fall_detected'
              ? 'bg-red-600 text-white font-extrabold ring-1 ring-red-400 animate-pulse'
              : 'bg-slate-800 hover:bg-red-500/20 text-red-400 border border-red-500/30'
          }`}
          title="Simulate accelerometer fall detection with 10s countdown"
        >
          <AlertTriangle className="w-3 h-3" />
          <span>Simulate Fall</span>
        </button>

        <button
          onClick={normalizeVitals}
          className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-bold transition"
          title="Normalize vitals to baseline"
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>Normalize</span>
        </button>

        <button
          onClick={simulateBaselineShift}
          className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded font-bold transition"
          title="Trigger baseline physiological shift"
        >
          <Sliders className="w-3 h-3 text-blue-400" />
          <span>Baseline Shift</span>
        </button>

        <button
          onClick={resetSimulation}
          className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
          title="Reset database to initial defaults"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
