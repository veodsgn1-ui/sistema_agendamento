import { useState, useEffect } from 'react';
import { Globe, Plus, Trash2, Eye, Save, Link, FileText, Clock, Palette } from 'lucide-react';
import { PublicPageConfig, AnamnesisField, PublicService } from '../types';
import { v4 as uuidv4 } from 'uuid';
import PublicBookingPage from './PublicBookingPage';

const STORAGE_KEY = 'agendaflow_public_page';

const defaultConfig: PublicPageConfig = {
  enabled: true,
  slug: 'meu-consultorio',
  companyName: 'Meu Consultório',
  primaryColor: '#10b981',
  secondaryColor: '#0d9488',
  welcomeTitle: 'Agende sua consulta',
  welcomeSubtitle: 'Escolha o melhor horário para você. Atendimento personalizado e humanizado.',
  aboutText: '',
  address: '',
  phone: '',
  services: [
    { id: '1', name: 'Consulta Individual', duration: 50, price: 150, description: 'Sessão individual de terapia', enabled: true },
    { id: '2', name: 'Terapia de Casal', duration: 80, price: 250, description: 'Sessão para casais', enabled: true },
  ],
  anamnesisEnabled: true,
  anamnesisTitle: 'Ficha de Anamnese',
  anamnesisFields: [
    { id: '1', label: 'Já fez terapia antes?', type: 'radio', required: true, options: ['Sim', 'Não'] },
    { id: '2', label: 'Motivo principal da consulta', type: 'textarea', required: true, placeholder: 'Descreva brevemente...' },
    { id: '3', label: 'Possui alguma condição médica?', type: 'text', required: false, placeholder: 'Se sim, qual?' },
  ],
  businessHours: {
    monday: [{ start: '08:00', end: '18:00' }],
    tuesday: [{ start: '08:00', end: '18:00' }],
    wednesday: [{ start: '08:00', end: '18:00' }],
    thursday: [{ start: '08:00', end: '18:00' }],
    friday: [{ start: '08:00', end: '18:00' }],
    saturday: [],
    sunday: [],
  },
  socialLinks: {},
};

