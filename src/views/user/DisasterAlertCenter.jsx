import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { Flame, Waves, Wind, AlertOctagon, ShieldAlert, CheckCircle2, Navigation, AlertTriangle } from 'lucide-react';

export const DisasterAlertCenter = () => {
  const { environment } = useHealth();

  const disasterCards = [
    {
      id: 'heatwave',
      title: '🔥 Heat Wave Alert',
      badge: 'EXTREME HEAT ALERT',
      severity: 'high',
      metrics: `Temperature: ${environment.outsideTemp >= 40 ? environment.outsideTemp : 41}°C`,
      yourRisk: 'HIGH',
      recommendations: [
        'Avoid outdoor activity between 11:00 AM – 4:00 PM.',
        'Drink electrolytes every 60 minutes.',
        'Seek air-conditioned shelter immediately if experiencing dizziness.'
      ],
      icon: Flame,
      color: 'border-amber-500/50 bg-amber-950/20 text-amber-300'
    },
    {
      id: 'flood',
      title: '🌊 Flood Alert',
      badge: 'FLOOD WATCH',
      severity: 'moderate',
      metrics: 'Precipitation: 140mm / 24h',
      yourRisk: 'MODERATE',
      recommendations: [
        'Avoid low-lying areas and storm drains.',
        'Keep emergency waterproof survival kits ready.',
        'Charge power banks and stay connected to local weather radios.'
      ],
      icon: Waves,
      color: 'border-blue-500/50 bg-blue-950/20 text-blue-300'
    },
    {
      id: 'cyclone',
      title: '🌪️ Cyclone Warning',
      badge: 'CYCLONE WARNING',
      severity: 'high',
      metrics: 'Wind Speed: 85 km/h gusts',
      yourRisk: 'HIGH',
      recommendations: [
        'Follow official municipal emergency evacuation directives.',
        'Secure loose outdoor objects and stay clear of glass windows.',
        'Store 3 days of potable water and non-perishable food.'
      ],
      icon: Wind,
      color: 'border-purple-500/50 bg-purple-950/20 text-purple-300'
    },
    {
      id: 'pollution',
      title: '🌫️ Air Pollution Alert',
      badge: 'POOR AIR QUALITY',
      severity: 'high',
      metrics: `Current AQI: ${environment.aqi > 180 ? environment.aqi : 187}`,
      yourRisk: 'HIGH (Respiratory Risk)',
      recommendations: [
        'Wear N95/FFP2 protective respirators outdoors.',
        'Run indoor air purifiers on high mode.',
        'Individuals with asthma should keep emergency inhalers ready.'
      ],
      icon: AlertOctagon,
      color: 'border-rose-500/50 bg-rose-950/20 text-rose-300'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-card p-6 rounded-2xl border-red-500/40">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/40">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">DISASTER & SAFETY ALERT CENTER</h1>
            <p className="text-xs text-slate-400">National Emergency Operations & Hyper-local Disaster Warning Feed</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-xl text-xs text-red-400 font-bold">
          <AlertTriangle className="w-4 h-4" />
          <span>4 Active Advisories in Your Region</span>
        </div>
      </div>

      {/* Grid of Disaster Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {disasterCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className={`glass-card p-6 rounded-2xl border transition-all duration-300 space-y-4 ${card.color}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-6 h-6" />
                  <h2 className="text-lg font-extrabold text-white">{card.title}</h2>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider bg-slate-950/80 border border-slate-700 text-white">
                  {card.badge}
                </span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">{card.metrics}</span>
                <span className="font-bold text-red-400">Your Risk: {card.yourRisk}</span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Safety Recommendations:</span>
                <ul className="space-y-1.5">
                  {card.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
