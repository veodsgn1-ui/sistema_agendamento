import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, ArrowLeft, ArrowRight, User, Phone, FileText, Instagram, Facebook, Globe, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { PublicPageConfig, AnamnesisField } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface PublicBookingPageProps {
  config: PublicPageConfig;
  onBooking: (data: any) => void;
  onBack?: () => void;
}

const defaultAnamnesisFields: AnamnesisField[] = [
  { id: '1', label: 'Já fez terapia antes?', type: 'radio', required: true, options: ['Sim', 'Não'] },
  { id: '2', label: 'Motivo principal da consulta', type: 'textarea', required: true, placeholder: 'Descreva brevemente o que te trouxe até aqui...' },
  { id: '3', label: 'Possui alguma condição médica?', type: 'text', required: false, placeholder: 'Se sim, qual?' },
  { id: '4', label: 'Está fazendo uso de algum medicamento?', type: 'text', required: false, placeholder: 'Liste os medicamentos' },
  { id: '5', label: 'Como está se sentindo ultimamente?', type: 'textarea', required: false, placeholder: 'Descreva como você tem se sentido...' },
];

function generateTimeSlots(config: PublicPageConfig, date: string): string[] {
  const dayOfWeek = new Date(date).getDay();
  const days: (keyof PublicPageConfig['businessHours'])[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const daySlots = config.businessHours[days[dayOfWeek]];
  
  if (!daySlots || daySlots.length === 0) return [];
  
  const slots: string[] = [];
  daySlots.forEach((slot: { start: string; end: string }) => {
    const [startH, startM] = slot.start.split(':').map(Number);
    const [endH, endM] = slot.end.split(':').map(Number);
    let current = startH * 60 + startM;
    const end = endH * 60 + endM;
    
    while (current < end) {
      const h = Math.floor(current / 60);
      const m = current % 60;
      slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      current += 30;
    }
  });
  
  return slots;
}

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export default function PublicBookingPage({ config, onBooking, onBack }: PublicBookingPageProps) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [anamnesisData, setAnamnesisData] = useState<Record<string, string>>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showSuccess, setShowSuccess] = useState(false);

  const primaryColor = config?.primaryColor || '#10b981';
  const secondaryColor = config?.secondaryColor || '#0d9488';

  const availableServices = config?.services?.filter(s => s.enabled) || [];
  const timeSlots = selectedDate ? generateTimeSlots(config, selectedDate) : [];

  const handleSubmit = () => {
    const booking = {
      id: uuidv4(),
      clientName,
      clientPhone,
      service: availableServices.find(s => s.id === selectedService)?.name || '',
      date: selectedDate,
      time: selectedTime,
      duration: availableServices.find(s => s.id === selectedService)?.duration || 30,
      notes: '',
      status: 'confirmed' as const,
      whatsappSent: false,
      calendarSynced: false,
      createdAt: new Date().toISOString(),
      anamnesisData: config.anamnesisEnabled ? anamnesisData : undefined,
    };
    onBooking(booking);
    setShowSuccess(true);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!selectedService;
      case 2: return !!selectedDate && !!selectedTime;
      case 3: return !!clientName && !!clientPhone;
      case 4: {
        if (!config.anamnesisEnabled) return true;
        return config.anamnesisFields
          .filter(f => f.required)
          .every(f => anamnesisData[f.id]);
      }
      default: return false;
    }
  };

  const nextStep = () => {
    if (step === 4) {
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10)` }}>
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: `${primaryColor}20` }}>
            <CheckCircle className="w-10 h-10" style={{ color: primaryColor }} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Agendamento Confirmado!</h2>
          <p className="text-slate-500 mb-6">
            Olá <strong>{clientName}</strong>, seu agendamento foi realizado com sucesso.
          </p>
          <div className="bg-slate-50 rounded-xl p-4 text-left space-y-2 mb-6">
            <p className="text-sm"><strong>Serviço:</strong> {availableServices.find(s => s.id === selectedService)?.name}</p>
            <p className="text-sm"><strong>Data:</strong> {new Date(selectedDate).toLocaleDateString('pt-BR')}</p>
            <p className="text-sm"><strong>Horário:</strong> {selectedTime}</p>
          </div>
          <p className="text-sm text-slate-500">Você receberá uma confirmação via WhatsApp em breve.</p>
        </div>
      </div>
    );
  }

  if (!config || !config.enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Página não disponível</h2>
          <p className="text-slate-500">Esta página de agendamento não está ativa no momento.</p>
        </div>
      </div>
    );
  }

  const totalSteps = config.anamnesisEnabled ? 4 : 3;

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${primaryColor}05, ${secondaryColor}10)` }}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          {onBack && (
            <button onClick={onBack} className="flex items-center gap-1 text-slate-600 hover:text-slate-800 text-sm">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
          )}
          <div className="flex items-center gap-3 mx-auto">
            {config.logo && (
              <img src={config.logo} alt="Logo" className="w-8 h-8 object-contain" />
            )}
            <span className="font-bold text-slate-800">{config.companyName || 'AgendaFlow'}</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        {step === 1 && (
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-3">{config.welcomeTitle}</h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">{config.welcomeSubtitle}</p>
          </div>
        )}

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Passo {step} de {totalSteps}</span>
            <span className="text-sm font-medium" style={{ color: primaryColor }}>
              {step === 1 && 'Escolha o serviço'}
              {step === 2 && 'Selecione data e horário'}
              {step === 3 && 'Seus dados'}
              {step === 4 && 'Ficha de anamnese'}
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${(step / totalSteps) * 100}%`,
                background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`
              }}
            />
          </div>
        </div>

        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Escolha um serviço</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {availableServices.map(service => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all ${
                    selectedService === service.id
                      ? 'shadow-lg scale-[1.02]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                  style={selectedService === service.id ? {
                    borderColor: primaryColor,
                    background: `${primaryColor}05`
                  } : {}}
                >
                  <h3 className="font-semibold text-slate-800 mb-1">{service.name}</h3>
                  <p className="text-sm text-slate-500 mb-3">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {service.duration} min
                    </span>
                    <span className="font-bold" style={{ color: primaryColor }}>
                      {service.price === 0 ? 'Grátis' : `R$ ${service.price.toFixed(2).replace('.', ',')}`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            {availableServices.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl">
                <p className="text-slate-400">Nenhum serviço disponível no momento.</p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="font-semibold text-slate-800">
                  {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </h3>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                  <div key={i} className="text-center text-xs font-medium text-slate-400 py-2">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth()).map((date, i) => {
                  const dateStr = date.toISOString().split('T')[0];
                  const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                  const isSelected = selectedDate === dateStr;
                  const hasSlots = generateTimeSlots(config, dateStr).length > 0;
                  
                  return (
                    <button
                      key={i}
                      disabled={isPast || !hasSlots}
                      onClick={() => { setSelectedDate(dateStr); setSelectedTime(''); }}
                      className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                        isPast || !hasSlots
                          ? 'text-slate-300 cursor-not-allowed'
                          : isSelected
                          ? 'text-white shadow-md'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                      style={isSelected ? { background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` } : {}}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Horários disponíveis</h3>
              {selectedDate ? (
                timeSlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                          selectedTime === time
                            ? 'text-white shadow-md'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                        style={selectedTime === time ? { background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` } : {}}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-8">Nenhum horário disponível nesta data.</p>
                )
              ) : (
                <p className="text-slate-400 text-center py-8">Selecione uma data no calendário.</p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Client Data */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Seus dados</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome completo *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                    placeholder="Seu nome"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">WhatsApp *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">Enviaremos a confirmação por WhatsApp</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Anamnesis */}
        {step === 4 && config.anamnesisEnabled && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <FileText style={{ color: primaryColor }} />
              <h2 className="text-xl font-bold text-slate-800">{config.anamnesisTitle || 'Ficha de Anamnese'}</h2>
            </div>
            <p className="text-sm text-slate-500 mb-6">
              Estas informações são confidenciais e ajudam no seu atendimento.
            </p>
            <div className="space-y-5">
              {config.anamnesisFields.map(field => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={anamnesisData[field.id] || ''}
                      onChange={(e) => setAnamnesisData({ ...anamnesisData, [field.id]: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                  {field.type === 'textarea' && (
                    <textarea
                      value={anamnesisData[field.id] || ''}
                      onChange={(e) => setAnamnesisData({ ...anamnesisData, [field.id]: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none resize-none"
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                  {field.type === 'radio' && field.options && (
                    <div className="flex gap-4">
                      {field.options.map(option => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={field.id}
                            value={option}
                            checked={anamnesisData[field.id] === option}
                            onChange={(e) => setAnamnesisData({ ...anamnesisData, [field.id]: e.target.value })}
                            className="w-4 h-4"
                            style={{ accentColor: primaryColor }}
                          />
                          <span className="text-sm text-slate-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {field.type === 'select' && field.options && (
                    <select
                      value={anamnesisData[field.id] || ''}
                      onChange={(e) => setAnamnesisData({ ...anamnesisData, [field.id]: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                      required={field.required}
                    >
                      <option value="">Selecione...</option>
                      {field.options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                  {field.type === 'date' && (
                    <input
                      type="date"
                      value={anamnesisData[field.id] || ''}
                      onChange={(e) => setAnamnesisData({ ...anamnesisData, [field.id]: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </button>
          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-6 py-2.5 text-white rounded-xl font-medium shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              boxShadow: `0 10px 15px -3px ${primaryColor}40`
            }}
          >
            {step === totalSteps ? 'Confirmar Agendamento' : 'Próximo'}
            {step < totalSteps && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Footer Info */}
        {step === 1 && (
          <div className="mt-12 grid sm:grid-cols-3 gap-4">
            {config.address && (
              <div className="bg-white/60 rounded-xl p-4 text-center">
                <MapPin className="w-5 h-5 mx-auto mb-2" style={{ color: primaryColor }} />
                <p className="text-sm text-slate-600">{config.address}</p>
              </div>
            )}
            {config.phone && (
              <div className="bg-white/60 rounded-xl p-4 text-center">
                <Phone className="w-5 h-5 mx-auto mb-2" style={{ color: primaryColor }} />
                <p className="text-sm text-slate-600">{config.phone}</p>
              </div>
            )}
            {config.aboutText && (
              <div className="bg-white/60 rounded-xl p-4 text-center sm:col-span-3">
                <p className="text-sm text-slate-600">{config.aboutText}</p>
              </div>
            )}
          </div>
        )}

        {/* Social Links */}
        <div className="mt-8 flex justify-center gap-4">
          {config.socialLinks?.instagram && (
            <a href={config.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/60 transition-colors">
              <Instagram className="w-5 h-5 text-slate-500" />
            </a>
          )}
          {config.socialLinks?.facebook && (
            <a href={config.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/60 transition-colors">
              <Facebook className="w-5 h-5 text-slate-500" />
            </a>
          )}
          {config.socialLinks?.website && (
            <a href={config.socialLinks.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/60 transition-colors">
              <Globe className="w-5 h-5 text-slate-500" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
