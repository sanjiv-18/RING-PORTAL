import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { Settings, User, Bell, Shield, Phone, Key, Save, CheckCircle2 } from 'lucide-react';

export const SettingsView = () => {
  const { emergencyContacts } = useHealth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: 'Sanjiv Venkat',
    email: 'sanjiv@healthguard.ai',
    age: 34,
    height: '178 cm',
    weight: '74 kg',
    bloodType: 'O+',
    notifyEmergencies: true,
    notifyHeatStress: true,
    notifyDailySummary: false,
    localAiOnly: true,
    cloudBackup: false,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'emergency', label: 'Emergency Contacts', icon: Phone },
    { id: 'privacy', label: 'Privacy & Data', icon: Shield },
    { id: 'security', label: 'Security', icon: Key },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="glass-card p-6 rounded-2xl border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">SYSTEM & USER SETTINGS</h1>
            <p className="text-xs text-slate-400">Configure account preferences, emergency contacts, and privacy permissions.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="glass-card p-3 rounded-2xl border-slate-800 space-y-1 h-fit">
          {tabs.map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition ${
                  isActive ? 'bg-slate-800 text-teal-400 border border-teal-500/30 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Content Body */}
        <div className="md:col-span-3 glass-card p-6 rounded-2xl border-slate-800">
          <form onSubmit={handleSave} className="space-y-6">
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
                  Personal Biometric Profile
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-medium">Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:border-teal-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium">Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:border-teal-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium">Age</label>
                    <input
                      type="number"
                      value={form.age}
                      onChange={e => setForm({...form, age: Number(e.target.value)})}
                      className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:border-teal-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium">Blood Type</label>
                    <input
                      type="text"
                      value={form.bloodType}
                      onChange={e => setForm({...form, bloodType: e.target.value})}
                      className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:border-teal-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
                  Notification Delivery Preferences
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div>
                      <h3 className="text-xs font-bold text-white">Emergency SOS Alerts</h3>
                      <p className="text-[11px] text-slate-400">Receive high-priority SMS and voice dispatch calls</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={form.notifyEmergencies}
                      onChange={e => setForm({...form, notifyEmergencies: e.target.checked})}
                      className="w-4 h-4 accent-teal-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div>
                      <h3 className="text-xs font-bold text-white">Heat Stress & AQI Advisories</h3>
                      <p className="text-[11px] text-slate-400">Receive alerts when outdoor temperature exceeds baseline</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={form.notifyHeatStress}
                      onChange={e => setForm({...form, notifyHeatStress: e.target.checked})}
                      className="w-4 h-4 accent-teal-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'emergency' && (
              <div className="space-y-4">
                <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
                  Designated Emergency Contacts
                </h2>
                <div className="space-y-2">
                  {emergencyContacts.map((contact, index) => (
                    <div key={index} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white text-xs">{contact.name} ({contact.relation})</h4>
                        <span className="text-[11px] font-mono text-teal-400">{contact.phone}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">Active</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-4">
                <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
                  On-Device Privacy & Data Retention
                </h2>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-teal-400 uppercase">Local Edge Processing</span>
                  <p className="text-xs text-slate-300">
                    Your health information is processed locally whenever possible. You control what information is shared with authorized healthcare providers.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-4">
                <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
                  Account Security
                </h2>
                <div>
                  <label className="text-xs text-slate-400 font-medium">Change Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password..."
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:border-teal-500 outline-none"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              {saved && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Settings updated!
                </span>
              )}
              <button
                type="submit"
                className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow transition"
              >
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
