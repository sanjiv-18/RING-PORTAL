import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { 
  ShieldCheck, HeartPulse, Sparkles, CloudRain, AlertTriangle, 
  BarChart3, Droplets, Sliders, PhoneCall, Bell, Shield, User, 
  Stethoscope, Settings, ChevronLeft, ChevronRight, Menu, X, 
  Watch, Activity, Radio
} from 'lucide-react';

export const Sidebar = () => {
  const { 
    role, setRole, 
    userTab, setUserTab, 
    doctorTab, setDoctorTab, 
    adminTab, setAdminTab,
    notifications,
    vitals,
    devices,
    isBackendConnected
  } = useHealth();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const connectedCount = devices.filter(d => d.connectionStatus === 'CONNECTED').length;

  const mainNavItems = [
    { id: 'dashboard', label: 'Overview', icon: HeartPulse },
    { id: 'devices', label: 'Connected Devices', icon: Watch, badge: connectedCount ? `${connectedCount} Active` : null },
    { id: 'wearables', label: 'Wearable Analytics', icon: Activity },
    { id: 'ai_analysis', label: 'AI Analysis', icon: Sparkles },
    { id: 'environment', label: 'Environment', icon: CloudRain },
    { id: 'disaster', label: 'Alerts & Safety', icon: AlertTriangle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'wellness', label: 'Wellness', icon: Droplets },
    { id: 'baseline', label: 'Personal Baseline', icon: Sliders },
    { id: 'emergency', label: 'Emergency / SOS', icon: PhoneCall, badge: vitals.statusSeverity === 'warning' ? 'SOS' : null },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.length },
  ];

  const secondaryNavItems = [
    { id: 'privacy', label: 'Privacy Center', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleUserTabClick = (tabId) => {
    setRole('user');
    setUserTab(tabId);
    setMobileOpen(false);
  };

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Header Toggle */}
      <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-3 flex items-center justify-between sticky top-[33px] z-30">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-400" />
          <span className="font-extrabold text-white text-sm">HEALTHGUARD <span className="text-teal-400">AI</span></span>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop & Mobile Drawer Sidebar */}
      <aside
        className={`fixed lg:sticky top-[33px] left-0 z-40 h-[calc(100vh-33px)] bg-slate-900/95 backdrop-blur-lg border-r border-slate-800 transition-all duration-300 flex flex-col justify-between ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top Header & Logo */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 shadow-md shadow-teal-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-teal-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            {!collapsed && (
              <div>
                <h1 className="font-extrabold text-sm text-white tracking-wide">HEALTHGUARD <span className="text-teal-400">AI</span></h1>
                <p className="text-[10px] text-slate-400">IoT & Healthcare Platform</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg bg-slate-950 text-slate-400 hover:text-white border border-slate-800 transition"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-none">
          {/* Main User Navigation */}
          <div className="space-y-1">
            {!collapsed && (
              <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                Patient Telemetry
              </span>
            )}
            {mainNavItems.map(item => {
              const Icon = item.icon;
              const isActive = role === 'user' && userTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleUserTabClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition ${
                    isActive
                      ? 'bg-slate-800 text-teal-400 border border-teal-500/30 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                  title={collapsed ? item.label : ''}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className={`ml-auto px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      item.id === 'emergency' 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : item.id === 'devices'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-teal-500/20 text-teal-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Portals Group (Doctor & Admin) */}
          <div className="space-y-1 border-t border-slate-800/80 pt-4">
            {!collapsed && (
              <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                Role Portals
              </span>
            )}
            <button
              onClick={() => handleRoleSwitch('doctor')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition ${
                role === 'doctor'
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              } ${collapsed ? 'justify-center px-0' : ''}`}
              title={collapsed ? 'Doctor Portal' : ''}
            >
              <Stethoscope className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">Doctor Portal</span>}
            </button>

            <button
              onClick={() => handleRoleSwitch('admin')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition ${
                role === 'admin'
                  ? 'bg-purple-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              } ${collapsed ? 'justify-center px-0' : ''}`}
              title={collapsed ? 'Admin Portal' : ''}
            >
              <Settings className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">Admin Portal</span>}
            </button>
          </div>

          {/* Secondary Options */}
          <div className="space-y-1 border-t border-slate-800/80 pt-4">
            {!collapsed && (
              <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                System & Account
              </span>
            )}
            {secondaryNavItems.map(item => {
              const Icon = item.icon;
              const isActive = role === 'user' && userTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleUserTabClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-xs transition ${
                    isActive
                      ? 'bg-slate-800 text-teal-400 border border-teal-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                  title={collapsed ? item.label : ''}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Profile & Connection Status */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center font-bold text-xs shrink-0">
              S
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-white truncate">Sanjiv Venkat</h4>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  {isBackendConnected ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">● REST API Sync</span>
                  ) : (
                    <span className="text-red-400 font-semibold flex items-center gap-1">● Offline</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
