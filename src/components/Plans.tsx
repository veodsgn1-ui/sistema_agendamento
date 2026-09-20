import { Check, Star, Zap, Crown } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Gratuito',
    icon: Zap,
    price: 0,
    period: 'mês',
    description: 'Perfeito para começar',
    features: [
      'Até 20 agendamentos/mês',
      'Integração WhatsApp',
      'Integração Google Agenda',
      '1 colaborador',
      'Dashboard básico',
    ],
    limitations: [
      'Sem personalização de marca',
      'Sem relatórios avançados',
      'Sem suporte prioritário',
    ],
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Profissional',
    icon: Star,
    price: 49.90,
    period: 'mês',
    description: 'Para profissionais autônomos',
    features: [
      'Agendamentos ilimitados',
      'Integração WhatsApp',
      'Integração Google Agenda',
      'Até 5 colaboradores',
      'Personalização de marca',
      'Logo personalizado',
      'Cores do sistema',
      'Dashboard avançado',
      'Relatórios completos',
      'Suporte por email',
    ],
    highlighted: true,
  },
  {
    id: 'business',
    name: 'Empresarial',
    icon: Crown,
    price: 149.90,
    period: 'mês',
    description: 'Para clínicas e equipes',
    features: [
      'Tudo do plano Profissional',
      'Colaboradores ilimitados',
      'Múltiplas unidades',
      'API personalizada',
      'Integrações avançadas',
      'Suporte prioritário 24/7',
      'Gerente de conta dedicado',
      'Treinamento da equipe',
      'Backup automático',
      'SLA garantido',
    ],
    highlighted: false,
  },
];

import { useState } from 'react';
import Checkout from './Checkout';

export default function Plans() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);

  const handleSelectPlan = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  if (showCheckout && selectedPlan) {
    return (
      <Checkout
        planName={selectedPlan.name}
        planPrice={selectedPlan.price}
        planPeriod={selectedPlan.period}
        onSuccess={() => {
          alert('Pagamento realizado com sucesso! Seu plano foi ativado.');
          setShowCheckout(false);
        }}
        onCancel={() => setShowCheckout(false)}
      />
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
          Escolha o plano ideal para você
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Comece gratuitamente e evolua conforme sua necessidade. Sem fidelidade, cancele quando quiser.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-3xl shadow-sm border-2 transition-all hover:shadow-xl animate-slideUp ${
                plan.highlighted
                  ? 'border-emerald-500 shadow-emerald-500/20 scale-105'
                  : 'border-slate-100'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-medium rounded-full shadow-lg">
                  Mais Popular
                </div>
              )}
              
              <div className="p-6 lg:p-8">
                {/* Icon & Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    plan.highlighted
                      ? 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
                    <p className="text-sm text-slate-500">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-800">
                      {plan.price === 0 ? 'Grátis' : `R$ ${plan.price.toFixed(2).replace('.', ',')}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-slate-500">/{plan.period}</span>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3 rounded-xl font-medium transition-all ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {plan.price === 0 ? 'Começar Grátis' : 'Assinar Agora'}
                </button>

                {/* Features */}
                <div className="mt-6 space-y-3">
                  <p className="text-sm font-medium text-slate-700">Inclui:</p>
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations && (
                    <>
                      <div className="pt-3 border-t border-slate-100">
                        <p className="text-sm font-medium text-slate-500">Não inclui:</p>
                      </div>
                      {plan.limitations.map((limitation, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="w-5 h-5 flex items-center justify-center text-slate-400 flex-shrink-0">✕</span>
                          <span className="text-sm text-slate-400">{limitation}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Perguntas Frequentes
        </h2>
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-semibold text-slate-800 mb-2">Posso mudar de plano depois?</h3>
            <p className="text-sm text-slate-600">
              Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. A cobrança será ajustada proporcionalmente.
            </p>
          </div>
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-semibold text-slate-800 mb-2">Existe fidelidade ou contrato?</h3>
            <p className="text-sm text-slate-600">
              Não! Todos os planos são mensais sem fidelidade. Você pode cancelar quando quiser, sem multas.
            </p>
          </div>
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-semibold text-slate-800 mb-2">Como funciona o período de teste?</h3>
            <p className="text-sm text-slate-600">
              Oferecemos 15 dias grátis do plano Profissional para você testar todas as funcionalidades sem compromisso.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">Quais formas de pagamento são aceitas?</h3>
            <p className="text-sm text-slate-600">
              Aceitamos cartão de crédito, débito, PIX e boleto bancário. O pagamento é processado de forma segura.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
