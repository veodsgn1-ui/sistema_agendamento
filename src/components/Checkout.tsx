import { useState } from 'react';
import { CreditCard, Check, Lock, Shield, ArrowLeft, Loader2 } from 'lucide-react';

interface CheckoutProps {
  planName: string;
  planPrice: number;
  planPeriod: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function Checkout({ planName, planPrice, planPeriod, onSuccess, onCancel }: CheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: '',
  });
  const [email, setEmail] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    
    // Simulação - Em produção, aqui você chamaria a API do Stripe
    // const response = await fetch('/api/create-payment', { ... });
    
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <button
          onClick={onCancel}
          className="flex items-center gap-1 text-slate-600 hover:text-slate-800 text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Plan Summary */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
            <h2 className="text-xl font-bold mb-1">{planName}</h2>
            <p className="text-emerald-100 text-sm mb-4">Plano {planPeriod}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">R$ {planPrice.toFixed(2).replace('.', ',')}</span>
              <span className="text-emerald-100">/{planPeriod === 'month' ? 'mês' : 'ano'}</span>
            </div>
          </div>

          {/* Payment Form */}
          <div className="p-6">
            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
              />
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">Forma de pagamento</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'card' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className={`text-sm font-medium ${paymentMethod === 'card' ? 'text-emerald-700' : 'text-slate-600'}`}>
                    Cartão de Crédito
                  </span>
                </button>
                <button
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'pix'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-6 h-6 mx-auto mb-2 rounded ${paymentMethod === 'pix' ? 'bg-emerald-600' : 'bg-slate-400'} flex items-center justify-center text-white text-xs font-bold`}>
                    P
                  </div>
                  <span className={`text-sm font-medium ${paymentMethod === 'pix' ? 'text-emerald-700' : 'text-slate-600'}`}>
                    PIX
                  </span>
                  <p className="text-xs text-emerald-600 mt-1">0,6% de taxa</p>
                </button>
              </div>
            </div>

            {/* Card Form */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome no cartão</label>
                  <input
                    type="text"
                    value={cardData.name}
                    onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                    placeholder="Como está no cartão"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Número do cartão</label>
                  <input
                    type="text"
                    value={cardData.number}
                    onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Validade</label>
                    <input
                      type="text"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                      placeholder="MM/AA"
                      maxLength={5}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">CVV</label>
                    <input
                      type="text"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })}
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PIX Info */}
            {paymentMethod === 'pix' && (
              <div className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-sm text-emerald-800 font-medium mb-2">Pagamento via PIX</p>
                <p className="text-xs text-emerald-700">
                  Após confirmar, você receberá um QR Code para pagamento instantâneo. 
                  O acesso será liberado automaticamente após a confirmação.
                </p>
              </div>
            )}

            {/* Security Badge */}
            <div className="flex items-center gap-2 mb-6 p-3 bg-slate-50 rounded-xl">
              <Lock className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-600">Pagamento seguro processado por Stripe</span>
            </div>

            {/* Submit Button */}
            <button
              onClick={handlePayment}
              disabled={loading || !email}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Pagar R$ {planPrice.toFixed(2).replace('.', ',')}
                </>
              )}
            </button>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>Dados protegidos</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Cancele quando quiser</span>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-800 font-medium mb-1">💡 Integração com Stripe</p>
          <p className="text-xs text-blue-700">
            Em produção, este formulário será substituído pelo Stripe Checkout. 
            Configure sua chave API em Configurações → Integrações.
          </p>
        </div>
      </div>
    </div>
  );
}
