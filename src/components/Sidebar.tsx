import { Calendar, PlusCircle, List, Settings, LayoutDashboard } from 'lucide-react';
import { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const menuItems = [
  { id: 'dashboard' as ViewMode, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'schedule' as ViewMode, label: 'Novo Agendamento', icon: PlusCircle },
  { id: 'appointments' as ViewMode, label: 'Agendamentos', icon: List },
  { id: 'settings' as ViewMode, label: 'Configurações', icon: Settings },
];

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen p-4 flex flex-col shadow-xl">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg">AgendaFlow</h1>
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
                  ? 'bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
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
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-emerald-400 text-xs font-medium">Sistema Ativo</span>
        </div>
        <p className="text-slate-400 text-xs">Integrações conectadas</p>
      </div>
    </aside>
  );
}
