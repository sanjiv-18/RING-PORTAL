import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { BarChart3, Calendar, Heart, Wind, Thermometer, Activity, Droplets } from 'lucide-react';

export const HealthAnalytics = () => {
  const { vitals, environment } = useHealth();
  const [timeRange, setTimeRange] = useState('7_days'); // 'today' | '7_days' | '30_days'

  // Synthetic Historical Datasets
  const todayData = [
    { time: '06:00', heartRate: 70, spO2: 98, temp: 36.5, hydration: 90, aqi: 110, risk: 20 },
    { time: '09:00', heartRate: 76, spO2: 97, temp: 36.7, hydration: 85, aqi: 125, risk: 35 },
    { time: '12:00', heartRate: 92, spO2: 96, temp: 37.1, hydration: 65, aqi: 155, risk: 65 },
    { time: '15:00', heartRate: vitals.heartRate, spO2: vitals.spO2, temp: vitals.temp, hydration: vitals.hydration, aqi: environment.aqi, risk: 72 },
    { time: '18:00', heartRate: 84, spO2: 97, temp: 36.9, hydration: 70, aqi: 140, risk: 45 },
    { time: '21:00', heartRate: 74, spO2: 98, temp: 36.6, hydration: 80, aqi: 120, risk: 25 },
  ];

  const sevenDaysData = [
    { day: 'Mon', heartRate: 72, spO2: 98, temp: 36.5, sleep: 7.5, activity: 7200, hydration: 85, aqi: 95 },
    { day: 'Tue', heartRate: 75, spO2: 97, temp: 36.6, sleep: 7.2, activity: 8100, hydration: 80, aqi: 110 },
    { day: 'Wed', heartRate: 88, spO2: 96, temp: 37.0, sleep: 6.8, activity: 9400, hydration: 62, aqi: 145 },
    { day: 'Thu', heartRate: vitals.heartRate, spO2: vitals.spO2, temp: vitals.temp, sleep: 7.3, activity: vitals.activity, hydration: vitals.hydration, aqi: environment.aqi },
    { day: 'Fri', heartRate: 79, spO2: 97, temp: 36.7, sleep: 8.0, activity: 6500, hydration: 78, aqi: 130 },
    { day: 'Sat', heartRate: 73, spO2: 98, temp: 36.5, sleep: 8.5, activity: 5200, hydration: 88, aqi: 105 },
    { day: 'Sun', heartRate: 71, spO2: 99, temp: 36.4, sleep: 8.2, activity: 6100, hydration: 90, aqi: 90 },
  ];

  const thirtyDaysData = [
    { day: 'Week 1', heartRate: 74, spO2: 98, temp: 36.6, activity: 52000, hydration: 82, aqi: 105 },
    { day: 'Week 2', heartRate: 78, spO2: 97, temp: 36.8, activity: 58000, hydration: 75, aqi: 125 },
    { day: 'Week 3', heartRate: vitals.heartRate, spO2: vitals.spO2, temp: vitals.temp, activity: 61000, hydration: vitals.hydration, aqi: environment.aqi },
    { day: 'Week 4', heartRate: 73, spO2: 98, temp: 36.5, activity: 54000, hydration: 86, aqi: 100 },
  ];

  const activeData = timeRange === 'today' ? todayData : timeRange === '7_days' ? sevenDaysData : thirtyDaysData;
  const xAxisKey = timeRange === 'today' ? 'time' : 'day';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">HEALTH HISTORY & ANALYTICS</h1>
            <p className="text-xs text-slate-400">Longitudinal Trends & Environmental Exposure Analytics</p>
          </div>
        </div>

        {/* Time Interval Filter Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setTimeRange('today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              timeRange === 'today' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeRange('7_days')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              timeRange === '7_days' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange('30_days')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              timeRange === '30_days' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Heart Rate Chart */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase">
              <Heart className="w-4 h-4" />
              <span>Heart Rate History (BPM)</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Avg: 78 BPM</span>
          </div>
          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeData}>
                <defs>
                  <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey={xAxisKey} stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" domain={[60, 120]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="heartRate" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#hrGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SpO2 Oxygen Chart */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase">
              <Wind className="w-4 h-4" />
              <span>SpO₂ History (%)</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Baseline: 97%</span>
          </div>
          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeData}>
                <defs>
                  <linearGradient id="spo2Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey={xAxisKey} stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" domain={[88, 100]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="spO2" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#spo2Grad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Body Temperature Chart */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
              <Thermometer className="w-4 h-4" />
              <span>Body Temperature Trend (°C)</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Normal: 36.8°C</span>
          </div>
          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeData}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey={xAxisKey} stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" domain={[35.5, 39.5]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#tempGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hydration & AQI Exposure */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase">
              <Droplets className="w-4 h-4" />
              <span>Hydration vs AQI Exposure</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Sync Active</span>
          </div>
          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeData}>
                <defs>
                  <linearGradient id="hydGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey={xAxisKey} stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" domain={[30, 250]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="hydration" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#hydGrad)" />
                <Area type="monotone" dataKey="aqi" stroke="#a855f7" strokeWidth={2} fillOpacity={0.2} fill="#a855f7" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
