import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Star, ShieldCheck, Heart, AppWindow, Calendar, DollarSign, Briefcase, ChevronRight, MessageCircle } from 'lucide-react';

interface OfferScreenProps {
  babyName: string;
}

export default function OfferScreen({ babyName }: OfferScreenProps) {
  const [activeTab, setActiveTab] = useState<'enxoval' | 'checklists' | 'financas' | 'mala'>('enxoval');

  const babyTitle = babyName ? babyName.trim() : 'seu bebê';

  const benefits = [
    { text: 'Enxoval inteligente recalculado', desc: 'Baseado na estação, clima e rotina de lavagem.' },
    { text: 'Checklist completo do pré-natal', desc: 'Todos os exames e vacinas organizados mês a mês.' },
    { text: 'Agenda automática da gestação', desc: 'Nunca mais esqueça uma consulta ou ultrassom.' },
    { text: 'Controle financeiro inteligente', desc: 'Monitore seus gastos com o enxoval sem planilhas.' },
    { text: 'Mala maternidade inteligente', desc: 'Lista exata do que levar para a mãe, bebê e acompanhante.' },
    { text: 'Links úteis com cupons', desc: 'Parcerias de desconto em grandes lojas de bebês.' },
    { text: 'Acompanhamento do bebê', desc: 'Evolução semanal de tamanho e desenvolvimento.' }
  ];

  const appScreens = {
    enxoval: {
      title: 'Enxoval Adaptivo',
      description: 'Quantidades exatas para o seu bebê baseado no inverno e clima de sua região.',
      content: (
        <div className="space-y-2 p-3 bg-white rounded-xl border border-neutral-warm-100">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-warm-400 mb-1">
            <span>SUA RECOMENDAÇÃO</span>
            <span className="text-brand-600 font-semibold bg-brand-50 px-1.5 py-0.5 rounded">EXCLUSIVO</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-neutral-warm-100">
            <span className="text-xs text-neutral-warm-700">Body Manga Longa (P)</span>
            <span className="text-xs font-bold text-neutral-warm-800 bg-neutral-warm-100 px-2 py-0.5 rounded">10 un</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-neutral-warm-100">
            <span className="text-xs text-neutral-warm-700">Mijões de Algodão</span>
            <span className="text-xs font-bold text-neutral-warm-800 bg-neutral-warm-100 px-2 py-0.5 rounded">10 un</span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-xs text-neutral-warm-700">Macacões Quentinhos</span>
            <span className="text-xs font-bold text-neutral-warm-800 bg-neutral-warm-100 px-2 py-0.5 rounded">8 un</span>
          </div>
        </div>
      )
    },
    checklists: {
      title: 'Pré-Natal Organizado',
      description: 'Roteiro completo de consultas, exames essenciais e vacinas recomendadas por trimestre.',
      content: (
        <div className="space-y-2 p-3 bg-white rounded-xl border border-neutral-warm-100">
          <div className="flex items-center gap-2 py-1 border-b border-neutral-warm-100">
            <input type="checkbox" defaultChecked className="accent-brand-600 w-3.5 h-3.5 rounded" />
            <span className="text-xs text-neutral-warm-500 line-through">Ultrassom Transvaginal (1º Trim)</span>
          </div>
          <div className="flex items-center gap-2 py-1 border-b border-neutral-warm-100">
            <input type="checkbox" defaultChecked className="accent-brand-600 w-3.5 h-3.5 rounded" />
            <span className="text-xs text-neutral-warm-500 line-through">Hemograma Completo & Tipagem</span>
          </div>
          <div className="flex items-center gap-2 py-1">
            <input type="checkbox" className="accent-brand-600 w-3.5 h-3.5 rounded" />
            <span className="text-xs text-neutral-warm-800 font-medium">Ultrassom Morfológico (2º Trim)</span>
          </div>
        </div>
      )
    },
    financas: {
      title: 'Controle Financeiro',
      description: 'Organize o orçamento do enxoval por categoria e saiba exatamente quanto está investindo.',
      content: (
        <div className="space-y-2.5 p-3 bg-white rounded-xl border border-neutral-warm-100">
          <div className="flex justify-between items-center bg-brand-50/50 p-2 rounded-lg">
            <span className="text-xs text-neutral-warm-600">Total Investido</span>
            <span className="text-xs font-bold text-brand-700">R$ 1.420,00</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-neutral-warm-500">
              <span>Vestuário (60%)</span>
              <span>R$ 852,00</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-warm-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-400 w-[60%]" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-neutral-warm-500">
              <span>Quarto & Decoração (40%)</span>
              <span>R$ 568,00</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-warm-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-300 w-[40%]" />
            </div>
          </div>
        </div>
      )
    },
    mala: {
      title: 'Mala da Maternidade',
      description: 'Checklists divididos para a mala do bebê, mala da mamãe e mala do acompanhante.',
      content: (
        <div className="space-y-2 p-3 bg-white rounded-xl border border-neutral-warm-100">
          <span className="text-[10px] uppercase tracking-wider font-mono text-neutral-warm-400 block">SAQUINHO 1 (Maternidade)</span>
          <div className="flex items-center gap-2 py-1 border-b border-neutral-warm-100">
            <input type="checkbox" className="accent-brand-600 w-3.5 h-3.5 rounded" />
            <span className="text-xs text-neutral-warm-800">1 Macacão longo RN</span>
          </div>
          <div className="flex items-center gap-2 py-1 border-b border-neutral-warm-100">
            <input type="checkbox" className="accent-brand-600 w-3.5 h-3.5 rounded" />
            <span className="text-xs text-neutral-warm-800">1 Body manga longa + 1 Calça</span>
          </div>
          <div className="flex items-center gap-2 py-1">
            <input type="checkbox" className="accent-brand-600 w-3.5 h-3.5 rounded" />
            <span className="text-xs text-neutral-warm-800">1 Fralda de pano + Meias e Touca</span>
          </div>
        </div>
      )
    }
  };

  const mockAppStoreIcon = (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map(star => (
        <Star key={star} className="w-3 h-3 text-amber-400 fill-amber-400" />
      ))}
      <span className="text-[10px] text-neutral-warm-500 font-mono">4.9 • Apple App Store</span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-xl mx-auto w-full flex flex-col gap-8 px-4 pb-16"
      id="offer-screen-container"
    >
      {/* Editorial Headline */}
      <div className="text-center">
        <span className="text-xs font-semibold bg-brand-100 text-brand-700 px-3.5 py-1.5 rounded-full inline-block mb-3.5">
          SEU PLANO DE ACESSO IMEDIATO 💜
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-neutral-warm-900 leading-tight">
          Toda a sua gestação, <br />
          <span className="text-brand-600 italic font-serif">organizada em um só lugar.</span>
        </h2>
        <p className="text-sm text-neutral-warm-500 mt-3 max-w-sm mx-auto leading-relaxed">
          O plano completo de enxoval para <strong>{babyTitle}</strong> já está configurado. Desbloqueie agora o aplicativo Gestante Organizada.
        </p>
      </div>

      {/* Interactive Mobile Application Frame */}
      <div className="bg-neutral-warm-100/70 border border-neutral-warm-200/60 rounded-3xl p-4 md:p-6 shadow-inner relative overflow-hidden">
        {/* Soft atmospheric colors */}
        <div className="absolute -left-12 -top-12 w-28 h-28 bg-brand-100/50 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -right-12 -bottom-12 w-28 h-28 bg-rose-100/50 rounded-full blur-xl pointer-events-none" />

        {/* Tab Controls (look like mini app features) */}
        <div className="grid grid-cols-4 gap-1.5 mb-5 relative z-10">
          {(['enxoval', 'checklists', 'financas', 'mala'] as const).map(tab => {
            const isTabActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 rounded-xl text-[10px] font-medium transition-all text-center flex flex-col items-center gap-1 cursor-pointer ${
                  isTabActive
                    ? 'bg-white text-brand-700 shadow-sm border border-neutral-warm-200'
                    : 'text-neutral-warm-500 hover:text-neutral-warm-800'
                }`}
              >
                {tab === 'enxoval' && <AppWindow className="w-3.5 h-3.5 text-brand-500" />}
                {tab === 'checklists' && <Calendar className="w-3.5 h-3.5 text-emerald-500" />}
                {tab === 'financas' && <DollarSign className="w-3.5 h-3.5 text-amber-500" />}
                {tab === 'mala' && <Briefcase className="w-3.5 h-3.5 text-indigo-500" />}
                <span className="capitalize leading-tight">{tab === 'checklists' ? 'Checklists' : tab === 'financas' ? 'Gastos' : tab}</span>
              </button>
            );
          })}
        </div>

        {/* Application Mockup Display Box */}
        <div className="bg-white rounded-2xl p-4 border border-neutral-warm-200 shadow-md min-h-[190px] flex flex-col justify-between relative z-10">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-serif font-bold text-neutral-warm-800">
                {appScreens[activeTab].title}
              </span>
              {mockAppStoreIcon}
            </div>
            
            <p className="text-[11px] text-neutral-warm-500 leading-normal mb-3">
              {appScreens[activeTab].description}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              {appScreens[activeTab].content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Social Proof Stats */}
      <div className="bg-brand-50/50 border border-brand-100 rounded-2xl p-4 flex items-center justify-between gap-3 text-left">
        <div className="flex -space-x-2 shrink-0">
          <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://picsum.photos/seed/mother1/100/100" alt="Mãe" referrerPolicy="no-referrer" />
          <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://picsum.photos/seed/mother2/100/100" alt="Mãe" referrerPolicy="no-referrer" />
          <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://picsum.photos/seed/mother3/100/100" alt="Mãe" referrerPolicy="no-referrer" />
        </div>
        <div className="text-xs text-neutral-warm-700">
          Mais de <strong>170 famílias</strong> já utilizam e recomendam o aplicativo no Brasil.
        </div>
      </div>

      {/* Premium Benefits List */}
      <div className="space-y-4">
        <h4 className="text-xs font-mono font-semibold tracking-wider text-neutral-warm-500 uppercase px-1">
          O que você vai receber:
        </h4>

        <div className="bg-white border border-neutral-warm-100 rounded-2xl divide-y divide-neutral-warm-100 overflow-hidden shadow-sm">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3.5 p-4 hover:bg-neutral-warm-50/50 transition">
              <div className="w-5 h-5 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0 mt-0.5 text-brand-600">
                <Check className="w-3 h-3 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-neutral-warm-800 block leading-tight">
                  {benefit.text}
                </span>
                <span className="text-[11px] text-neutral-warm-500 block leading-normal mt-0.5">
                  {benefit.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial Quote */}
      <div className="border-l-2 border-brand-400 pl-4 py-1 italic text-xs text-neutral-warm-600 leading-relaxed max-w-md mx-auto">
        "O aplicativo me salvou! Sou do RS e meu bebê nasceu no frio, as quantidades calculadas foram perfeitas. Não desperdicei nem uma pecinha sequer." <br />
        <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-warm-400 not-italic block mt-1.5">— Camila S., Mãe do Lucas</span>
      </div>

      {/* Pricing and Guarantee Container */}
      <div className="bg-white border border-brand-100/80 rounded-2xl p-6 shadow-sm text-center space-y-4">
        <div>
          <span className="text-[10px] tracking-widest uppercase font-semibold text-neutral-warm-400 block font-mono">ACESSO VITALÍCIO PROMOCIONAL</span>
          <div className="flex items-baseline justify-center gap-1.5 mt-2">
            <span className="text-sm font-semibold text-neutral-warm-500 line-through">R$ 97,00</span>
            <span className="text-2xl md:text-3xl font-serif font-bold text-neutral-warm-900">R$ 29,90</span>
          </div>
          <span className="text-[11px] text-brand-600 font-semibold block mt-1">Pagamento único • Sem mensalidades</span>
        </div>

        {/* CTA Button */}
        <motion.button
          type="button"
          id="cta-buy-access-button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => {
            alert('Parabéns pela decisão! Esse é o início de uma gestação tranquila e organizada. Você será redirecionada para a área de acesso premium 💜');
          }}
          className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-medium py-4 px-6 rounded-2xl transition shadow-xl shadow-brand-600/20 text-sm flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden"
        >
          <span>Quero acessar meu plano personalizado 💜</span>
          <ChevronRight className="w-4 h-4" />
        </motion.button>

        {/* Security / Guarantee badges */}
        <div className="pt-2 border-t border-neutral-warm-100 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-[10px] text-neutral-warm-500 font-medium text-left leading-tight">Garantia de 7 dias<br />Risco zero</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <MessageCircle className="w-5 h-5 text-brand-500 shrink-0" />
            <span className="text-[10px] text-neutral-warm-500 font-medium text-left leading-tight">Suporte 24/7<br />Por consultoras</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
