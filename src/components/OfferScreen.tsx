import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Star, ShieldCheck, Heart, AppWindow, Calendar, DollarSign, Briefcase, ChevronRight, MessageCircle, AlertCircle, Sparkles, X, Lock } from 'lucide-react';

interface OfferScreenProps {
  babyName: string;
}

export default function OfferScreen({ babyName }: OfferScreenProps) {
  const [activeTab, setActiveTab] = useState<'enxoval' | 'checklists' | 'financas' | 'mala'>('enxoval');
  const [exitPopupShown, setExitPopupShown] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(37); // Defaults to promotional R$ 37

  // Pre-checkout redirect modal states
  const [isPreCheckoutOpen, setIsPreCheckoutOpen] = useState(false);
  const [preCheckoutUrl, setPreCheckoutUrl] = useState('');
  const [preCheckoutProgress, setPreCheckoutProgress] = useState(0);

  const babyTitle = babyName ? babyName.trim() : 'seu bebê';

  // Listen for exit intent (desktop mouse leave)
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 20 && !exitPopupShown) {
        setExitPopupShown(true);
        setIsPopupOpen(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [exitPopupShown]);

  // Mobile fallback exit intent (trigger after 15 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!exitPopupShown) {
        setExitPopupShown(true);
        setIsPopupOpen(true);
      }
    }, 15000); // 15 seconds

    return () => clearTimeout(timer);
  }, [exitPopupShown]);

  // Handle purchase CTA click - triggers pre-checkout screen
  const handleCtaClick = (e: React.MouseEvent, checkoutUrl: string) => {
    e.preventDefault();
    setPreCheckoutUrl(checkoutUrl);
    setPreCheckoutProgress(0);
    setIsPreCheckoutOpen(true);
  };

  // Pre-checkout simulated loading progress
  useEffect(() => {
    if (isPreCheckoutOpen) {
      const interval = setInterval(() => {
        setPreCheckoutProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 4; // Reaches 100% in ~2.5 seconds
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPreCheckoutOpen]);

  const handleApplyExitDiscount = () => {
    setCurrentPrice(27);
    setIsPopupOpen(false);
    // Smooth scroll to buy container to show the updated price
    const container = document.getElementById('price-buy-container');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const appScreens = {
    enxoval: {
      title: 'Enxoval por Tamanho',
      description: 'As quantidades exatas calibradas para cada tamanho (RN, P, M, G) com base nas respostas climáticas.',
      content: (
        <div className="space-y-2 p-3 bg-white rounded-xl border border-neutral-warm-100">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-warm-400 mb-1">
            <span>RECOMENDAÇÃO INTELIGENTE</span>
            <span className="text-brand-600 font-semibold bg-brand-50 px-1.5 py-0.5 rounded text-[9px]">COMPLETA</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-neutral-warm-50">
            <span className="text-xs text-neutral-warm-700 font-medium">Body Manga Longa (P)</span>
            <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">10 peças</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-neutral-warm-50">
            <span className="text-xs text-neutral-warm-700 font-medium">Mijões de Algodão (M)</span>
            <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">8 peças</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-neutral-warm-700 font-medium">Macacões Quentinhos (G)</span>
            <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">6 peças</span>
          </div>
        </div>
      )
    },
    checklists: {
      title: 'Pré-Natal Organizado',
      description: 'Roteiro de consultas médicas, vacinas, exames e ultrassons recomendados pela OMS mês a mês.',
      content: (
        <div className="space-y-2 p-3 bg-white rounded-xl border border-neutral-warm-100">
          <div className="flex items-center gap-2 py-1 border-b border-neutral-warm-50">
            <input type="checkbox" defaultChecked className="accent-brand-600 w-3.5 h-3.5 rounded pointer-events-none" />
            <span className="text-xs text-neutral-warm-500 line-through">Ultrassom Inicial (1º Trimestre)</span>
          </div>
          <div className="flex items-center gap-2 py-1 border-b border-neutral-warm-50">
            <input type="checkbox" className="accent-brand-600 w-3.5 h-3.5 rounded pointer-events-none" />
            <span className="text-xs text-neutral-warm-800 font-medium">Exame de Curva Glicêmica (2º Trimestre)</span>
          </div>
          <div className="flex items-center gap-2 py-1">
            <input type="checkbox" className="accent-brand-600 w-3.5 h-3.5 rounded pointer-events-none" />
            <span className="text-xs text-neutral-warm-800 font-medium">Vacina de Difteria & Tétano (3º Trimestre)</span>
          </div>
        </div>
      )
    },
    financas: {
      title: 'Controle Financeiro',
      description: 'Organize as parcelas e os valores investidos na gestação sem precisar de tabelas complexas.',
      content: (
        <div className="space-y-2.5 p-3 bg-white rounded-xl border border-neutral-warm-100">
          <div className="flex justify-between items-center bg-brand-50/40 p-2 rounded-lg">
            <span className="text-[11px] text-neutral-warm-600 font-semibold">Total Investido</span>
            <span className="text-xs font-bold text-brand-700">R$ 1.250,00</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-neutral-warm-500">
              <span>Vestuário e Roupinhas</span>
              <span>R$ 750,00</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-warm-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 w-[60%]" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-neutral-warm-500">
              <span>Móveis e Carrinho</span>
              <span>R$ 500,00</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-warm-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-300 w-[40%]" />
            </div>
          </div>
        </div>
      )
    },
    mala: {
      title: 'Mala de Maternidade',
      description: 'Instruções exatas do que levar em saquinhos separados, divididos por mamãe, bebê e acompanhante.',
      content: (
        <div className="space-y-2 p-3 bg-white rounded-xl border border-neutral-warm-100">
          <span className="text-[10px] uppercase tracking-wider font-mono text-brand-600 font-semibold block">SAQUINHO DO BEBÊ 01</span>
          <div className="flex items-center gap-2 py-1 border-b border-neutral-warm-50">
            <input type="checkbox" className="accent-brand-600 w-3.5 h-3.5 rounded pointer-events-none" />
            <span className="text-xs text-neutral-warm-800">1 Body manga longa + Calça RN</span>
          </div>
          <div className="flex items-center gap-2 py-1 border-b border-neutral-warm-50">
            <input type="checkbox" className="accent-brand-600 w-3.5 h-3.5 rounded pointer-events-none" />
            <span className="text-xs text-neutral-warm-800">1 Macacão de saída de maternidade</span>
          </div>
          <div className="flex items-center gap-2 py-1">
            <input type="checkbox" className="accent-brand-600 w-3.5 h-3.5 rounded pointer-events-none" />
            <span className="text-xs text-neutral-warm-800">1 Manta macia + Par de meias</span>
          </div>
        </div>
      )
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-xl mx-auto w-full flex flex-col gap-8 px-4 pb-16"
      id="offer-screen-container"
    >
      {/* Editorial Headline */}
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold bg-brand-100 text-brand-700 px-3.5 py-1.5 rounded-full inline-block mb-1 shadow-sm font-mono">
          SEU DIAGNÓSTICO ESTÁ CONCLUÍDO 💜
        </span>
        <h2 className="font-serif text-3xl font-bold text-neutral-warm-900 leading-tight">
          Você não precisa comprar mais.<br />
          <span className="text-brand-600 font-serif italic">Você precisa comprar melhor.</span>
        </h2>
        <p className="text-sm text-neutral-warm-600 max-w-lg mx-auto leading-relaxed font-medium">
          O método inteligente para montar o enxoval perfeito para o seu bebê, evitar desperdícios e economizar até R$ 1.500,00.
        </p>
      </div>

      {/* Why so many mothers spend too much section */}
      <div className="bg-white border border-neutral-warm-200/80 rounded-3xl p-6 shadow-sm space-y-5">
        <div className="text-center space-y-1">
          <h3 className="font-serif text-lg font-bold text-neutral-warm-900">
            Por que tantas mães acabam gastando mais do que deveriam?
          </h3>
          <p className="text-xs text-neutral-warm-500">
            Montar um enxoval sem planejamento personalizado costuma levar a estes 4 erros clássicos:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              num: "1",
              title: "Listas genéricas da internet",
              desc: "Seguir guias prontos que não consideram a estação do ano ou o clima regional em que seu bebê vai nascer."
            },
            {
              num: "2",
              title: "Excesso de roupas RN e P",
              desc: "Comprar roupas demais nos tamanhos recém-nascidos quando o bebê cresce de forma extremamente acelerada."
            },
            {
              num: "3",
              title: "Falta de cálculo de rotina",
              desc: "Não planejar as quantidades conforme a real frequência de lavagem e secagem das roupas na sua casa."
            },
            {
              num: "4",
              title: "Esquecimentos e urgências",
              desc: "Deixar de comprar itens essenciais antes da hora e precisar adquiri-los às pressas por valores bem maiores."
            }
          ].map((error, idx) => (
            <div key={idx} className="bg-neutral-warm-50/50 border border-neutral-warm-100 p-4 rounded-2xl flex gap-3.5 items-start">
              <span className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {error.num}
              </span>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-neutral-warm-800">
                  {error.title}
                </h4>
                <p className="text-[11px] text-neutral-warm-500 leading-relaxed">
                  {error.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Mobile Application Frame (Notion / Headspace style) */}
      <div className="bg-neutral-warm-100/80 border border-neutral-warm-200 rounded-3xl p-4 md:p-6 shadow-inner relative overflow-hidden">
        {/* Soft atmospheric glow */}
        <div className="absolute -left-12 -top-12 w-28 h-28 bg-brand-100/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -right-12 -bottom-12 w-28 h-28 bg-rose-100/40 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4 relative z-10 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-neutral-warm-700">PREVIEW DO SISTEMA</span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <Star key={star} className="w-3 h-3 text-amber-400 fill-amber-400" />
            ))}
            <span className="text-[10px] text-neutral-warm-500 font-mono font-medium">4.9 App Store</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="grid grid-cols-4 gap-1.5 mb-4 relative z-10">
          {(['enxoval', 'checklists', 'financas', 'mala'] as const).map(tab => {
            const isTabActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 rounded-xl text-[10px] font-medium transition-all text-center flex flex-col items-center gap-1 cursor-pointer ${
                  isTabActive
                    ? 'bg-white text-brand-700 shadow-md border border-neutral-warm-200'
                    : 'text-neutral-warm-500 hover:text-neutral-warm-800 hover:bg-white/40'
                }`}
              >
                {tab === 'enxoval' && <AppWindow className="w-3.5 h-3.5 text-brand-500" />}
                {tab === 'checklists' && <Calendar className="w-3.5 h-3.5 text-emerald-500" />}
                {tab === 'financas' && <DollarSign className="w-3.5 h-3.5 text-amber-500" />}
                {tab === 'mala' && <Briefcase className="w-3.5 h-3.5 text-indigo-500" />}
                <span className="capitalize leading-tight font-sans">
                  {tab === 'checklists' ? 'Pré-Natal' : tab === 'financas' ? 'Finanças' : tab}
                </span>
              </button>
            );
          })}
        </div>

        {/* Display Container */}
        <div className="bg-white rounded-2xl p-4 border border-neutral-warm-200 shadow-md min-h-[190px] flex flex-col justify-between relative z-10">
          <div>
            <span className="text-xs font-serif font-bold text-neutral-warm-800 block">
              {appScreens[activeTab].title}
            </span>
            <p className="text-[11px] text-neutral-warm-500 leading-normal mt-1 mb-3">
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
      <div className="bg-brand-50/60 border border-brand-100 rounded-2xl p-4 flex items-center justify-between gap-4 text-left shadow-sm">
        <div className="flex -space-x-2 shrink-0">
          <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="Mãe" referrerPolicy="no-referrer" />
          <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" alt="Mãe" referrerPolicy="no-referrer" />
          <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Mãe" referrerPolicy="no-referrer" />
        </div>
        <div className="text-xs text-neutral-warm-700 leading-snug">
          Mais de <strong>2.450 mães</strong> já estruturaram o enxoval e economizaram tempo e dinheiro com este método em todo o Brasil.
        </div>
      </div>

      {/* SEÇÃO PREMIUM: SEU APLICATIVO COMPLETO JÁ ESTÁ PRONTO */}
      <div className="pt-8 space-y-12">
        <div className="text-center space-y-3 px-1">
          <span className="text-[10px] tracking-widest uppercase font-semibold text-brand-600 block font-mono">PLATAFORMA PREMIUM DESBLOQUEADA</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-neutral-warm-900 tracking-tight leading-tight">
            ✨ Seu aplicativo completo já está pronto
          </h2>
          <p className="text-xs md:text-sm text-neutral-warm-600 max-w-xl mx-auto leading-relaxed">
            Ao finalizar seu acesso você desbloqueia uma ferramenta completa para organizar toda a sua gestação, desde o planejamento do enxoval até os últimos dias antes do nascimento.
          </p>
        </div>

        {/* SEQUENCE OF CARDS (EXCELLENT CELLPHONE screenshots pairing) */}
        <div className="space-y-8">
          {[
            {
              icon: "🍼",
              title: "Enxoval Inteligente",
              description: "Lista personalizada com as quantidades ideais para a sua realidade.",
              bullets: ['Roupinhas', 'Banho', 'Higiene', 'Cuidados', 'Passeio', 'Amamentação', 'Quartinho', 'Muito mais'],
              image: "https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-17-de-jul.-de-2026-21_11_46.png"
            },
            {
              icon: "📋",
              title: "Checklist Pré-natal",
              description: "Organize consultas, exames, vacinas e todas as tarefas importantes de cada trimestre.",
              bullets: ['Exames', 'Vacinas', 'Médicos', 'Triagens', 'Preparativos', 'Exames de Sangue'],
              image: "https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-17-de-jul.-de-2026-21_23_01.png"
            },
            {
              icon: "🧳",
              title: "Mala da maternidade",
              description: "Checklist completo da mala do bebê, da mamãe, acompanhante, documentos e bolsa de passeio.",
              bullets: ['Mala da Mãe', 'Mala do Bebê', 'Mala do Pai', 'Documentação', 'Necessaires', 'Objetos Úteis'],
              image: "https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-17-de-jul.-de-2026-21_17_57.png"
            },
            {
              icon: "💰",
              title: "Controle de gastos",
              description: "Acompanhe quanto já investiu em cada categoria do enxoval e evite compras repetidas ou desnecessárias.",
              bullets: ['Limite de Gastos', 'Acompanhamento', 'Economia Real', 'Parcelas', 'Gráficos de Custo'],
              image: "https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-17-de-jul.-de-2026-21_27_10.png"
            },
            {
              icon: "📅",
              title: "Agenda",
              description: "Nunca mais esqueça exames, consultas, lembretes e compromissos importantes.",
              bullets: ['Calendário Semanal', 'Compromissos', 'Lembretes de Vacinas', 'Notificações'],
              image: "https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-9-de-jul.-de-2026-11_14_45.png"
            },
            {
              icon: "🤰",
              title: "Minha Gestação",
              description: "Veja a evolução da gravidez, semanas, desenvolvimento do bebê e quanto falta para o nascimento.",
              bullets: ['Evolução Semanal', 'Desenvolvimento', 'Estágio do Bebê', 'Sintomas diários'],
              image: "https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-17-de-jul.-de-2026-21_07_41.png"
            },
            {
              icon: "📝",
              title: "Minhas Anotações",
              description: "Guarde dúvidas para o médico, ideias para o quartinho e tudo o que for importante durante a gestação.",
              bullets: ['Perguntas ao Pediatra', 'Inspirações de Quartos', 'Dúvidas Obstetra'],
              image: "https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-17-de-jul.-de-2026-21_29_36.png"
            },
            {
              icon: "🛍",
              title: "Onde Comprar",
              description: "Categorias organizadas para facilitar suas compras e economizar tempo.",
              bullets: ['Facilidade de Compra', 'Categorização', 'Lojas Próximas', 'Lojas Online Recomendadas'],
              image: "https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-9-de-jul.-de-2026-11_09_48.png"
            }
          ].map((card, idx) => (
            <div 
              key={idx}
              className="bg-white border border-neutral-warm-100/80 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-5 hover:shadow-md transition-all duration-300 relative overflow-hidden text-left"
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{card.icon}</span>
                  <h3 className="text-base font-bold text-neutral-warm-800 font-serif">
                    {card.title}
                  </h3>
                </div>
                <p className="text-xs text-neutral-warm-500 leading-relaxed font-medium">
                  {card.description}
                </p>
                {card.bullets && (
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {card.bullets.map(bullet => (
                      <span key={bullet} className="text-[9px] font-semibold bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full border border-brand-100/20 shadow-[0_1px_1px_rgba(0,0,0,0.01)]">
                        ✔ {bullet}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Screenshot Frame with subtle drop shadow and curved borders */}
              <div className="w-full rounded-2xl overflow-hidden border border-neutral-warm-100/40 shadow-sm aspect-[1.3] relative bg-neutral-warm-50/50">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          ))}
        </div>

        {/* DESTAQUE: SEU ACESSO DESBLOQUEIA IMEDIATAMENTE (Style layout with elegant white card of Flo-style feel) */}
        <div className="bg-white border border-neutral-warm-100/80 rounded-[32px] p-8 md:p-10 shadow-sm text-left space-y-6 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-36 h-36 bg-brand-50/40 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-36 h-36 bg-rose-50/20 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-1.5 relative z-10">
            <span className="text-[10px] tracking-widest uppercase font-semibold text-brand-600 block font-mono">TUDO INCLUSO NA PLATAFORMA</span>
            <h3 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-neutral-warm-900 leading-tight">
              🔓 Seu acesso desbloqueia imediatamente
            </h3>
            <p className="text-xs text-neutral-warm-500 leading-relaxed">
              Muito mais do que uma lista de enxoval. Você está adquirindo um aplicativo completo para acompanhar toda sua gestação:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-4 pt-2 relative z-10">
            {[
              "Lista de enxoval inteligente em todas as categorias (quarto, higiene, passeio...)",
              "Onde comprar cada item de forma otimizada",
              "97 itens organizados sob medida",
              "Quantidades personalizadas para seu clima",
              "Checklist Pré-natal com consultas e exames",
              "Agenda completa de compromissos",
              "Controle financeiro integrado de gastos",
              "Mala maternidade dividida por saquinhos",
              "Checklist de itens para a mala da mamãe",
              "Checklist de itens para a mala do acompanhante",
              "Organização automática por trimestre",
              "Links e indicações úteis",
              "Espaço ilimitado para anotações médicas",
              "Acesso vitalício e livre de assinaturas"
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0 text-brand-600 mt-0.5 shadow-sm">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-xs font-semibold text-neutral-warm-700 leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* COMPARAÇÃO VISUAL - Outras gestantes vs Gestante Organizada */}
        <div className="space-y-6 text-center py-4">
          <div className="space-y-2 px-4">
            <span className="text-[10px] tracking-widest uppercase font-semibold text-brand-600 block font-mono">PRATICIDADE & SIMPLICIDADE</span>
            <h3 className="font-serif text-xl md:text-2xl font-bold text-neutral-warm-900 tracking-tight leading-tight">
              Enquanto outras gestantes precisam usar vários aplicativos...
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left px-1">
            {/* Outros Column */}
            <div className="bg-white border border-neutral-warm-100 rounded-3xl p-6 shadow-sm space-y-4">
              <span className="text-xs font-bold text-neutral-warm-400 uppercase tracking-wider block font-mono">OUTROS MÉTODOS</span>
              <div className="space-y-3">
                {[
                  "Usam papel, blocos de notas ou planilhas difíceis de mexer",
                  "Esquecem consultas, exames ou vacinas importantes do pré-natal",
                  "Comprar roupas que o bebê nunca chega a usar por falta de planejamento",
                  "Sofrem com ansiedade na reta final sem saber o que falta organizar"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold shrink-0 text-sm mt-0.5">❌</span>
                    <span className="text-xs text-neutral-warm-500 font-semibold leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gestante Organizada Column */}
            <div className="bg-brand-50/50 border-2 border-brand-200 rounded-3xl p-6 shadow-md space-y-5 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-brand-100/40 rounded-full blur-xl pointer-events-none" />
              
              <div className="space-y-4 relative z-10">
                <span className="text-xs font-bold text-brand-700 uppercase tracking-wider block font-mono">GESTANTE ORGANIZADA</span>
                <div className="space-y-3">
                  {[
                    "Tudo unificado e inteligente em um só lugar no celular",
                    "Alertas e calendário completo com todas as vacinas e exames",
                    "Economia real comprando apenas as quantidades certas para o seu clima",
                    "Tranquilidade de ter saquinhos da maternidade e mala 100% prontos"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 bg-white/80 p-2.5 rounded-xl border border-brand-100/50 shadow-sm">
                      <span className="text-brand-600 font-bold shrink-0 text-sm mt-0.5">💜</span>
                      <span className="text-xs font-bold text-neutral-warm-800 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1 pt-4 border-t border-brand-100/50 relative z-10">
                <p className="text-xs text-brand-800 font-bold leading-normal">
                  Mais praticidade. Menos estresse.<br />
                  Tudo organizado em um só lugar.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TELA DE DESBLOQUEIO PREMIUM (Visual escuro, estilo Apple) */}
        <div className="bg-neutral-warm-900 text-white rounded-[32px] p-6 md:p-8 shadow-2xl text-left space-y-6 relative overflow-hidden border border-brand-500/30">
          {/* Subtle colored glow at edges */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="absolute right-0 top-0 bg-brand-600 text-white font-mono text-[9px] font-bold px-3 py-1.5 rounded-bl-2xl tracking-widest uppercase">
            SISTEMA INTEGRADO
          </div>

          <div className="space-y-1 relative z-10">
            <span className="text-[9px] tracking-widest uppercase font-semibold text-brand-300 block font-mono">DESBLOQUEIO INSTANTÂNEO</span>
            <h3 className="font-serif text-xl md:text-2xl font-bold text-white leading-tight">
              💜 Hoje você está desbloqueando um aplicativo que vai acompanhar toda a sua gestação.
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 relative z-10">
            {[
              { label: "🍼 97 itens organizados", desc: "Enxoval personalizado por tamanhos" },
              { label: "📋 Mais de 70 tarefas de pré-natal", desc: "Cronograma de vacinas e exames" },
              { label: "🧳 5 checklists de malas prontos", desc: "Bebê, mãe e acompanhante preparados" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/[0.08] border border-white/15 rounded-2xl p-4 flex flex-col justify-between gap-1 shadow-inner hover:bg-white/15 transition-colors">
                <span className="text-xs font-bold text-white leading-snug">{item.label}</span>
                <span className="text-[10px] text-neutral-warm-100 font-medium">{item.desc}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-4 border-t border-white/15 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-sm">♾️</span>
              <span className="text-xs font-bold text-brand-300">Acesso vitalício</span>
            </div>
            <p className="text-[11px] text-neutral-warm-100 leading-normal">
              Sem assinaturas recorrentes ou mensalidades futuras. Pague uma única vez e tenha acesso a todas as atualizações e novidades que lançarmos para sempre.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing and Purchase Box */}
      <div 
        id="price-buy-container"
        className="bg-white border-2 border-brand-100/80 rounded-[32px] p-6 md:p-8 shadow-xl text-center space-y-5 relative overflow-hidden"
      >
        {/* Soft subtle tag */}
        <div className="absolute top-0 inset-x-0 bg-brand-50 border-b border-brand-100/50 py-1.5 text-[10px] font-mono font-semibold text-brand-700 uppercase tracking-widest">
          💎 ACESSO PREMIUM VITALÍCIO
        </div>

        <div className="pt-6">
          <span className="text-[10px] tracking-widest uppercase font-semibold text-neutral-warm-400 block font-mono">PAGAMENTO ÚNICO • SEM MENSALIDADE</span>
          
          <div className="flex items-baseline justify-center gap-2 mt-2">
            <span className="text-xs font-semibold text-neutral-warm-400 line-through">R$ 47,00</span>
            <span className="text-3xl font-serif font-bold text-neutral-warm-900">R$ {currentPrice},00</span>
          </div>

          <span className="text-[11px] text-brand-600 font-semibold block mt-1.5 bg-brand-50/60 max-w-max mx-auto px-2.5 py-0.5 rounded-full">
            {currentPrice === 27 ? '💥 Desconto Adicional de Última Chance Aplicado!' : 'Aproveite o desconto de conclusão'}
          </span>
        </div>

        {/* Highlights List */}
        <div className="space-y-1.5 py-2 px-4 rounded-2xl bg-neutral-warm-50 border border-neutral-warm-100 text-left">
          {[
            "Sem mensalidade ou taxas ocultas",
            "Atualizações gratuitas vitalícias",
            "Garantia incondicional de 7 dias",
            "Acesso imediato após confirmação do pagamento"
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-neutral-warm-600">
              <Check className="w-3.5 h-3.5 text-brand-500 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Main CTA button showing application unlock */}
        <div className="space-y-2">
          <motion.button
            id="cta-buy-access-button"
            onClick={(e) => handleCtaClick(e, currentPrice === 27 ? "https://pay.kiwify.com.br/KtkK89u" : "https://pay.kiwify.com.br/1j4MNX7")}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-6 rounded-2xl transition shadow-xl shadow-brand-600/20 text-sm flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden"
          >
            <span>Quero liberar meu aplicativo completo 💜</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </motion.button>
          
          <span className="text-[10px] text-neutral-warm-500 font-medium block">
            🔒 Oferta exclusiva deste diagnóstico. Após sair desta página ela poderá não estar mais disponível.
          </span>
        </div>

        {/* Security and 7-day guarantee details */}
        <div className="pt-4 border-t border-neutral-warm-100 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-left">
              <span className="text-[10px] text-neutral-warm-800 font-bold block leading-tight">Garantia 7 Dias</span>
              <span className="text-[9px] text-neutral-warm-500 block">Satisfação ou reembolso</span>
            </div>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <MessageCircle className="w-5 h-5 text-brand-500 shrink-0" />
            <div className="text-left">
              <span className="text-[10px] text-neutral-warm-800 font-bold block leading-tight">Suporte Premium</span>
              <span className="text-[9px] text-neutral-warm-500 block">Dúvidas por e-mail</span>
            </div>
          </div>
        </div>
      </div>

      {/* PREMIUM EXIT POPUP (Glassmorphism backdrop & pure design) */}
      <AnimatePresence>
        {isPopupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-hidden" id="exit-popup-overlay">
            {/* Dark glass backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPopupOpen(false)}
              className="absolute inset-0 bg-neutral-warm-950/70 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-white border border-brand-100 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative z-10 text-center space-y-6"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsPopupOpen(false)}
                className="absolute right-4 top-4 p-1 rounded-full text-neutral-warm-400 hover:text-neutral-warm-600 hover:bg-neutral-warm-50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Sparkles className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-neutral-warm-900 leading-tight">
                  Espere um instante... 💜
                </h3>
                <p className="text-xs text-neutral-warm-600 leading-relaxed">
                  Não queremos que você saia sem o plano ideal para a chegada do seu bebê. Por termos identificado um potencial de economia de até <strong>R$ 1.500,00</strong> no seu diagnóstico, decidimos fazer algo inédito.
                </p>
                <p className="text-xs text-neutral-warm-600 leading-relaxed font-medium">
                  Liberamos o seu Plano Completo + Planilhas e Bônus com o maior desconto histórico: de R$ 47,00 por apenas <strong>R$ 27,00</strong>. Evite gastos desnecessários e sinta a tranquilidade de estar 100% preparada.
                </p>
              </div>

              {/* Promo Price Box */}
              <div className="bg-brand-50/60 border border-brand-100 rounded-2xl py-3 px-4 max-w-max mx-auto">
                <span className="text-[9px] font-mono tracking-widest text-brand-700 block uppercase font-bold">OFERTA DE ÚLTIMA CHANCE</span>
                <div className="flex items-baseline justify-center gap-1.5 mt-0.5">
                  <span className="text-xs text-neutral-warm-400 line-through">R$ 47,00</span>
                  <span className="text-xl font-serif font-bold text-neutral-warm-900">R$ 27,00</span>
                </div>
              </div>

              <p className="text-[10px] text-rose-500 font-semibold leading-normal">
                Esta condição é válida somente agora.<br />
                Ao fechar esta janela ela poderá não estar mais disponível.
              </p>

              {/* Action Buttons with pre-checkout redirect */}
              <div className="flex flex-col gap-2.5">
                <button
                  id="exit-popup-accept"
                  onClick={(e) => {
                    handleCtaClick(e, "https://pay.kiwify.com.br/KtkK89u");
                    handleApplyExitDiscount();
                  }}
                  className="w-full text-center bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition shadow-lg shadow-brand-600/15 cursor-pointer block"
                >
                  Quero garantir meu acesso por R$27
                </button>
                <button
                  type="button"
                  id="exit-popup-decline"
                  onClick={() => setIsPopupOpen(false)}
                  className="w-full text-center text-xs text-neutral-warm-500 hover:text-neutral-warm-800 font-medium py-1.5 cursor-pointer"
                >
                  Continuar navegando
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PRE-CHECKOUT TRANSITION OVERLAY (Friction Screen) */}
      <AnimatePresence>
        {isPreCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-hidden" id="pre-checkout-overlay">
            {/* Dark glassmorphism backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-warm-950/85 backdrop-blur-lg"
            />

            {/* Premium pre-checkout card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-white border border-brand-100 rounded-[32px] p-6 md:p-8 max-w-md w-full shadow-2xl relative z-10 text-center space-y-6"
            >
              {/* Star decorative badge */}
              <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-7 h-7" />
              </div>

              <div className="space-y-3.5">
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-neutral-warm-900 leading-tight">
                  🎉 Parabéns!
                </h3>
                <p className="text-sm text-neutral-warm-600 leading-relaxed">
                  Seu planejamento foi preparado com sucesso.
                </p>
                <p className="text-xs text-neutral-warm-500 leading-relaxed">
                  Reservamos seu acesso pelos próximos <span className="font-bold text-brand-700">15 minutos</span>. Conclua seu acesso agora para desbloquear todas as funcionalidades.
                </p>
              </div>

              {/* Progress loader visual */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] text-neutral-warm-400 font-mono">
                  <span>PREPARANDO AMBIENTE SEGURO...</span>
                  <span>{preCheckoutProgress}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-warm-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-brand-600 rounded-full"
                    style={{ width: `${preCheckoutProgress}%` }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                id="pre-checkout-continue-button"
                onClick={() => {
                  window.location.href = preCheckoutUrl;
                }}
                disabled={preCheckoutProgress < 100}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  preCheckoutProgress >= 100
                    ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/15 cursor-pointer'
                    : 'bg-neutral-warm-100 text-neutral-warm-400 cursor-not-allowed'
                }`}
              >
                <span>Continuar</span>
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
