import React from 'react';
import { HealthProvider, useHealth } from './context/HealthContext';
import { SimulationBar } from './components/SimulationBar';
import { Sidebar } from './components/Sidebar';
import { FallDetectionModal } from './components/FallDetectionModal';

// User Views
import { UserDashboard } from './views/user/UserDashboard';
import { ConnectedDevices } from './views/user/ConnectedDevices';
import { WearableAnalytics } from './views/user/WearableAnalytics';
import { AIHealthAnalysis } from './views/user/AIHealthAnalysis';
import { EnvironmentalMonitoring } from './views/user/EnvironmentalMonitoring';
import { DisasterAlertCenter } from './views/user/DisasterAlertCenter';
import { HealthAnalytics } from './views/user/HealthAnalytics';
import { EmergencySOS } from './views/user/EmergencySOS';
import { WellnessRecommendations } from './views/user/WellnessRecommendations';
import { PersonalBaseline } from './views/user/PersonalBaseline';
import { NotificationCenter } from './views/user/NotificationCenter';
import { UserProfile } from './views/user/UserProfile';
import { PrivacyCenter } from './views/user/PrivacyCenter';
import { SettingsView } from './views/user/SettingsView';

// Doctor Views
import { DoctorDashboard } from './views/doctor/DoctorDashboard';
import { PatientList } from './views/doctor/PatientList';
import { PatientDetailView } from './views/doctor/PatientDetailView';
import { DoctorAlerts } from './views/doctor/DoctorAlerts';
import { DoctorNotes } from './views/doctor/DoctorNotes';

// Admin Views
import { AdminDashboard } from './views/admin/AdminDashboard';

const MainContent = () => {
  const { role, userTab, doctorTab, adminTab } = useHealth();

  const renderUserView = () => {
    switch (userTab) {
      case 'dashboard': return <UserDashboard />;
      case 'devices': return <ConnectedDevices />;
      case 'wearables': return <WearableAnalytics />;
      case 'ai_analysis': return <AIHealthAnalysis />;
      case 'environment': return <EnvironmentalMonitoring />;
      case 'disaster': return <DisasterAlertCenter />;
      case 'analytics': return <HealthAnalytics />;
      case 'emergency': return <EmergencySOS />;
      case 'wellness': return <WellnessRecommendations />;
      case 'baseline': return <PersonalBaseline />;
      case 'notifications': return <NotificationCenter />;
      case 'privacy': return <PrivacyCenter />;
      case 'profile': return <UserProfile />;
      case 'settings': return <SettingsView />;
      default: return <UserDashboard />;
    }
  };

  const renderDoctorView = () => {
    switch (doctorTab) {
      case 'dashboard': return <DoctorDashboard />;
      case 'patient_list': return <PatientList />;
      case 'patient_view': return <PatientDetailView />;
      case 'alerts': return <DoctorAlerts />;
      case 'notes': return <DoctorNotes />;
      default: return <DoctorDashboard />;
    }
  };

  const renderAdminView = () => {
    switch (adminTab) {
      case 'overview':
      case 'users':
      case 'doctors':
      case 'alerts':
      case 'system':
      default: return <AdminDashboard />;
    }
  };

  return (
    <main className="flex-1 px-4 py-6 overflow-y-auto">
      {role === 'user' && renderUserView()}
      {role === 'doctor' && renderDoctorView()}
      {role === 'admin' && renderAdminView()}
    </main>
  );
};

export default function App() {
  return (
    <HealthProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
        <SimulationBar />
        <div className="flex flex-1">
          <Sidebar />
          <MainContent />
        </div>
        <FallDetectionModal />
      </div>
    </HealthProvider>
  );
}
