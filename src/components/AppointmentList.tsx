import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MessageCircle, Calendar, MoreVertical, CheckCircle, XCircle, Clock, Trash2, Eye } from 'lucide-react';
import { Appointment } from '../types';
import { format, parseISO, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { sendWhatsAppMessage } from '../utils/whatsapp';
import { addToGoogleCalendar } from '../utils/calendar';

interface AppointmentListProps {
  appointments: Appointment[];
  onUpdate: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
}

export default function AppointmentList({ appointments, onUpdate, onDelete }: AppointmentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const filteredAppointments = appointments
    .filter(apt => {
      const matchesSearch = apt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.clientPhone.includes(searchTerm);
      const matchesFilter = filterStatus === 'all' || apt.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());

  const handleStatusChange = (appointment: Appointment, newStatus: Appointment['status']) => {
    onUpdate({ ...appointment, status: newStatus });
  };

  const handleSendWhatsApp = (appointment: Appointment) => {
    sendWhatsAppMessage(appointment, 'confirmation');
    onUpdate({ ...appointment, whatsappSent: true });
  };

  const handleSyncCalendar = (appointment: Appointment) => {
    addToGoogleCalendar(appointment);
    onUpdate({ ...appointment, calendarSynced: true });
  };

  const getStatusBadge = (status: Appointment['status']) => {
    const styles = {
      confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
      completed: 'bg-blue-100 text-blue-700 border-blue-200',
    };
    const labels = {
      confirmed: 'Confirmado',
      pending: 'Pendente',
      cancelled: 'Cancelado',
      completed: 'Concluído',
    };
    return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Agendamentos</h1>
        <p className="text-slate-500 mt-1">Gerencie todos os seus agendamentos</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, serviço ou telefone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none appearance-none bg-white"
          >
            <option value="all">Todos</option>
            <option value="confirmed">Confirmados</option>
            <option value="pending">Pendentes</option>
            <option value="completed">Concluídos</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500 mb-4">
        {filteredAppointments.length} agendamento{filteredAppointments.length !== 1 ? 's' : ''} encontrado{filteredAppointments.length !== 1 ? 's' : ''}
      </p>

      {/* List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredAppointments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-2xl border border-slate-100"
            >
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">Nenhum agendamento encontrado</p>
              <p className="text-slate-400 text-sm mt-1">Tente ajustar os filtros de busca</p>
            </motion.div>
          ) : (
            filteredAppointments.map((apt, index) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.03 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-4 sm:p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Date badge */}
                  <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:w-16">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex flex-col items-center justify-center text-white shadow-sm">
                      <span className="text-xs font-medium leading-none">{format(parseISO(apt.date), 'MMM', { locale: ptBR }).slice(0, 3)}</span>
                      <span className="text-lg font-bold leading-none">{format(parseISO(apt.date), 'dd')}</span>
                    </div>
                    <span className="text-sm text-slate-500 font-medium">{apt.time}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-800 truncate">{apt.clientName}</h3>
                      {getStatusBadge(apt.status)}
                    </div>
                    <p className="text-sm text-slate-500">{apt.service} • {apt.duration} min</p>
                    <div className="flex items-center gap-3 mt-2">
                      {apt.whatsappSent && (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <MessageCircle className="w-3 h-3" /> WhatsApp enviado
                        </span>
                      )}
                      {apt.calendarSynced && (
                        <span className="flex items-center gap-1 text-xs text-blue-600">
                          <Calendar className="w-3 h-3" /> Google Agenda
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => { setSelectedAppointment(apt); setShowDetail(true); }}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                      title="Ver detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleSendWhatsApp(apt)}
                      className="p-2 rounded-lg hover:bg-green-50 text-slate-500 hover:text-green-600 transition-colors"
                      title="Enviar WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleSyncCalendar(apt)}
                      className="p-2 rounded-lg hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors"
                      title="Sincronizar Google Agenda"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                    {apt.status !== 'completed' && (
                      <button
                        onClick={() => handleStatusChange(apt, 'completed')}
                        className="p-2 rounded-lg hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 transition-colors"
                        title="Marcar como concluído"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {apt.status !== 'cancelled' && (
                      <button
                        onClick={() => handleStatusChange(apt, 'cancelled')}
                        className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                        title="Cancelar agendamento"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(apt.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetail && selectedAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetail(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Detalhes do Agendamento</h2>
                <button onClick={() => setShowDetail(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <XCircle className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Cliente</p>
                    <p className="font-medium text-slate-800">{selectedAppointment.clientName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Telefone</p>
                    <p className="font-medium text-slate-800">{selectedAppointment.clientPhone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Serviço</p>
                    <p className="font-medium text-slate-800">{selectedAppointment.service}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Duração</p>
                    <p className="font-medium text-slate-800">{selectedAppointment.duration} min</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Data</p>
                    <p className="font-medium text-slate-800">
                      {format(parseISO(selectedAppointment.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Horário</p>
                    <p className="font-medium text-slate-800">{selectedAppointment.time}</p>
                  </div>
                </div>
                {selectedAppointment.notes && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Observações</p>
                    <p className="text-slate-700 text-sm mt-1">{selectedAppointment.notes}</p>
                  </div>
                )}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-500">Status:</span>
                  {getStatusBadge(selectedAppointment.status)}
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => { handleSendWhatsApp(selectedAppointment); setShowDetail(false); }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors text-sm font-medium"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => { handleSyncCalendar(selectedAppointment); setShowDetail(false); }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <Calendar className="w-4 h-4" />
                    Google Agenda
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
