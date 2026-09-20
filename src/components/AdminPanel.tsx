import { useState } from 'react';
import { X, Lock, CreditCard, Key, ExternalLink, CheckCircle, AlertCircle, Shield } from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
}

interface StripeConfig {
  publicKey: string;
  secretKey: string;
  webhookSecret: string;
  enabled: boolean;
}

const ADMIN_PASSWORD = 'admin123'; // Em produção, use variável de ambiente
const STORAGE_KEY = 'agendaflow_stripe_config';

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [config, setConfig] = useState<StripeConfig>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {
      publicKey: '',
      secretKey: '',
      webhookSecret: '',
      enabled: false,
    };
  });
  const [showSecret, setShowSecret] = useState(false);
  const [saved, setSaved] = useState(false);

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

  const isConfigured = config.publicKey && config.secretKey;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-600" />
            <div>
              <h2 className="text-xl font-bold text-slate-800">Painel Administrativo</h2>
              <p className="text-sm text-slate-500">Configuração do sistema de pagamentos</p>
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
                  {isConfigured ? 'Stripe Configurado' : 'Configuração Pendente'}
                </h3>
                <p className={`text-sm mt-1 ${isConfigured ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {isConfigured 
                    ? 'Seu sistema está pronto para receber pagamentos.'
                    : 'Configure suas chaves API para começar a receber pagamentos.'}
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

          {/* API Keys */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-500" />
              <h3 className="font-semibold text-slate-800">Chaves API do Stripe</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Chave Pública (Publishable Key)
              </label>
              <input
                type="text"
                value={config.publicKey}
                onChange={(e) => updateConfig({ publicKey: e.target.value })}
                placeholder="pk_test_..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none font-mono text-sm"
              />
              <p className="text-xs text-slate-500 mt-1">
                Começa com "pk_test_" ou "pk_live_"
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Chave Secreta (Secret Key)
              </label>
              <div className="relative">
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={config.secretKey}
                  onChange={(e) => updateConfig({ secretKey: e.target.value })}
                  placeholder="sk_test_..."
                  className="w-full px-4 py-2.5 pr-20 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  {showSecret ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Começa com "sk_test_" ou "sk_live_" - Mantenha em segredo!
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Webhook Secret (opcional)
              </label>
              <input
                type="password"
                value={config.webhookSecret}
                onChange={(e) => updateConfig({ webhookSecret: e.target.value })}
                placeholder="whsec_..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none font-mono text-sm"
              />
              <p className="text-xs text-slate-500 mt-1">
                Para validar webhooks do Stripe (recomendado para produção)
              </p>
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

          {/* Setup Guide */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="font-semibold text-slate-800 mb-3">📖 Como configurar</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                <div className="text-sm text-slate-700">
                  Crie uma conta em{' '}
                  <a href="https://dashboard.stripe.com/register" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700">
                    dashboard.stripe.com/register
                  </a>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                <div className="text-sm text-slate-700">
                  Vá em Developers → API keys
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                <div className="text-sm text-slate-700">
                  Copie e cole as chaves acima
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
                <div className="text-sm text-slate-700">
                  Teste com: 4242 4242 4242 4242
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs text-amber-800 font-medium mb-2">⚠️ Segurança</p>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• Estas chaves são armazenadas localmente no navegador</li>
              <li>• Em produção, mova para variáveis de ambiente no servidor</li>
              <li>• Nunca compartilhe sua chave secreta</li>
              <li>• Use chaves de teste (pk_test_/sk_test_) durante desenvolvimento</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
