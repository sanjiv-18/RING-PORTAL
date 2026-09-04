import React, { useState, useEffect } from 'react';
import { useHealth } from '../../context/HealthContext';
import { apiService } from '../../services/api';
import { 
  Activity, 
  Moon, 
  HeartPulse, 
  Flame, 
  Footprints, 
  ShieldCheck, 
  Sparkles, 
  Watch, 
  Zap, 
  TrendingUp, 
  CircleDot,
  AlertTriangle,
  Battery,
  Layers,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const WearableAnalytics = () => {
  const { 
    wearableReading, 
    activeDevice, 
    wearableInsights, 
    vitals 
  } = useHealth();

  const [timeRange, setTimeRange] = useState('7_days');
  const [historyData, setHistoryData] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const res = await apiService.getWearableHistory(timeRange);
        if (res && isMounted) {
          setHistoryData(res);
        }
      } catch (e) {
        console.error('Failed to fetch wearable history:', e);
      } finally {
        if (isMounted) setLoadingHistory(false);
      }
    };
    fetchHistory();
    return () => { isMounted = false; };
  }, [timeRange]);

  const sleepData = wearableReading.sleepData || {
    duration: '7h 20m',
    qualityScore: 85,
    deepSleepMinutes: 110,
    remSleepMinutes: 95,
    lightSleepMinutes: 235,
    awakeMinutes: 20
  };

  const defaultSleepTrends = [
    { day: 'Mon', deep: 95, rem: 80, light: 240, awake: 25, score: 82 },
    { day: 'Tue', deep: 105, rem: 90, light: 230, awake: 15, score: 88 },
    { day: 'Wed', deep: 70, rem: 65, light: 210, awake: 45, score: 68 },
    { day: 'Thu', deep: sleepData.deepSleepMinutes, rem: sleepData.remSleepMinutes, light: sleepData.lightSleepMinutes, awake: sleepData.awakeMinutes, score: sleepData.qualityScore },
    { day: 'Fri', deep: 115, rem: 100, light: 250, awake: 15, score: 90 },
    { day: 'Sat', deep: 125, rem: 110, light: 260, awake: 10, score: 94 },
    { day: 'Sun', deep: 120, rem: 105, light: 255, awake: 12, score: 92 }
  ];

  const defaultStressTrends = [
    { day: 'Mon', avgStress: 28, peakStress: 55, hrv: 72 },
    { day: 'Tue', avgStress: 34, peakStress: 62, hrv: 68 },
    { day: 'Wed', avgStress: 58, peakStress: 84, hrv: 48 },
    { day: 'Thu', avgStress: wearableReading.stressScore || 32, peakStress: 65, hrv: wearableReading.hrv || 68 },
    { day: 'Fri', avgStress: 30, peakStress: 58, hrv: 70 },
    { day: 'Sat', avgStress: 20, peakStress: 40, hrv: 78 },
    { day: 'Sun', avgStress: 22, peakStress: 38, hrv: 76 }
  ];

  const defaultActivityTrends = [
    { day: 'Mon', steps: 8200, calories: 590, activeMins: 45 },
    { day: 'Tue', steps: 9100, calories: 640, activeMins: 55 },
    { day: 'Wed', steps: 6400, calories: 480, activeMins: 30 },
    { day: 'Thu', steps: wearableReading.steps || 8500, calories: wearableReading.calories || 620, activeMins: 50 },
    { day: 'Fri', steps: 10200, calories: 730, activeMins: 65 },
    { day: 'Sat', steps: 11500, calories: 810, activeMins: 75 },
    { day: 'Sun', steps: 7800, calories: 550, activeMins: 40 }
  ];

  const sleepChartData = historyData?.sleepTrends || defaultSleepTrends;
  const stressChartData = historyData?.stressTrends || defaultStressTrends;
  const activityChartData = historyData?.activityTrends || defaultActivityTrends;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-teal-500/20 to-emerald-500/20 text-teal-400 border border-teal-500/30">
              <Activity className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-white tracking-wide">Wearable Telemetry & Biometrics</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1">
              <CircleDot className="w-3 h-3 text-emerald-400 animate-pulse" />
              Live PPG & IMU Feed
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time multi-sensor telemetry streaming from <span className="text-white font-semibold">{activeDevice?.deviceName || wearableReading.deviceName || 'Smart Wearable'}</span>
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          {['today', '7_days', '30_days'].map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                timeRange === r
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {r === 'today' ? 'Today' : r === '7_days' ? 'Last 7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Heart Rate */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Resting HR</span>
            <HeartPulse className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono">{wearableReading.heartRate} <span className="text-xs font-normal text-slate-400">BPM</span></div>
            <div className="text-[10px] text-emerald-400 font-bold mt-1">● Optical PPG Active</div>
          </div>
        </div>

        {/* SpO2 */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Blood Oxygen</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono">{wearableReading.spo2}%</div>
            <div className="text-[10px] text-teal-300 font-bold mt-1">Pulse Oximetry</div>
          </div>
        </div>

        {/* Stress Score */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Stress Index</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono">{wearableReading.stressScore || 24} <span className="text-xs font-normal text-slate-400">/100</span></div>
            <div className={`text-[10px] font-bold mt-1 ${
              (wearableReading.stressScore || 24) > 60 ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {wearableReading.stressLevel || 'Low'} Strain
            </div>
          </div>
        </div>

        {/* HRV */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">HRV (RMSSD)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono">{wearableReading.hrv || 68} <span className="text-xs font-normal text-slate-400">ms</span></div>
            <div className="text-[10px] text-slate-400 font-bold mt-1">Autonomic Tone</div>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Daily Steps</span>
            <Footprints className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono">{wearableReading.steps?.toLocaleString() || '8,500'}</div>
            <div className="text-[10px] text-emerald-400 font-bold mt-1">Goal: 10,000</div>
          </div>
        </div>

        {/* Active Calories */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Burn</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono">{wearableReading.calories || 620} <span className="text-xs font-normal text-slate-400">kcal</span></div>
            <div className="text-[10px] text-orange-400 font-bold mt-1">Metabolic Rate</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Sleep Architecture & Stress Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sleep Architecture Panel (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">Sleep Architecture & Stages</h3>
                  <p className="text-xs text-slate-400">Deep, REM, Light, and Awake breakdown</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xl font-black text-indigo-300 font-mono">{sleepData.qualityScore}/100</span>
                <p className="text-[10px] text-slate-400">Sleep Score</p>
              </div>
            </div>

            {/* Stage Summary Pills */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-center">
                <span className="text-[10px] text-slate-400 block font-bold">Deep</span>
                <span className="text-xs font-extrabold text-indigo-400 font-mono">{sleepData.deepSleepMinutes}m</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-center">
                <span className="text-[10px] text-slate-400 block font-bold">REM</span>
                <span className="text-xs font-extrabold text-purple-400 font-mono">{sleepData.remSleepMinutes}m</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-center">
                <span className="text-[10px] text-slate-400 block font-bold">Light</span>
                <span className="text-xs font-extrabold text-teal-400 font-mono">{sleepData.lightSleepMinutes}m</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-center">
                <span className="text-[10px] text-slate-400 block font-bold">Awake</span>
                <span className="text-xs font-extrabold text-amber-400 font-mono">{sleepData.awakeMinutes}m</span>
              </div>
            </div>

            {/* Sleep Stages Chart */}
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sleepChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="deep" name="Deep (mins)" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="rem" name="REM (mins)" stackId="a" fill="#a855f7" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="light" name="Light (mins)" stackId="a" fill="#14b8a6" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="awake" name="Awake (mins)" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Stress & Autonomic Tone (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">Stress & HRV Balance</h3>
                  <p className="text-xs text-slate-400">Sympathetic vs Parasympathetic tone</p>
                </div>
              </div>
            </div>

            {/* Stress vs HRV Chart */}
            <div className="h-60 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stressChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="avgStress" name="Stress Index" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="hrv" name="HRV (ms)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
              <span>
                HRV of <strong className="text-white">{wearableReading.hrv || 68}ms</strong> indicates good physiological recovery capacity and resilient autonomic regulation.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI IoT Recovery Insights */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <h3 className="font-bold text-sm text-white tracking-wide uppercase text-xs">AI Wearable Insights & Diagnostics</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(wearableInsights?.length ? wearableInsights : [
            {
              id: 'ins_1',
              category: 'Sleep Architecture',
              title: 'Optimal Deep Sleep Recovery',
              description: `Your ${sleepData.deepSleepMinutes} minutes of deep sleep last night is 18% above your baseline, facilitating neuro-cellular regeneration.`,
              tag: 'Positive Recovery',
              badgeColor: 'emerald'
            },
            {
              id: 'ins_2',
              category: 'Autonomic Balance',
              title: (wearableReading.stressScore || 24) > 50 ? 'Elevated Sympathetic Tone' : 'Balanced Parasympathetic Tone',
              description: (wearableReading.stressScore || 24) > 50 
                ? 'Stress index is high. Consider 5 minutes of resonant coherent breathing to restore vagal tone.' 
                : `HRV is robust at ${wearableReading.hrv || 68}ms, indicating low cumulative fatigue.`,
              tag: (wearableReading.stressScore || 24) > 50 ? 'Action Recommended' : 'Optimal Balance',
              badgeColor: (wearableReading.stressScore || 24) > 50 ? 'amber' : 'teal'
            },
            {
              id: 'ins_3',
              category: 'Cardiovascular Efficiency',
              title: 'Stable Resting Heart Rate',
              description: 'Optical PPG sensor reports 0 irregular pulse rhythm episodes over the past 24 hours.',
              tag: 'Normal Rhythm',
              badgeColor: 'blue'
            }
          ]).map((item, idx) => (
            <div key={item.id || idx} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{item.category}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.badgeColor === 'emerald' ? 'bg-emerald-500/20 text-emerald-300' :
                    item.badgeColor === 'amber' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-blue-500/20 text-blue-300'
                  }`}>
                    {item.tag}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-white mb-2">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
