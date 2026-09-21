import { useState, useEffect } from 'react';
import { CreditCard, Key, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

interface StripeConfig {
  publicKey: string;
  secretKey: string;
  webhookSecret: string;
  enabled: boolean;
}

const STORAGE_KEY = 'agendaflow_stripe_config';

export default function PaymentSettings() {
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const updateConfig = (updates: Partial<StripeConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const isConfigured = config.publicKey && config.secretKey;

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className={`rounded-2xl p-6 border-2 ${
        isConfigured 
          ? 'bg-emerald-50 border-emerald-200' 
          : 'bg-amber-50 border-amber-200'
      }`}>
        <div className="flex items-start gap-3">
          {isConfigured ? (
            <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
          )}
          <div>
            <h3 className={`font-semibold ${isConfigured ? 'text-emerald-800' : 'text-amber-800'}`}>
              {isConfigured ? 'Stripe Configurado' : 'Configuração Pendente'}
            </h3>
            <p className={`text-sm mt-1 ${isConfigured ? 'text-emerald-700' : 'text-amber-700'}`}>
              {isConfigured 
                ? 'Seu sistema de pagamentos está pronto para receber assinaturas.'
                : 'Configure suas chaves API do Stripe para começar a receber pagamentos.'}
            </p>
          </div>
        </div>
      </div>

      {/* Enable Toggle */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
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
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-5 h-5 text-emerald-500" />
          <h3 className="font-semibold text-slate-800">Chaves API do Stripe</h3>
        </div>

        <div className="space-y-4">
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

        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-800 font-medium mb-2">🔐 Segurança</p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Suas chaves são armazenadas localmente no navegador</li>
            <li>• Em produção, use variáveis de ambiente no servidor</li>
            <li>• Nunca compartilhe sua chave secreta</li>
            <li>• Use chaves de teste (pk_test_/sk_test_) durante desenvolvimento</li>
          </ul>
        </div>
      </div>

      {/* Setup Guide */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">📖 Como configurar</h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
            <div>
              <p className="font-medium text-slate-800 text-sm">Crie uma conta no Stripe</p>
              <a 
                href="https://dashboard.stripe.com/register" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 mt-1"
              >
                dashboard.stripe.com/register
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
            <div>
              <p className="font-medium text-slate-800 text-sm">Acesse as chaves API</p>
              <p className="text-xs text-slate-500 mt-1">
                Vá em Developers → API keys no painel do Stripe
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
            <div>
              <p className="font-medium text-slate-800 text-sm">Copie e cole as chaves acima</p>
              <p className="text-xs text-slate-500 mt-1">
                Use as chaves de teste primeiro para validar tudo
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
            <div>
              <p className="font-medium text-slate-800 text-sm">Teste com cartão de teste</p>
              <p className="text-xs text-slate-500 mt-1">
                Use o número 4242 4242 4242 4242 para testar pagamentos
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">5</div>
            <div>
              <p className="font-medium text-slate-800 text-sm">Mude para chaves live quando estiver pronto</p>
              <p className="text-xs text-slate-500 mt-1">
                Comece a receber pagamentos reais!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Info */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-6">
        <h3 className="font-semibold text-emerald-800 mb-3">💰 Taxas do Stripe no Brasil</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-white/60 rounded-xl p-3">
            <p className="font-medium text-slate-800">Cartão de Crédito (1x)</p>
            <p className="text-slate-600">3,9% + R$ 0,39</p>
          </div>
          <div className="bg-white/60 rounded-xl p-3">
            <p className="font-medium text-slate-800">PIX</p>
            <p className="text-slate-600">0,6% (muito mais barato!)</p>
          </div>
          <div className="bg-white/60 rounded-xl p-3">
            <p className="font-medium text-slate-800">Sem mensalidade</p>
            <p className="text-slate-600">Pague apenas quando vender</p>
          </div>
          <div className="bg-white/60 rounded-xl p-3">
            <p className="font-medium text-slate-800">Recebimento</p>
            <p className="text-slate-600">Em 2 dias úteis (D+2)</p>
          </div>
        </div>
      </div>

      {/* Alternative: Asaas */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-semibold text-slate-800 mb-2">🔄 Alternativa: Asaas</h3>
        <p className="text-sm text-slate-600 mb-4">
          Se preferir uma solução 100% brasileira com boleto bancário, considere o Asaas.
        </p>
        <a 
          href="https://www.asaas.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors text-sm font-medium"
        >
          Conhecer Asaas
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
