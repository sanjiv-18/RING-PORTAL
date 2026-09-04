import React from 'react';
import { useHealth } from '../context/HealthContext';
import { 
  ShieldCheck, HeartPulse, Stethoscope, Settings, Bell, 
  Activity, Cpu, CloudRain, AlertTriangle, BarChart3, 
  Sparkles, Sliders, Shield, User, Droplets, PhoneCall, CheckCircle2, LogOut
} from 'lucide-react';

export const Navbar = () => {
  const { 
    role, setRole, 
    userTab, setUserTab, 
    doctorTab, setDoctorTab, 
    adminTab, setAdminTab,
    notifications,
    vitals,
    triggerFallSimulation
  } = useHealth();

  const userTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: HeartPulse },
    { id: 'ai_analysis', label: 'AI Health Analysis', icon: Sparkles },
    { id: 'environment', label: 'Environment', icon: CloudRain },
    { id: 'disaster', label: 'Disaster Alerts', icon: AlertTriangle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'emergency', label: 'Emergency / SOS', icon: PhoneCall, badge: vitals.statusSeverity === 'warning' ? 'SOS' : null },
    { id: 'wellness', label: 'Wellness', icon: Droplets },
    { id: 'baseline', label: 'Personal Baseline', icon: Sliders },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.length },
    { id: 'privacy', label: 'Privacy Center', icon: Shield },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const doctorTabs = [
    { id: 'dashboard', label: 'Clinical Dashboard', icon: HeartPulse },
    { id: 'patient_list', label: 'Patient Directory', icon: User },
    { id: 'patient_view', label: 'Patient Health View', icon: Activity },
    { id: 'alerts', label: 'High-Risk Alerts', icon: AlertTriangle, badge: '3' },
    { id: 'notes', label: 'Clinical Notes', icon: CheckCircle2 },
  ];

  const adminTabs = [
    { id: 'overview', label: 'System Overview', icon: Cpu },
    { id: 'users', label: 'User Directory', icon: User },
    { id: 'doctors', label: 'Doctor Directory', icon: Stethoscope },
    { id: 'alerts', label: 'System Alerts', icon: AlertTriangle },
    { id: 'system', label: 'Edge AI Status', icon: Settings },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-[33px] z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-3 border-b border-slate-800/60 gap-3">
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 shadow-md shadow-teal-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-teal-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base text-white tracking-wide">HEALTHGUARD <span className="text-teal-400">AI</span></h1>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 rounded">
                  {role.toUpperCase()} PORTAL
                </span>
              </div>
            </div>
          </div>

          {/* Role Switcher Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setRole('user')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  role === 'user'
                    ? 'bg-teal-500 text-slate-950 font-extrabold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>User</span>
              </button>

              <button
                onClick={() => setRole('doctor')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  role === 'doctor'
                    ? 'bg-blue-600 text-white font-extrabold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Doctor</span>
              </button>

              <button
                onClick={() => setRole('admin')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  role === 'admin'
                    ? 'bg-purple-600 text-white font-extrabold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>

            {/* Quick SOS Trigger */}
            <button
              onClick={triggerFallSimulation}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow border border-red-400/30 transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Test Emergency SOS</span>
            </button>
          </div>
        </div>

        {/* Navigation Sub-Tabs Bar */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none text-xs">
          {role === 'user' && userTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = userTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setUserTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-slate-800 text-teal-400 border border-teal-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    tab.id === 'emergency' ? 'bg-red-500 text-white animate-pulse' : 'bg-teal-500/20 text-teal-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

          {role === 'doctor' && doctorTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = doctorTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setDoctorTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-slate-800 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 bg-blue-500/20 text-blue-300 rounded text-[10px] font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

          {role === 'admin' && adminTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-slate-800 text-purple-400 border border-purple-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
