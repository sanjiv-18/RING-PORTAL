import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { Sun, Droplets, Wind, AlertTriangle, HeartPulse } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const EnvironmentalMonitoring = () => {
  const { environment, aiRisk } = useHealth();

  const envTrend = [
    { time: '06:00', temp: 28, humidity: 65, aqi: 90 },
    { time: '09:00', temp: 32, humidity: 68, aqi: 115 },
    { time: '12:00', temp: 36, humidity: 70, aqi: 140 },
    { time: '15:00', temp: environment.outsideTemp, humidity: environment.humidity, aqi: environment.aqi },
    { time: '18:00', temp: 34, humidity: 74, aqi: 130 },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">ENVIRONMENTAL MONITORING</h1>
          <p className="text-xs text-slate-400 mt-0.5">Real-time hyper-local climate telemetry & ambient air quality</p>
        </div>

        <span className="text-xs px-3 py-1 bg-slate-950 border border-slate-800 text-slate-300 rounded-xl font-mono">
          Zone: Central Urban Sector 4
        </span>
      </div>

      {/* 5 Main Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="glass-card p-4 rounded-2xl space-y-1 border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Temperature</span>
          <div className="text-2xl font-extrabold text-white font-mono">{environment.outsideTemp}°C</div>
          <span className="text-[10px] text-amber-400 font-semibold">Feels like {environment.heatIndex}°C</span>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-1 border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Humidity</span>
          <div className="text-2xl font-extrabold text-white font-mono">{environment.humidity}%</div>
          <span className="text-[10px] text-cyan-400 font-semibold">Very High Moisture</span>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-1 border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase">AQI Index</span>
          <div className="text-2xl font-extrabold text-white font-mono">{environment.aqi}</div>
          <span className={`text-[10px] font-bold ${environment.aqi > 200 ? 'text-red-400' : 'text-amber-400'}`}>
            {environment.pollutionLevel || 'Unhealthy'}
          </span>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-1 border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase">UV Index</span>
          <div className="text-2xl font-extrabold text-white font-mono">UV {environment.uvIndex}</div>
          <span className="text-[10px] text-rose-400 font-semibold">High Exposure</span>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-1 border-slate-800 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Heat Index</span>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">{environment.heatIndex}°C</div>
          <span className="text-[10px] text-amber-300 font-semibold">Extreme Caution</span>
        </div>
      </div>

      {/* Your Environmental Health Risk Section */}
      <div className="glass-card p-6 rounded-2xl space-y-4 border-slate-800">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
          Your Environmental Health Risk Impact
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Heat Stress Risk</span>
              <span className="font-bold text-amber-400 font-mono">91%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '91%' }} />
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Respiratory Risk</span>
              <span className="font-bold text-purple-400 font-mono">82%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '82%' }} />
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">UV Exposure</span>
              <span className="font-bold text-rose-400 font-mono">67%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: '67%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Trend Chart */}
      <div className="glass-card p-6 rounded-2xl space-y-3 border-slate-800">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Environmental Trend History</h3>
        <div className="h-52 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={envTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" domain={[20, 250]} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="aqi" stroke="#a855f7" strokeWidth={2} fillOpacity={0.2} fill="#a855f7" name="AQI" />
              <Area type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} fillOpacity={0.2} fill="#f59e0b" name="Temp (°C)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
