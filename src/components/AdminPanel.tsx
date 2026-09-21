import { useState } from 'react';
import { X, Lock, CreditCard, Link, ExternalLink, CheckCircle, AlertCircle, Shield } from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
}

interface StripeConfig {
  enabled: boolean;
  paymentLinks: {
    free: string;
    pro: string;
    business: string;
  };
}

const ADMIN_PASSWORD = 'admin123';
const STORAGE_KEY = 'agendaflow_stripe_config';

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [config, setConfig] = useState<StripeConfig>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {
      enabled: false,
      paymentLinks: {
        free: '',
        pro: '',
        business: '',
      },
    };
  });
  const [saved, setSaved] = useState(false);

  // Debug: confirmar que o modal abriu
  console.log('AdminPanel renderizado - isAuthenticated:', isAuthenticated);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Senha incorreta');
    }
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateConfig = (updates: Partial<StripeConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const updatePaymentLink = (plan: keyof StripeConfig['paymentLinks'], value: string) => {
    setConfig(prev => ({
      ...prev,
      paymentLinks: { ...prev.paymentLinks, [plan]: value }
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-slate-700" />
              <h2 className="text-xl font-bold text-slate-800">Área Administrativa</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Senha de Administrador</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Digite a senha"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
              />
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all"
            >
              Entrar
            </button>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-xs text-blue-800">
                <strong>Senha padrão:</strong> admin123<br />
                <strong>Importante:</strong> Altere esta senha no código fonte antes de publicar em produção.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isConfigured = config.paymentLinks.pro && config.paymentLinks.business;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-600" />
            <div>
              <h2 className="text-xl font-bold text-slate-800">Painel Administrativo</h2>
              <p className="text-sm text-slate-500">Configuração de pagamentos</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div className={`rounded-xl p-4 border-2 ${
            isConfigured 
              ? 'bg-emerald-50 border-emerald-200' 
              : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-start gap-3">
              {isConfigured ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <h3 className={`font-semibold ${isConfigured ? 'text-emerald-800' : 'text-amber-800'}`}>
                  {isConfigured ? 'Pagamentos Configurados' : 'Configuração Pendente'}
                </h3>
                <p className={`text-sm mt-1 ${isConfigured ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {isConfigured 
                    ? 'Seus links de pagamento estão prontos para uso.'
                    : 'Configure os Links de Pagamento do Stripe para começar a receber pagamentos.'}
                </p>
              </div>
            </div>
          </div>

          {/* Enable Toggle */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800">Ativar Pagamentos</h3>
                <p className="text-sm text-slate-500 mt-1">Permitir que clientes assinem planos</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enabled}
                  onChange={(e) => updateConfig({ enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          {/* Payment Links */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Link className="w-5 h-5 text-emerald-500" />
              <h3 className="font-semibold text-slate-800">Links de Pagamento do Stripe</h3>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-800 font-medium mb-3">💡 Como criar Links de Pagamento no Stripe</p>
              <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
                <li>
                  Acesse o <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">Painel do Stripe</a>
                </li>
                <li>
                  No menu lateral esquerdo, clique em <strong>Links de pagamento</strong>
                </li>
                <li>
                  Clique no botão <strong>+ Novo</strong> (canto superior direito)
                </li>
                <li>
                  Na seção <strong>Produtos</strong>, clique em <strong>+ Adicionar produto</strong>
                </li>
                <li>
                  Preencha os campos:
                  <ul className="ml-4 mt-1 space-y-1 list-disc">
                    <li><strong>Nome do produto:</strong> Ex: "AgendaFlow - Plano Profissional"</li>
                    <li><strong>Descrição:</strong> Ex: "Acesso completo ao sistema de agendamento"</li>
                    <li><strong>Preço:</strong> Ex: "R$ 49,90"</li>
                    <li><strong>Cobrança:</strong> Selecione <strong>Recorrente</strong></li>
                    <li><strong>Intervalo de cobrança:</strong> Selecione <strong>Mensal</strong></li>
                  </ul>
                </li>
                <li>
                  Clique em <strong>Próximo</strong>
                </li>
                <li>
                  Na tela de personalização, clique em <strong>Próximo</strong> (pode manter o padrão)
                </li>
                <li>
                  Clique em <strong>Criar link</strong>
                </li>
                <li>
                  <strong>Copie o link gerado</strong> (começa com https://buy.stripe.com/...) e cole no campo correspondente abaixo
                </li>
              </ol>
              <p className="text-xs text-blue-600 mt-3 font-medium">
                💡 Repita o processo para cada plano (Profissional e Empresarial)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Link do Plano Gratuito
              </label>
              <input
                type="url"
                value={config.paymentLinks.free}
                onChange={(e) => updatePaymentLink('free', e.target.value)}
                placeholder="https://buy.stripe.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none text-sm"
              />
              <p className="text-xs text-slate-500 mt-1">
                Opcional - pode deixar vazio se não quiser oferecer plano gratuito
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Link do Plano Profissional (R$ 49,90/mês)
              </label>
              <input
                type="url"
                value={config.paymentLinks.pro}
                onChange={(e) => updatePaymentLink('pro', e.target.value)}
                placeholder="https://buy.stripe.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Link do Plano Empresarial (R$ 149,90/mês)
              </label>
              <input
                type="url"
                value={config.paymentLinks.business}
                onChange={(e) => updatePaymentLink('business', e.target.value)}
                placeholder="https://buy.stripe.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none text-sm"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Salvo com sucesso!
              </>
            ) : (
              'Salvar Configurações'
            )}
          </button>

          {/* How it works */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="font-semibold text-slate-800 mb-3">🎯 Como funciona</h3>
            <div className="space-y-2 text-sm text-slate-700">
              <p>1. Cliente clica em "Assinar Agora" no plano desejado</p>
              <p>2. Sistema abre o Link de Pagamento do Stripe em nova aba</p>
              <p>3. Cliente completa o pagamento no Stripe</p>
              <p>4. Stripe processa e você recebe o pagamento</p>
              <p>5. <strong>Importante:</strong> Você precisa ativar manualmente o acesso do cliente no sistema após confirmar o pagamento</p>
            </div>
          </div>

          {/* Advantages */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-sm text-emerald-800 font-medium mb-2">✅ Vantagens desta abordagem</p>
            <ul className="text-sm text-emerald-700 space-y-1">
              <li>• Não precisa de backend complexo</li>
              <li>• Pagamentos seguros processados pelo Stripe</li>
              <li>• Suporte a cartão, PIX e boleto automaticamente</li>
              <li>• Você controla tudo pelo painel do Stripe</li>
              <li>• Funciona imediatamente após configurar</li>
            </ul>
          </div>

          {/* Security Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs text-amber-800 font-medium mb-2">⚠️ Observações importantes</p>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• Após criar os links, você pode encontrá-los em <strong>Links de pagamento</strong> no painel do Stripe</li>
              <li>• Para automação completa (ativação automática de clientes), será necessário implementar webhooks</li>
              <li>• Isso requer um backend (Node.js, Python, etc.) e conhecimento técnico avançado</li>
              <li>• Por enquanto, ative manualmente os clientes após confirmar o pagamento no painel do Stripe</li>
              <li>• Para testar, use o modo de teste do Stripe e o cartão: 4242 4242 4242 4242</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
