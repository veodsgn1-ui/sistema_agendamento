import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ScheduleForm from './components/ScheduleForm';
import AppointmentList from './components/AppointmentList';
import Collaborators from './components/Collaborators';
import Plans from './components/Plans';
import Settings from './components/Settings';
import PublicPageSettings from './components/PublicPageSettings';
import { Appointment, ViewMode } from './types';

const STORAGE_KEY = 'agendaflow_appointments';

function loadAppointments(): Appointment[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveAppointments(appointments: Appointment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
}

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [appointments, setAppointments] = useState<Appointment[]>(loadAppointments);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    saveAppointments(appointments);
  }, [appointments]);

  const handleSaveAppointment = (appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment]);
  };

  const handleUpdateAppointment = (updated: Appointment) => {
    setAppointments(prev => prev.map(a => a.id === updated.id ? updated : a));
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard appointments={appointments} onNewAppointment={() => setCurrentView('schedule')} />;
      case 'schedule':
        return <ScheduleForm onSave={handleSaveAppointment} />;
      case 'appointments':
        return (
          <AppointmentList
            appointments={appointments}
            onUpdate={handleUpdateAppointment}
            onDelete={handleDeleteAppointment}
          />
        );
      case 'collaborators':
        return <Collaborators />;
      case 'plans':
        return <Plans />;
      case 'public-page':
        return <PublicPageSettings />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard appointments={appointments} onNewAppointment={() => setCurrentView('schedule')} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      </div>

      {/* Sidebar - Mobile */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar
          currentView={currentView}
          onViewChange={(view) => {
            setCurrentView(view);
            setSidebarOpen(false);
          }}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-auto">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-100 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </button>
          <div className="flex items-center gap-2">
            {theme.logo ? (
              <img src={theme.logo} alt="Logo" className="w-7 h-7 object-contain rounded-lg" />
            ) : (
              <div 
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` }}
              >
                {theme.companyName.charAt(0)}
              </div>
            )}
            <span className="font-bold text-slate-800 text-sm">{theme.companyName}</span>
          </div>
          <div className="w-9" />
        </div>

        {/* View Content */}
        <div key={currentView} className="animate-fadeIn">
          {renderView()}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
