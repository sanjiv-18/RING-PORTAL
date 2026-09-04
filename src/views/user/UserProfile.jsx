import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { User, Shield, Heart, Phone, MapPin, Bell, Save } from 'lucide-react';

export const UserProfile = () => {
  const { emergencyContacts } = useHealth();
  const [profile, setProfile] = useState({
    name: 'Sanjiv Venkat',
    age: 34,
    height: '178 cm',
    weight: '74 kg',
    bloodType: 'O+ Positive',
    conditions: 'Mild Seasonal Asthma, Heat Sensitivity',
    locationPermission: true,
    dataSharing: false,
    notificationsEnabled: true
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 glass-card p-6 rounded-2xl">
        <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
          <User className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">USER PROFILE & PREFERENCES</h1>
          <p className="text-xs text-slate-400">Personal Health Metrics, Emergency Contacts & System Settings</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Heart className="w-4 h-4 text-teal-400" />
            <span>Biometric Profile</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-slate-400 font-medium">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile({...profile, name: e.target.value})}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:border-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium">Age</label>
              <input
                type="number"
                value={profile.age}
                onChange={e => setProfile({...profile, age: e.target.value})}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:border-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium">Height</label>
              <input
                type="text"
                value={profile.height}
                onChange={e => setProfile({...profile, height: e.target.value})}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:border-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium">Weight</label>
              <input
                type="text"
                value={profile.weight}
                onChange={e => setProfile({...profile, weight: e.target.value})}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:border-teal-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Permissions & Controls */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Shield className="w-4 h-4 text-teal-400" />
            <span>Permissions & Settings</span>
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-400" />
                <div>
                  <h3 className="text-xs font-bold text-white">Location Permission</h3>
                  <p className="text-[11px] text-slate-400">Required for micro-local weather & AQI disaster alerts</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={profile.locationPermission}
                onChange={e => setProfile({...profile, locationPermission: e.target.checked})}
                className="w-4 h-4 accent-teal-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-slate-400" />
                <div>
                  <h3 className="text-xs font-bold text-white">Push & SMS Emergency Alerts</h3>
                  <p className="text-[11px] text-slate-400">High-priority alerts during heatwaves or extreme AQI</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={profile.notificationsEnabled}
                onChange={e => setProfile({...profile, notificationsEnabled: e.target.checked})}
                className="w-4 h-4 accent-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          {saved && <span className="text-xs text-emerald-400 font-bold">✓ Profile settings saved!</span>}
          <button
            type="submit"
            className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
