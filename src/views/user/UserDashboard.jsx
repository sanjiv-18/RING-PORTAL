import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { 
  Heart, Wind, Thermometer, Droplets, Activity, Moon, 
  Sun, ShieldCheck, AlertTriangle, ArrowUpRight, Sparkles, Bell, User, CheckCircle2, Watch, CircleDot, Zap
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const UserDashboard = () => {
  const { vitals, environment, aiRisk, setUserTab, notifications, activeDevice, wearableReading } = useHealth();

  const trendData = [
    { time: '06:00', hr: 70, temp: 36.5, spo2: 98 },
    { time: '09:00', hr: 76, temp: 36.7, spo2: 97 },
    { time: '12:00', hr: 92, temp: 37.1, spo2: 96 },
    { time: '15:00', hr: vitals.heartRate, temp: vitals.temp, spo2: vitals.spO2 },
    { time: '18:00', hr: Math.max(72, vitals.heartRate - 10), temp: 36.9, spo2: 97 },
    { time: '21:00', hr: 74, temp: 36.6, spo2: 98 },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Good morning, Sanjiv</h1>
          <p className="text-xs text-slate-400 mt-0.5">Here's your health & wearable telemetry overview for today.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Active Wearable Badge */}
          <button
            onClick={() => setUserTab('devices')}
            className="flex items-center gap-2 px-3 py-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 rounded-xl border border-teal-500/30 text-xs font-bold transition"
          >
            <Watch className="w-4 h-4 text-teal-400" />
            <span>{activeDevice?.deviceName || 'Apple Watch Ultra 2'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={() => setUserTab('notifications')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 text-xs font-semibold transition"
          >
            <Bell className="w-4 h-4 text-teal-400" />
            <span>Notifications ({notifications.length})</span>
          </button>

          <button
            onClick={() => setUserTab('profile')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 text-xs font-semibold transition"
          >
            <User className="w-4 h-4 text-teal-400" />
            <span>Profile</span>
          </button>
        </div>
      </div>

      {/* 2. CURRENT HEALTH STATUS (VISUALLY DOMINANT BANNER) */}
      <div className={`p-6 rounded-2xl border transition-all duration-300 shadow-xl ${
        vitals.statusSeverity === 'normal'
          ? 'bg-slate-900/90 border-emerald-500/40'
          : vitals.statusSeverity === 'warning'
          ? 'bg-amber-950/30 border-amber-500/60'
          : 'bg-red-950/40 border-red-500/80'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
              vitals.statusSeverity === 'normal' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {vitals.statusSeverity === 'normal' ? <ShieldCheck className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Health Status</span>
              <h2 className="text-2xl font-extrabold text-white">
                {vitals.statusText}
              </h2>
              <p className="text-xs text-slate-300">
                {vitals.statusSeverity === 'normal'
                  ? 'All vital metrics and wearable PPG sensors are within baseline bounds.'
                  : 'Temperature and heart rate telemetry are above personal baseline thresholds.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setUserTab('wearables')}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 font-bold rounded-xl transition text-xs"
            >
              <Activity className="w-4 h-4" />
              <span>Wearable Analytics</span>
            </button>

            <button
              onClick={() => setUserTab('ai_analysis')}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl shadow transition text-xs whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Analysis</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. HEALTH SCORE & KEY VITALS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Health Score Gauge */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Health Score</span>
            <ShieldCheck className="w-4 h-4 text-teal-400" />
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white font-mono">{vitals.healthScore}</span>
              <span className="text-sm font-semibold text-slate-400">/ 100</span>
            </div>
            <div className={`text-xs font-extrabold ${vitals.healthScore < 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {vitals.healthScore < 60 ? 'Moderate Risk' : 'Optimal Health'}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
            <span>Live IoT Sensor Sync</span>
            <span className="text-emerald-400 font-bold">● Active</span>
          </div>
        </div>

        {/* Key Vitals (3 Columns Grid) */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {/* Heart Rate */}
          <div className="glass-card p-4 rounded-2xl space-y-2 border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase">Heart Rate</span>
              <Heart className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">{vitals.heartRate} BPM</div>
            <div className={`text-[11px] font-bold ${vitals.heartRate > 88 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {vitals.heartRate > 88 ? 'Above baseline ⚠️' : 'Normal ✓'}
            </div>
          </div>

          {/* SpO2 */}
          <div className="glass-card p-4 rounded-2xl space-y-2 border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase">SpO₂ Oxygen</span>
              <Wind className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">{vitals.spO2}%</div>
            <div className={`text-[11px] font-bold ${vitals.spO2 < 95 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {vitals.spO2 < 95 ? 'Below normal ⚠️' : 'Normal ✓'}
            </div>
          </div>

          {/* Stress & HRV (From Wearable) */}
          <div className="glass-card p-4 rounded-2xl space-y-2 border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase">Wearable Stress</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">{wearableReading.stressScore || 24} <span className="text-xs font-normal text-slate-400">/100</span></div>
            <div className={`text-[11px] font-bold ${(wearableReading.stressScore || 24) > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {wearableReading.stressLevel || 'Low'} strain (HRV {wearableReading.hrv || 68}ms)
            </div>
          </div>

          {/* Body Temperature */}
          <div className="glass-card p-4 rounded-2xl space-y-2 border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase">Temperature</span>
              <Thermometer className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">{vitals.temp}°C</div>
            <div className={`text-[11px] font-bold ${vitals.temp > 37.5 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {vitals.temp > 37.5 ? 'Elevated ⚠️' : 'Normal ✓'}
            </div>
          </div>

          {/* Hydration */}
          <div className="glass-card p-4 rounded-2xl space-y-2 border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase">Hydration</span>
              <Droplets className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">{vitals.hydration}%</div>
            <div className={`text-[11px] font-bold ${vitals.hydration < 50 ? 'text-amber-400' : 'text-cyan-400'}`}>
              {vitals.hydration < 50 ? 'Low ⚠️' : 'Good ✓'}
            </div>
          </div>

          {/* Sleep */}
          <div className="glass-card p-4 rounded-2xl space-y-2 border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase">Sleep Stage</span>
              <Moon className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">{vitals.sleep}</div>
            <div className="text-[11px] text-indigo-300 font-semibold">
              Quality: {wearableReading.sleepData?.qualityScore || 85}%
            </div>
          </div>
        </div>
      </div>

      {/* 4. HEALTH TREND VISUALIZATION */}
      <div className="glass-card p-6 rounded-2xl space-y-3 border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Health Trend Telemetry (24-Hour Stream)</h2>
          <span className="text-xs text-teal-400 font-mono">Live Sync</span>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="hrTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" domain={[60, 140]} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="hr" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#hrTrend)" name="Heart Rate (BPM)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. AI INSIGHT & 6. ENVIRONMENTAL IMPACT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Insight */}
        <div className="glass-card p-6 rounded-2xl space-y-3 border-slate-800">
          <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>AI Health Diagnostic Insight</span>
          </div>

          <p className="text-sm font-extrabold text-white">
            {aiRisk.overallScore > 60 ? 'Elevated heat-stress risk detected.' : 'Health indicators aligned with baseline.'}
          </p>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1 text-xs">
            <span className="font-bold text-slate-400 uppercase text-[10px]">Why:</span>
            <p className="text-slate-200">{aiRisk.whyText}</p>
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Recommended Actions:</span>
            <div className="flex flex-wrap gap-2 text-xs">
              {aiRisk.recommendedActions.map((rec, i) => (
                <span key={i} className="px-2.5 py-1 bg-slate-800 text-teal-300 rounded-lg font-semibold border border-slate-700">
                  ✓ {rec.action}: {rec.text}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="glass-card p-6 rounded-2xl space-y-4 border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Sun className="w-4 h-4" />
              <span>Environmental Impact</span>
            </div>
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase ${
              environment.outsideTemp >= 40 || environment.aqi > 200 ? 'bg-red-500 text-white' : 'bg-amber-500 text-slate-950'
            }`}>
              Risk: {environment.outsideTemp >= 40 || environment.aqi > 200 ? 'HIGH' : 'MODERATE'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Temperature</span>
              <div className="text-lg font-extrabold text-white mt-0.5">{environment.outsideTemp}°C</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">AQI</span>
              <div className="text-lg font-extrabold text-white mt-0.5">{environment.aqi}</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Humidity</span>
              <div className="text-lg font-extrabold text-white mt-0.5">{environment.humidity}%</div>
            </div>
          </div>

          <p className="text-xs text-slate-300">
            {aiRisk.respiratoryImpact || 'Ambient environmental factors monitored continuously by hyper-local sensors.'}
          </p>
        </div>
      </div>
    </div>
  );
};
