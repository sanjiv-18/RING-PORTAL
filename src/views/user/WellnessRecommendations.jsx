import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { Droplets, BedDouble, Wind, Activity, CheckCircle, Sparkles } from 'lucide-react';

export const WellnessRecommendations = () => {
  const { environment, vitals } = useHealth();

  const recommendations = [
    {
      id: 'hydration',
      category: '💧 Hydration',
      icon: Droplets,
      color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300',
      title: 'Hydration Target',
      recommendation: `You may need more water today because of high temperature (${environment.outsideTemp}°C) and current activity level.`,
      target: 'Goal: Drink 2.5L water minimum'
    },
    {
      id: 'rest',
      category: '🛌 Rest & Recovery',
      icon: BedDouble,
      color: 'border-indigo-500/40 bg-indigo-950/20 text-indigo-300',
      title: 'Rest Schedule',
      recommendation: `Your activity level (${vitals.activity} steps) is higher than your normal baseline. Rest for 15 minutes every 2 hours during peak heat.`,
      target: 'Target: 15-min afternoon nap'
    },
    {
      id: 'air_quality',
      category: '🌫️ Air Quality Protection',
      icon: Wind,
      color: 'border-purple-500/40 bg-purple-950/20 text-purple-300',
      title: 'Pollution Mitigation',
      recommendation: `Consider reducing outdoor activity due to poor AQI (${environment.aqi}). Keep indoor spaces ventilated with HEPA air filters.`,
      target: 'Action: Stay indoors 12 PM - 5 PM'
    },
    {
      id: 'activity',
      category: '🏃 Daily Activity',
      icon: Activity,
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
      title: 'Light Exercise Routine',
      recommendation: '20 minutes of moderate indoor activity or light yoga recommended in climate-controlled areas.',
      target: 'Goal: 20 mins indoor stretching'
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border-teal-500/30">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">WELLNESS & RECOMMENDATIONS</h1>
            <p className="text-xs text-slate-400">Personalized Health Guidance Tailored to Local Weather & Vitals</p>
          </div>
        </div>

        <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          Updated: Just now
        </div>
      </div>

      {/* Recommendations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec) => {
          const Icon = rec.icon;
          return (
            <div key={rec.id} className={`glass-card p-6 rounded-2xl border ${rec.color} space-y-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  <h2 className="font-extrabold text-white text-base">{rec.category}</h2>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-slate-300">
                  {rec.title}
                </span>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed">
                {rec.recommendation}
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-400">{rec.target}</span>
                <span className="text-teal-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Recommended
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