export default function PublicPageSettings() {
  const [config, setConfig] = useState<PublicPageConfig>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultConfig;
  });
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'services' | 'hours' | 'anamnesis' | 'colors'>('general');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const updateConfig = (updates: Partial<PublicPageConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const addService = () => {
    const newService: PublicService = {
      id: uuidv4(),
      name: '',
      duration: 50,
      price: 0,
      description: '',
      enabled: true,
    };
    updateConfig({ services: [...config.services, newService] });
  };

  const updateService = (id: string, updates: Partial<PublicService>) => {
    updateConfig({
      services: config.services.map(s => s.id === id ? { ...s, ...updates } : s)
    });
  };

  const removeService = (id: string) => {
    updateConfig({ services: config.services.filter(s => s.id !== id) });
  };

  const addAnamnesisField = () => {
    const newField: AnamnesisField = {
      id: uuidv4(),
      label: '',
      type: 'text',
      required: false,
    };
    updateConfig({ anamnesisFields: [...config.anamnesisFields, newField] });
  };

  const updateAnamnesisField = (id: string, updates: Partial<AnamnesisField>) => {
    updateConfig({
      anamnesisFields: config.anamnesisFields.map(f => f.id === id ? { ...f, ...updates } : f)
    });
  };

  const removeAnamnesisField = (id: string) => {
    updateConfig({ anamnesisFields: config.anamnesisFields.filter(f => f.id !== id) });
  };

  if (showPreview) {
    return (
      <PublicBookingPage
        config={config}
        onBooking={(data) => {
          console.log('Booking:', data);
          alert('Agendamento realizado! (Em produção, isso seria salvo no backend)');
          setShowPreview(false);
        }}
        onBack={() => setShowPreview(false)}
      />
    );
  }

  const tabs = [
    { id: 'general', label: 'Geral', icon: Globe },
    { id: 'services', label: 'Serviços', icon: Clock },
    { id: 'hours', label: 'Horários', icon: Clock },
    { id: 'anamnesis', label: 'Anamnese', icon: FileText },
    { id: 'colors', label: 'Cores', icon: Palette },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Página de Agendamento Online</h1>
          <p className="text-slate-500 mt-1">Personalize a página que seus clientes acessam</p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <button
            onClick={() => setShowPreview(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            className="inline-flex items-center gap-2 px-5 py-2 text-white rounded-xl font-medium shadow-lg transition-all hover:-translate-y-0.5"
            style={{ background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})` }}
          >
            <Save className="w-4 h-4" />
            Salvar
          </button>
        </div>
      </div>

      {/* Link */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-4 mb-6">
        <div className="flex items-center gap-2">
          <Link className="w-4 h-4 text-emerald-600" />
          <span className="text-sm text-slate-600">Link da sua página:</span>
          <code className="px-3 py-1 bg-white rounded-lg text-sm font-mono text-emerald-700 border border-emerald-200">
            agendaflow.com/{config.slug}
          </code>
          <button
            onClick={() => navigator.clipboard.writeText(`https://agendaflow.com/${config.slug}`)}
            className="ml-2 px-3 py-1 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Copiar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              style={activeTab === tab.id ? { background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})` } : {}}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={config.enabled}
                  onChange={(e) => updateConfig({ enabled: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
                <span className="font-medium text-slate-700">Página ativa</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Slug da URL</label>
              <input
                type="text"
                value={config.slug}
                onChange={(e) => updateConfig({ slug: e.target.value.replace(/[^a-z0-9-]/g, '').toLowerCase() })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                placeholder="meu-consultorio"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome da Empresa</label>
              <input
                type="text"
                value={config.companyName}
                onChange={(e) => updateConfig({ companyName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => updateConfig({ logo: reader.result as string });
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
              {config.logo && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={config.logo} alt="Logo" className="w-12 h-12 object-contain" />
                  <button onClick={() => updateConfig({ logo: undefined })} className="text-sm text-red-600 hover:text-red-700">Remover</button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Título de Boas-vindas</label>
              <input
                type="text"
                value={config.welcomeTitle}
                onChange={(e) => updateConfig({ welcomeTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Subtítulo</label>
              <textarea
                value={config.welcomeSubtitle}
                onChange={(e) => updateConfig({ welcomeSubtitle: e.target.value })}
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Sobre (texto adicional)</label>
              <textarea
                value={config.aboutText}
                onChange={(e) => updateConfig({ aboutText: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none resize-none"
                placeholder="Conte um pouco sobre seu trabalho..."
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Endereço</label>
                <input
                  type="text"
                  value={config.address}
                  onChange={(e) => updateConfig({ address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                  placeholder="Rua, número, cidade"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Telefone</label>
                <input
                  type="tel"
                  value={config.phone}
                  onChange={(e) => updateConfig({ phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Instagram</label>
                <input
                  type="url"
                  value={config.socialLinks.instagram || ''}
                  onChange={(e) => updateConfig({ socialLinks: { ...config.socialLinks, instagram: e.target.value } })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Facebook</label>
                <input
                  type="url"
                  value={config.socialLinks.facebook || ''}
                  onChange={(e) => updateConfig({ socialLinks: { ...config.socialLinks, facebook: e.target.value } })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Website</label>
                <input
                  type="url"
                  value={config.socialLinks.website || ''}
                  onChange={(e) => updateConfig({ socialLinks: { ...config.socialLinks, website: e.target.value } })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Seus Serviços</h3>
              <button
                onClick={addService}
                className="flex items-center gap-2 px-4 py-2 text-white rounded-xl font-medium text-sm"
                style={{ background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})` }}
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>
            {config.services.map((service, index) => (
              <div key={service.id} className="border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">Serviço {index + 1}</span>
                  <button onClick={() => removeService(service.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => updateService(service.id, { name: e.target.value })}
                    placeholder="Nome do serviço"
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
                  />
                  <input
                    type="number"
                    value={service.price}
                    onChange={(e) => updateService(service.id, { price: Number(e.target.value) })}
                    placeholder="Preço (R$)"
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={service.duration}
                    onChange={(e) => updateService(service.id, { duration: Number(e.target.value) })}
                    placeholder="Duração (min)"
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
                  />
                  <input
                    type="text"
                    value={service.description}
                    onChange={(e) => updateService(service.id, { description: e.target.value })}
                    placeholder="Descrição"
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={service.enabled}
                    onChange={(e) => updateService(service.id, { enabled: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-slate-600">Disponível para agendamento</span>
                </label>
              </div>
            ))}
          </div>
        )}

        {/* Hours Tab */}
        {activeTab === 'hours' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Horário de Funcionamento</h3>
            {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map(day => {
              const dayNames = { monday: 'Segunda', tuesday: 'Terça', wednesday: 'Quarta', thursday: 'Quinta', friday: 'Sexta', saturday: 'Sábado', sunday: 'Domingo' };
              const slots = config.businessHours[day];
              
              return (
                <div key={day} className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-700">{dayNames[day]}</span>
                    <button
                      onClick={() => {
                        const updated = { ...config.businessHours };
                        updated[day] = slots.length > 0 ? [] : [{ start: '08:00', end: '18:00' }];
                        updateConfig({ businessHours: updated });
                      }}
                      className={`text-xs px-3 py-1 rounded-lg ${slots.length > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
                    >
                      {slots.length > 0 ? 'Ativo' : 'Fechado'}
                    </button>
                  </div>
                  {slots.length > 0 && (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={slots[0].start}
                        onChange={(e) => {
                          const updated = { ...config.businessHours };
                          updated[day] = [{ ...slots[0], start: e.target.value }];
                          updateConfig({ businessHours: updated });
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm"
                      />
                      <span className="text-slate-400">às</span>
                      <input
                        type="time"
                        value={slots[0].end}
                        onChange={(e) => {
                          const updated = { ...config.businessHours };
                          updated[day] = [{ ...slots[0], end: e.target.value }];
                          updateConfig({ businessHours: updated });
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Anamnesis Tab */}
        {activeTab === 'anamnesis' && (
          <div className="space-y-4">
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={config.anamnesisEnabled}
                onChange={(e) => updateConfig({ anamnesisEnabled: e.target.checked })}
                className="w-5 h-5 rounded"
              />
              <span className="font-medium text-slate-700">Ativar ficha de anamnese</span>
            </label>
            
            {config.anamnesisEnabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Título da Ficha</label>
                  <input
                    type="text"
                    value={config.anamnesisTitle}
                    onChange={(e) => updateConfig({ anamnesisTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-slate-800">Campos da Ficha</h3>
                  <button
                    onClick={addAnamnesisField}
                    className="flex items-center gap-2 px-4 py-2 text-white rounded-xl font-medium text-sm"
                    style={{ background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})` }}
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Campo
                  </button>
                </div>
                
                {config.anamnesisFields.map((field, index) => (
                  <div key={field.id} className="border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-500">Campo {index + 1}</span>
                      <button onClick={() => removeAnamnesisField(field.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateAnamnesisField(field.id, { label: e.target.value })}
                        placeholder="Pergunta"
                        className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
                      />
                      <select
                        value={field.type}
                        onChange={(e) => updateAnamnesisField(field.id, { type: e.target.value as any })}
                        className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
                      >
                        <option value="text">Texto curto</option>
                        <option value="textarea">Texto longo</option>
                        <option value="radio">Múltipla escolha</option>
                        <option value="select">Seleção</option>
                        <option value="date">Data</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      value={field.placeholder || ''}
                      onChange={(e) => updateAnamnesisField(field.id, { placeholder: e.target.value })}
                      placeholder="Placeholder (opcional)"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                    />
                    {(field.type === 'radio' || field.type === 'select') && (
                      <input
                        type="text"
                        value={field.options?.join(', ') || ''}
                        onChange={(e) => updateAnamnesisField(field.id, { options: e.target.value.split(',').map(s => s.trim()) })}
                        placeholder="Opções (separadas por vírgula)"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                      />
                    )}
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateAnamnesisField(field.id, { required: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-slate-600">Obrigatório</span>
                    </label>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-800">Cores da Página</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Cor Primária</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                    className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.primaryColor}
                    onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Cor Secundária</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) => updateConfig({ secondaryColor: e.target.value })}
                    className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.secondaryColor}
                    onChange={(e) => updateConfig({ secondaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm text-slate-500 mb-3">Pré-visualização:</p>
              <div className="p-6 rounded-xl" style={{ background: `linear-gradient(135deg, ${config.primaryColor}10, ${config.secondaryColor}10)` }}>
                <button
                  className="px-6 py-2.5 text-white rounded-xl font-medium"
                  style={{ background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})` }}
                >
                  Botão de Exemplo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
