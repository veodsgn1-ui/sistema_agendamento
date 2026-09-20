import { MessageCircle, Calendar, Bell, Info, Smartphone } from 'lucide-react';

export default function Settings() {
  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Configurações</h1>
        <p className="text-slate-500 mt-1">Configure as integrações e preferências do sistema</p>
      </div>

      <div className="space-y-6">
        {/* WhatsApp Integration */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-slideUp" style={{ animationDelay: '0ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Integração WhatsApp</h3>
              <p className="text-sm text-slate-500">Configure o envio de mensagens automáticas</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-700">Funcionando via wa.me</span>
              </div>
              <p className="text-xs text-slate-600">
                O sistema abre o WhatsApp Web ou aplicativo com a mensagem pré-formatada para o cliente.
                Basta clicar em "Enviar" no WhatsApp para completar o envio.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Número da Empresa (WhatsApp Business)</label>
              <input
                type="tel"
                placeholder="Ex: 5511999999999"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mensagem de Saudação Padrão</label>
              <textarea
                rows={3}
                placeholder="Olá! Obrigado por entrar em contato..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Google Calendar Integration */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-slideUp" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Integração Google Agenda</h3>
              <p className="text-sm text-slate-500">Sincronize eventos automaticamente</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-blue-700">Funcionando via URL</span>
              </div>
              <p className="text-xs text-slate-600">
                O sistema gera um link do Google Calendar com todos os dados do agendamento.
                Ao clicar, o evento é criado diretamente na sua agenda.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail do Google</label>
              <input
                type="email"
                placeholder="seuemail@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Calendário Padrão</label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none">
                <option>Principal</option>
                <option>Trabalho</option>
                <option>Pessoal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-slideUp" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Notificações</h3>
              <p className="text-sm text-slate-500">Configure os lembretes automáticos</p>
            </div>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-700">Lembrete 24h antes via WhatsApp</span>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
            </label>
            <label className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-700">Lembrete 1h antes via WhatsApp</span>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
            </label>
            <label className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-700">Notificação de novo agendamento</span>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
            </label>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-6 animate-slideUp" style={{ animationDelay: '300ms' }}>
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-emerald-800 mb-1">Como funciona a integração?</h4>
              <ul className="text-sm text-emerald-700 space-y-1.5">
                <li>• <strong>WhatsApp:</strong> Ao criar um agendamento, o sistema abre o WhatsApp com a mensagem de confirmação pré-formatada. Basta enviar!</li>
                <li>• <strong>Google Agenda:</strong> O sistema gera um link que abre o Google Calendar com todos os dados preenchidos. Confirme para criar o evento.</li>
                <li>• <strong>Para automação completa:</strong> Integre com a API do WhatsApp Business e Google Calendar API usando um backend.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="animate-slideUp" style={{ animationDelay: '400ms' }}>
          <button className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 hover:-translate-y-0.5">
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
}
