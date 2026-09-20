import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Phone, FileText, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { Appointment } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { sendWhatsAppMessage } from '../utils/whatsapp';
import { addToGoogleCalendar } from '../utils/calendar';

interface ScheduleFormProps {
  onSave: (appointment: Appointment) => void;
}

const services = [
  { name: 'Consulta', duration: 30 },
  { name: 'Corte de Cabelo', duration: 45 },
  { name: 'Manicure', duration: 60 },
  { name: 'Massagem', duration: 90 },
  { name: 'Personal Trainer', duration: 60 },
  { name: 'Aula Particular', duration: 50 },
  { name: 'Outro', duration: 30 },
];

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '13:00', '13:30', '14:00',
  '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
  '17:30', '18:00', '18:30', '19:00',
];

export default function ScheduleForm({ onSave }: ScheduleFormProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    service: '',
    date: '',
    time: '',
    duration: 30,
    notes: '',
  });
  const [sendWhatsapp, setSendWhatsapp] = useState(true);
  const [syncCalendar, setSyncCalendar] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedAppointment, setSavedAppointment] = useState<Appointment | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedService = services.find(s => s.name === formData.service);
    const appointment: Appointment = {
      id: uuidv4(),
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      service: formData.service,
      date: formData.date,
      time: formData.time,
      duration: selectedService?.duration || formData.duration,
      notes: formData.notes,
      status: 'confirmed',
      whatsappSent: false,
      calendarSynced: false,
      createdAt: new Date().toISOString(),
    };

    onSave(appointment);
    setSavedAppointment(appointment);
    setShowSuccess(true);

    // Auto-send WhatsApp if enabled
    if (sendWhatsapp) {
      setTimeout(() => {
        sendWhatsAppMessage(appointment, 'confirmation');
        appointment.whatsappSent = true;
      }, 500);
    }

    // Auto-sync to Google Calendar if enabled
    if (syncCalendar) {
      setTimeout(() => {
        addToGoogleCalendar(appointment);
        appointment.calendarSynced = true;
      }, 1000);
    }
  };

  const resetForm = () => {
    setFormData({
      clientName: '',
      clientPhone: '',
      service: '',
      date: '',
      time: '',
      duration: 30,
      notes: '',
    });
    setShowSuccess(false);
    setSavedAppointment(null);
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Novo Agendamento</h1>
        <p className="text-slate-500 mt-1">Preencha os dados para criar um novo agendamento</p>
      </div>

      <AnimatePresence mode="wait">
        {showSuccess && savedAppointment ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Agendamento Criado!</h2>
            <p className="text-slate-500 mb-6">
              O agendamento de <strong>{savedAppointment.clientName}</strong> para{' '}
              <strong>{savedAppointment.service}</strong> foi criado com sucesso.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              {sendWhatsapp && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700">WhatsApp enviado</span>
                </div>
              )}
              {syncCalendar && (
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700">Google Agenda sincronizado</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={resetForm}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all"
              >
                Novo Agendamento
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Client Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-500" />
                Dados do Cliente
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome do Cliente</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      WhatsApp do Cliente
                    </span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                    placeholder="Ex: 5511999999999"
                  />
                  <p className="text-xs text-slate-400 mt-1">Formato: DDD + número (ex: 5511999999999)</p>
                </div>
              </div>
            </div>

            {/* Service & Schedule */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-500" />
                Serviço e Horário
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Serviço</label>
                  <select
                    required
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                  >
                    <option value="">Selecione um serviço</option>
                    {services.map(s => (
                      <option key={s.name} value={s.name}>{s.name} ({s.duration} min)</option>
                    ))}
                  </select>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Data</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Horário
                      </span>
                    </label>
                    <select
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                    >
                      <option value="">Selecione o horário</option>
                      {timeSlots.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                Observações
              </h3>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none resize-none"
                placeholder="Observações adicionais sobre o agendamento..."
              />
            </div>

            {/* Integration Options */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-500" />
                Integrações Automáticas
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100 cursor-pointer hover:bg-green-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={sendWhatsapp}
                    onChange={(e) => setSendWhatsapp(e.target.checked)}
                    className="w-5 h-5 rounded border-green-300 text-green-600 focus:ring-green-500"
                  />
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-slate-800 text-sm">Enviar confirmação via WhatsApp</p>
                    <p className="text-xs text-slate-500">Abre o WhatsApp com mensagem pré-formatada</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={syncCalendar}
                    onChange={(e) => setSyncCalendar(e.target.checked)}
                    className="w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-slate-800 text-sm">Sincronizar com Google Agenda</p>
                    <p className="text-xs text-slate-500">Cria evento automaticamente no Google Calendar</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 hover:-translate-y-0.5"
              >
                Criar Agendamento
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
