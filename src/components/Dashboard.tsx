import { Calendar, MessageCircle, Clock, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { Appointment } from '../types';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTheme } from '../contexts/ThemeContext';

interface DashboardProps {
  appointments: Appointment[];
  onNewAppointment: () => void;
}

export default function Dashboard({ appointments, onNewAppointment }: DashboardProps) {
  const { theme } = useTheme();
  const todayAppointments = appointments.filter(a => isToday(parseISO(a.date)));
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed');
  const completedAppointments = appointments.filter(a => a.status === 'completed');

  const stats = [
    { label: 'Hoje', value: todayAppointments.length, icon: Clock, color: '#3b82f6', bgColor: 'bg-blue-500/10' },
    { label: 'Pendentes', value: pendingAppointments.length, icon: TrendingUp, color: '#f59e0b', bgColor: 'bg-amber-500/10' },
    { label: 'Confirmados', value: confirmedAppointments.length, icon: CheckCircle, color: '#10b981', bgColor: 'bg-emerald-500/10' },
    { label: 'Total', value: appointments.length, icon: Users, color: '#8b5cf6', bgColor: 'bg-purple-500/10' },
  ];

  const upcomingAppointments = appointments
    .filter(a => a.status !== 'cancelled' && a.status !== 'completed')
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">Visão geral dos seus agendamentos</p>
        </div>
        <button
          onClick={onNewAppointment}
          className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-medium shadow-lg transition-all duration-200 hover:-translate-y-0.5"
          style={{ 
            background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
            boxShadow: `0 10px 15px -3px ${theme.primaryColor}40`
          }}
        >
          <Calendar className="w-4 h-4" />
          Novo Agendamento
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 animate-slideUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Próximos Agendamentos</h2>
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400">Nenhum agendamento próximo</p>
              <button
                onClick={onNewAppointment}
                className="mt-3 text-emerald-600 font-medium text-sm hover:text-emerald-700"
              >
                Criar primeiro agendamento →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((apt, index) => (
                <div
                  key={apt.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors animate-slideRight"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {format(parseISO(apt.date), 'dd')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">{apt.clientName}</p>
                    <p className="text-sm text-slate-500">{apt.service} • {apt.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isToday(parseISO(apt.date)) && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg">Hoje</span>
                    )}
                    {isTomorrow(parseISO(apt.date)) && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-lg">Amanhã</span>
                    )}
                    <span className={`px-2 py-1 text-xs font-medium rounded-lg ${
                      apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                      apt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {apt.status === 'confirmed' ? 'Confirmado' : apt.status === 'pending' ? 'Pendente' : apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Integration Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Integrações</h2>
          <div className="space-y-4">
            {/* WhatsApp */}
            <div className="p-4 rounded-xl bg-green-50 border border-green-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">WhatsApp</p>
                  <p className="text-xs text-slate-500">Mensagens automáticas</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-700 font-medium">Conectado via wa.me</span>
              </div>
            </div>

            {/* Google Calendar */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Google Agenda</p>
                  <p className="text-xs text-slate-500">Sincronização de eventos</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-xs text-blue-700 font-medium">Conectado via URL</span>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-sm font-medium text-slate-700 mb-3">Resumo do Mês</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Concluídos</span>
                  <span className="font-medium text-slate-800">{completedAppointments.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">WhatsApp enviados</span>
                  <span className="font-medium text-slate-800">{appointments.filter(a => a.whatsappSent).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Sync Google</span>
                  <span className="font-medium text-slate-800">{appointments.filter(a => a.calendarSynced).length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
