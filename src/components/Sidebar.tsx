import { Calendar, PlusCircle, List, Settings, LayoutDashboard, Users, CreditCard, Globe } from 'lucide-react';
import { ViewMode } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const menuItems = [
  { id: 'dashboard' as ViewMode, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'schedule' as ViewMode, label: 'Novo Agendamento', icon: PlusCircle },
  { id: 'appointments' as ViewMode, label: 'Agendamentos', icon: List },
  { id: 'public-page' as ViewMode, label: 'Página Online', icon: Globe },
  { id: 'collaborators' as ViewMode, label: 'Colaboradores', icon: Users },
  { id: 'plans' as ViewMode, label: 'Planos', icon: CreditCard },
  { id: 'settings' as ViewMode, label: 'Configurações', icon: Settings },
];

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { theme } = useTheme();

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen p-4 flex flex-col shadow-xl">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        {theme.logo ? (
          <img src={theme.logo} alt="Logo" className="w-10 h-10 object-contain rounded-xl" />
        ) : (
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg text-white"
            style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` }}
          >
            <Calendar className="w-5 h-5" />
          </div>
        )}
        <div>
          <h1 className="text-white font-bold text-lg">{theme.companyName}</h1>
          <p className="text-slate-400 text-xs">WhatsApp + Google Agenda</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                isActive
                  ? 'text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
              style={isActive ? { 
                backgroundColor: `${theme.primaryColor}30`,
                color: theme.primaryColor,
                boxShadow: `0 4px 6px -1px ${theme.primaryColor}20`
              } : {}}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: theme.primaryColor }}
          />
          <span className="text-xs font-medium" style={{ color: theme.primaryColor }}>Sistema Ativo</span>
        </div>
        <p className="text-slate-400 text-xs">Integrações conectadas</p>
      </div>
    </aside>
  );
}
