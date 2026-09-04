import React from 'react';
import { useHealth } from '../context/HealthContext';
import { Flame, Wind, AlertTriangle, RefreshCw, Activity, Sliders, CheckCircle2, Wifi, WifiOff } from 'lucide-react';

export const SimulationBar = () => {
  const { 
    activeSimulation, 
    simulateHeatStress, 
    simulateHighAQI, 
    triggerFallSimulation, 
    normalizeVitals,
    simulateBaselineShift,
    resetSimulation,
    isBackendConnected
  } = useHealth();

  return (
    <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-1.5 text-[11px] flex flex-wrap items-center justify-between gap-2 sticky top-0 z-40">
      {/* Demo Mode Badge & Connection Status */}
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-extrabold tracking-wider uppercase text-[10px] border border-purple-500/30">
          DEMO MODE
        </span>
        
        <span className="hidden sm:inline text-slate-500">|</span>

        <div className="flex items-center gap-1.5 text-slate-300">
          {isBackendConnected ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-emerald-400">Express REST API Sync Active</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-red-400" />
              <span className="font-semibold text-red-400">Backend Disconnected</span>
            </>
          )}
        </div>
      </div>

      {/* Simulation Controls Group */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-slate-400 hidden lg:inline mr-1">Scenario Controls:</span>

        {/* Heat Stress */}
        <button
          onClick={simulateHeatStress}
          className={`flex items-center gap-1 px-2.5 py-1 rounded font-bold transition ${
            activeSimulation === 'heat_stress'
              ? 'bg-amber-500 text-slate-950 font-extrabold ring-1 ring-amber-400'
              : 'bg-slate-800 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}
        >
          <Flame className="w-3 h-3" />
          <span>Heat Stress</span>
        </button>

        {/* High AQI */}
        <button
          onClick={simulateHighAQI}
          className={`flex items-center gap-1 px-2.5 py-1 rounded font-bold transition ${
            activeSimulation === 'high_aqi'
              ? 'bg-purple-500 text-white font-extrabold ring-1 ring-purple-400'
              : 'bg-slate-800 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30'
          }`}
        >
          <Wind className="w-3 h-3" />
          <span>High AQI</span>
        </button>

        {/* Fall Simulation */}
        <button
          onClick={triggerFallSimulation}
          className={`flex items-center gap-1 px-2.5 py-1 rounded font-bold transition ${
            activeSimulation === 'fall_detected'
              ? 'bg-red-600 text-white font-extrabold ring-1 ring-red-400 animate-pulse'
              : 'bg-slate-800 hover:bg-red-500/20 text-red-400 border border-red-500/30'
          }`}
        >
          <AlertTriangle className="w-3 h-3" />
          <span>Simulate Fall</span>
        </button>

        {/* Normalize Vitals */}
        <button
          onClick={normalizeVitals}
          className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-bold transition"
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>Normalize</span>
        </button>

        {/* Baseline Shift */}
        <button
          onClick={simulateBaselineShift}
          className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded font-bold transition"
        >
          <Sliders className="w-3 h-3 text-blue-400" />
          <span>Baseline Shift</span>
        </button>

        {/* Reset */}
        <button
          onClick={resetSimulation}
          className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
          title="Reset Backend State"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
