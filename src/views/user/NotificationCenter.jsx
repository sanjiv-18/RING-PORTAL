import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { Bell, AlertOctagon, Flame, Wind, CheckCircle2, ShieldAlert } from 'lucide-react';

export const NotificationCenter = () => {
  const { notifications } = useHealth();

  const getIcon = (type) => {
    switch (type) {
      case 'critical':
        return <AlertOctagon className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'info':
        return <Wind className="w-5 h-5 text-purple-400" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      default:
        return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'critical':
        return 'border-red-500/40 bg-red-950/20';
      case 'warning':
        return 'border-amber-500/40 bg-amber-950/20';
      case 'info':
        return 'border-purple-500/40 bg-purple-950/20';
      case 'success':
        return 'border-emerald-500/40 bg-emerald-950/20';
      default:
        return 'border-slate-800 bg-slate-900';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <Bell className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">NOTIFICATION CENTER</h1>
            <p className="text-xs text-slate-400">Prioritized Safety Alerts & Health Updates Feed</p>
          </div>
        </div>

        <span className="text-xs px-3 py-1 bg-slate-950 border border-slate-800 text-slate-300 rounded-xl font-mono">
          {notifications.length} Total Alerts Logged
        </span>
      </div>

      {/* Notification Stream */}
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`glass-card p-5 rounded-2xl border transition-all ${getBorderColor(n.type)} flex items-start gap-4`}
          >
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
              {getIcon(n.type)}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <span>{n.type === 'critical' ? '🔴' : n.type === 'warning' ? '🟠' : n.type === 'info' ? '🟡' : '🟢'}</span>
                  <span>{n.title}</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400">{n.time}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {n.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
