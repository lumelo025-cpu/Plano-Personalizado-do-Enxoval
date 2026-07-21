import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ShieldCheck, Heart, Calendar, ChevronRight, MessageCircle, Sparkles, X, Lock, Thermometer, Baby, Sparkle, FileText, ChevronUp, ChevronDown } from 'lucide-react';
import { FunnelState } from '../types';
import { getSeason, calculateWeeksRemaining, getClimateInfo } from '../data';

interface OfferScreenProps {
  state: FunnelState;
}

export default function OfferScreen({ state }: OfferScreenProps) {
  const [showRNDetails, setShowRNDetails] = useState(true);
  const [exitPopupShown, setExitPopupShown] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(37); // Defaults to promotional R$ 37

  // Pre-checkout redirect modal states
  const [isPreCheckoutOpen, setIsPreCheckoutOpen] = useState(false);
  const [preCheckoutUrl, setPreCheckoutUrl] = useState('');
  const [preCheckoutProgress, setPreCheckoutProgress] = useState(0);

  // Dynamic values based on state
  const season = getSeason(state.dueDate);
  const weeksRemaining = calculateWeeksRemaining(state.dueDate);
  const stateInfo = getClimateInfo(state.birthState);

  const formattedDueDate = state.dueDate
    ? new Date(state.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : 'Não definida';

  const babyTitle = state.babyName ? state.babyName.trim() : 'Seu Bebê';

  // Dynamic summary text
  const summaryText = useMemo(() => {
    const babyText = state.babyName ? state.babyName.trim() : 'o seu bebê';
    const isCold = stateInfo.isCold || season === 'Inverno' || season === 'Outono';
    
    const firstBabyText = state.isFirstBaby 
      ? 'Como esta é a sua primeira gestação, calibramos as quantidades focando no essencial prático para dar segurança, evitando excesso de compras sem utilidade.' 
      : 'Como você já tem experiência de gestações anteriores, adaptamos o seu plano para focar na reposição estratégica de peças de alta durabilidade e facilidade de troca rápida.';
      
    const climateSeasonText = isCold 
      ? `Com o parto previsto para a estação de ${season} em ${stateInfo.name}, a nossa análise climática indica que as primeiras semanas do(a) ${babyText} exigirão proteção térmica reforçada. Teve preferência tecidos de fibra natural de algodão encorpado, soft e plush.`
      : `Como o nascimento ocorrerá sob o clima do(a) ${season} em ${stateInfo.name}, o plano foi otimizado para dias mais quentes. Tecidos leves de 100% algodão respirável, suedine e malhas finas são a prioridade absoluta para manter a pele respirando e evitar brotoejas.`;

    const laundryText = state.laundryFrequency === 'daily'
      ? 'Considerando que você costuma lavar roupas diariamente, otimizamos o plano para que você precise de menos peças no armário, garantindo sustentabilidade financeira.'
      : 'Dado o intervalo maior entre lavagens de roupas, adicionamos um fator de segurança para garantir que você sempre tenha roupinhas secas e limpas disponíveis.';

    return `${firstBabyText} ${climateSeasonText} ${laundryText}`;
  }, [state, season, stateInfo]);

  // RN items calculations
  const isColdTime = season === 'Inverno' || (season === 'Outono' && stateInfo.isCold) || stateInfo.isCold;
  
  const laundryMultiplier = state.laundryFrequency === 'daily' ? 0.75 : state.laundryFrequency === 'few_times_week' ? 1.35 : 1.0;
  const dryerMultiplier = state.hasDryer === true ? 0.85 : 1.0;
  const twinsMultiplier = state.isTwins ? 1.85 : 1.0;
  const factor = laundryMultiplier * dryerMultiplier * twinsMultiplier;

  const rnItems = [
    {
      name: 'Body Manga Curta (Tamanho RN)',
      qty: Math.max(2, Math.round((isColdTime ? 4 : 8) * factor)),
      reason: isColdTime 
        ? 'Utilizado principalmente como primeira camada protetora por baixo de macacões macios.'
        : 'A peça mais fresca e respirável para o dia a dia nos primeiros dias de vida.'
    },
    {
      name: 'Body Manga Longa (Tamanho RN)',
      qty: Math.max(2, Math.round((isColdTime ? 8 : 4) * factor)),
      reason: isColdTime
        ? 'Item de extrema necessidade para manter a temperatura corporal regulada em dias frios.'
        : 'Importante para noites mais frescas, saídas estratégicas ou ambientes com ar-condicionado.'
    },
    {
      name: 'Calça / Mijão (Tamanho RN)',
      qty: Math.max(2, Math.round((isColdTime ? 8 : 5) * factor)),
      reason: 'Combinação perfeita com os bodys. Protege as perninhas de forma confortável sem apertar o umbigo.'
    },
    {
      name: 'Macacão RN (com zíper ou botões)',
      qty: Math.max(2, Math.round((isColdTime ? 6 : 3) * factor)),
      reason: isColdTime
        ? 'Essencial para saídas de maternidade e sonecas aconchegantes com proteção completa.'
        : 'Opções leves de algodão antialérgico para proteger o bebê com conforto durante o sono.'
    }
  ];

  const totalRNItems = rnItems.reduce((acc, item) => acc + item.qty, 0);

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-xl mx-auto w-full flex flex-col gap-8 px-4 pb-16"
      id="offer-screen-container"
    >
      {/* Editorial Headline */}
      <div className="text-center space-y-2 mt-2">
        <span className="text-xs font-semibold bg-brand-100 text-brand-700 px-3.5 py-1.5 rounded-full inline-block shadow-sm font-mono">
          SEU DIAGNÓSTICO ESTÁ CONCLUÍDO 💜
        </span>
        <h2 className="font-serif text-3xl font-bold text-neutral-warm-900 leading-tight">
          Seu planejamento inteligente está pronto.
        </h2>
        <p className="text-xs text-neutral-warm-500 max-w-sm mx-auto leading-relaxed">
          Utilizamos suas respostas para estruturar um planejamento personalizado para toda a sua gestação.
        </p>
      </div>

      {/* 1) RESULTADO */}
      <div className="bg-white border border-neutral-warm-200 rounded-3xl shadow-sm p-6 relative overflow-hidden flex flex-col gap-5 text-left">
        <div className="absolute right-0 top-0 bg-brand-600 text-white text-[9px] font-mono tracking-widest uppercase font-bold px-3 py-1 rounded-bl-xl shadow-sm">
          Relatório Oficial
        </div>

        <div className="border-b border-neutral-warm-100 pb-3 flex items-center gap-2">
          <Baby className="w-5 h-5 text-brand-600" />
          <h3 className="font-serif text-base font-bold text-neutral-warm-900">
            Ficha Cadastral da Gestação
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
          <div className="space-y-1">
            <span className="text-[10px] text-neutral-warm-400 font-mono tracking-wider block uppercase">IDENTIDADE DO BEBÊ</span>
            <span className="text-xs font-semibold text-neutral-warm-800 flex items-center gap-1">
              <Sparkle className="w-3.5 h-3.5 text-brand-500 shrink-0" />
              {babyTitle}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-neutral-warm-400 font-mono tracking-wider block uppercase">PREVISÃO DO PARTO</span>
            <span className="text-xs font-semibold text-neutral-warm-800 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-neutral-warm-500 shrink-0" />
              {formattedDueDate}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-neutral-warm-400 font-mono tracking-wider block uppercase">SEMANAS RESTANTES</span>
            <span className="text-xs font-semibold text-brand-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse shrink-0" />
              Aproximadamente {weeksRemaining} semanas
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-neutral-warm-400 font-mono tracking-wider block uppercase">ESTAÇÃO DO NASCIMENTO</span>
            <span className="text-xs font-semibold text-neutral-warm-800 flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              {season}
            </span>
          </div>

          <div className="col-span-2 space-y-1 border-t border-neutral-warm-50 pt-2.5">
            <span className="text-[10px] text-neutral-warm-400 font-mono tracking-wider block uppercase">CLIMA PREDOMINANTE ({state.birthState})</span>
            <p className="text-xs font-medium text-neutral-warm-800 leading-normal">
              {stateInfo.climateDesc} ({stateInfo.isCold ? 'Necessita agasalhos' : 'Clima quente/temperado'})
            </p>
          </div>
        </div>

        {/* Resumo do Planejamento */}
        <div className="bg-neutral-warm-50 rounded-2xl p-4 border border-neutral-warm-100/80 space-y-2 mt-1">
          <div className="flex items-center gap-1.5 text-neutral-warm-800">
            <FileText className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-serif font-bold">Resumo do Planejamento</span>
          </div>
          <p className="text-xs text-neutral-warm-600 leading-relaxed text-justify">
            {summaryText}
          </p>
        </div>
      </div>

      {/* 2) ECONOMIA */}
      <div className="bg-gradient-to-br from-brand-50 to-brand-100/40 border border-brand-200 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden flex flex-col gap-4 text-left">
        <div className="absolute right-4 top-4 opacity-10">
          <Sparkles className="w-16 h-16 text-brand-600" />
        </div>

        <div className="flex items-center justify-between gap-2 border-b border-brand-200/50 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">💰</span>
            <h4 className="font-serif text-base font-bold text-neutral-warm-900">
              Economia estimada
            </h4>
          </div>
          <span className="text-[10px] font-mono tracking-wider font-semibold text-brand-700 bg-white/90 px-3 py-1 rounded-full border border-brand-200">
            ✨ Economia Inteligente Calculada
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-lg md:text-xl font-bold text-brand-800 leading-snug">
            Você pode economizar até <span className="text-brand-600">R$ 800</span> comprando apenas o necessário para o seu bebê.
          </p>
          <p className="text-xs text-neutral-warm-600 leading-relaxed font-medium">
            Estimativa baseada na estação do nascimento, clima predominante, frequência de lavagem das roupas e planejamento inteligente do enxoval.
          </p>
        </div>
      </div>

      {/* 3) RN LIBERADO */}
      <div className="space-y-4 text-left">
        {/* Calculated stats */}
        <div className="bg-brand-50/40 border border-brand-100 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2 text-brand-800 font-bold text-sm font-serif">
            <span className="text-lg leading-none">🔓</span>
            <span>Seu plano já foi calculado.</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white border border-neutral-warm-100/80 p-3 rounded-xl flex flex-col justify-center shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <span className="text-[9px] text-neutral-warm-400 font-mono block uppercase tracking-wider font-semibold">Preparados</span>
              <span className="text-sm font-bold text-brand-700 mt-0.5">97 itens</span>
            </div>
            <div className="bg-emerald-50/50 border border-emerald-100/60 p-3 rounded-xl flex flex-col justify-center shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <span className="text-[9px] text-emerald-600 font-mono block uppercase tracking-wider font-semibold">Liberados</span>
              <span className="text-sm font-bold text-emerald-700 mt-0.5">20 itens</span>
            </div>
            <div className="bg-neutral-warm-50 border border-neutral-warm-100 p-3 rounded-xl flex flex-col justify-center shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <span className="text-[9px] text-neutral-warm-500 font-mono block uppercase tracking-wider font-semibold">Protegidos</span>
              <span className="text-sm font-bold text-neutral-warm-600 mt-0.5">77 itens</span>
            </div>
          </div>
        </div>

        {/* Collapsible size RN section */}
        <div className="flex items-center justify-between px-1">
          <h4 className="text-[10px] font-mono font-semibold tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-full uppercase flex items-center gap-1.5 shadow-sm">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            RECOMENDAÇÃO LIBERADA (Tamanho RN)
          </h4>
          <span className="text-[10px] text-neutral-warm-400 font-mono font-bold">100% GRATUITO</span>
        </div>

        <div className="bg-white border border-neutral-warm-200 rounded-3xl overflow-hidden shadow-sm">
          <button
            onClick={() => setShowRNDetails(!showRNDetails)}
            className="w-full p-5 bg-gradient-to-r from-emerald-50/20 to-white border-b border-neutral-warm-100 flex items-center justify-between text-left cursor-pointer transition-colors hover:from-emerald-50/40"
          >
            <div>
              <span className="text-sm font-serif font-bold text-neutral-warm-800 block">Recém-nascido (RN)</span>
              <span className="text-[11px] text-neutral-warm-500 block mt-0.5">Peças essenciais calculadas para as primeiras semanas de vida</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                {totalRNItems} Peças
              </span>
              {showRNDetails ? <ChevronUp className="w-4.5 h-4.5 text-neutral-warm-400" /> : <ChevronDown className="w-4.5 h-4.5 text-neutral-warm-400" />}
            </div>
          </button>

          {showRNDetails && (
            <div className="p-5 space-y-4 bg-white divide-y divide-neutral-warm-100/50">
              {rnItems.map((item, index) => (
                <div key={index} className="pt-4 first:pt-0 flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-bold text-neutral-warm-800 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                      {item.name}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full font-mono max-w-max">
                      Qtd: {item.qty} peças
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-warm-500 leading-relaxed pl-3 text-justify">
                    {item.reason}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4) ITENS BLOQUEADOS */}
      <div className="space-y-3 text-left">
        <h4 className="text-[10px] font-mono font-semibold tracking-wider text-neutral-warm-400 uppercase px-1 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-neutral-warm-400" />
          Seções Calculadas e Bloqueadas no seu Plano
        </h4>

        <div className="grid grid-cols-1 gap-3">
          {[
            { title: 'Roupinhas tamanho P, M, G', desc: 'Indicações de quantidade, materiais e tecidos ideais de P, M e G' },
            { title: 'Checklists Completos', desc: 'A lista inteira do enxoval em todas as categorias de higiene, passeio e quarto' },
            { title: 'Mala maternidade dividida', desc: 'Checklist exato para o bebê, para a mãe e acompanhante' },
            { title: 'Controle financeiro e Agenda', desc: 'Uma planilha automatizada e cronograma com as vacinas e exames' }
          ].map((locked, i) => (
            <div
              key={i}
              className="bg-neutral-warm-50/40 border border-neutral-warm-200/50 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden select-none shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="w-9 h-9 rounded-full bg-neutral-warm-100 flex items-center justify-center text-neutral-warm-400 shrink-0 border border-neutral-warm-200/40 shadow-inner">
                  <Lock className="w-4 h-4 text-neutral-warm-500" />
                </div>
                <div className="flex-1 pr-8">
                  <span className="text-xs font-bold text-neutral-warm-800 block blur-[1px]">
                    {locked.title}
                  </span>
                  <span className="text-[10px] text-neutral-warm-500 block leading-tight mt-0.5">
                    Seu planejamento já está pronto. Desbloqueie para visualizar.
                  </span>
                </div>
              </div>

              <span className="absolute right-4 text-[9px] font-mono tracking-wider font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-100 shadow-sm animate-pulse">
                BLOQUEADO 🔒
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5) VISÃO GERAL DO APLICATIVO */}
      <div className="space-y-6 pt-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] tracking-widest uppercase font-semibold text-brand-600 block font-mono">PLATAFORMA PREMIUM DESBLOQUEADA</span>
          <h2 className="font-serif text-3xl font-bold text-neutral-warm-900 tracking-tight leading-tight">
            ✨ Seu aplicativo completo já está pronto.
          </h2>
          <p className="text-xs text-neutral-warm-500 max-w-sm mx-auto leading-relaxed">
            Ao finalizar seu acesso você desbloqueia uma ferramenta completa para organizar toda a sua gestação.
          </p>
        </div>

        {/* Banner do aplicativo completo e personalizado */}
        <div className="w-full rounded-3xl overflow-hidden border border-neutral-warm-200/60 shadow-sm relative bg-neutral-warm-50">
          <img
            src="https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-20-de-jul.-de-2026-23_25_23.png"
            alt="Seu aplicativo completo e personalizado"
            className="w-full h-auto object-cover"
            referrerPolicy="no-referrer"
          />
        </div>



        {/* ONE card: 🔓 O que você desbloqueia hoje (grade 2x6) */}
        <div className="bg-white border border-neutral-warm-200 rounded-3xl p-6 text-left space-y-4 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] tracking-widest uppercase font-semibold text-brand-600 block font-mono">RECURSOS EXCLUSIVOS</span>
            <h3 className="font-serif text-lg font-bold text-neutral-warm-900 leading-tight">
              🔓 O que você desbloqueia hoje
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-y-3 gap-x-4 pt-1">
            {[
              "97 itens do enxoval",
              "Quantidades personalizadas",
              "Checklist Pré-natal",
              "Agenda",
              "Controle financeiro",
              "Mala maternidade",
              "Mala do bebê",
              "Mala acompanhante",
              "Bolsa passeio",
              "Organização por trimestre",
              "Espaço para anotações",
              "Atualizações vitalícias"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-4.5 h-4.5 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0 text-brand-600 shadow-sm">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span className="text-xs font-semibold text-neutral-warm-700 leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card premium escuro (Apple style) */}
        <div className="bg-neutral-warm-900 text-white rounded-3xl p-6 md:p-8 shadow-xl text-left space-y-6 relative overflow-hidden border border-brand-500/20">
          <div className="absolute top-0 right-0 w-36 h-36 bg-brand-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-1.5 relative z-10">
            <span className="text-[9px] tracking-widest uppercase font-semibold text-brand-300 block font-mono">ACESSO IMEDIATO</span>
            <h3 className="font-serif text-lg md:text-xl font-bold text-white leading-tight">
              💜 Hoje você está desbloqueando um aplicativo que vai acompanhar toda a sua gestação.
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 relative z-10 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <span className="text-xl shrink-0">🍼</span>
              <div>
                <span className="text-xs font-bold text-white block">97 itens organizados</span>
                <span className="text-[10px] text-neutral-warm-300 block mt-0.5">Enxoval personalizado por tamanhos</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl shrink-0">📋</span>
              <div>
                <span className="text-xs font-bold text-white block">Mais de 70 tarefas do pré-natal</span>
                <span className="text-[10px] text-neutral-warm-300 block mt-0.5">Cronograma de vacinas e exames</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl shrink-0">🧳</span>
              <div>
                <span className="text-xs font-bold text-white block">5 checklists completos</span>
                <span className="text-[10px] text-neutral-warm-300 block mt-0.5">Bebê, mãe e acompanhante</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl shrink-0">♾️</span>
              <div>
                <span className="text-xs font-bold text-white block">Acesso vitalício</span>
                <span className="text-[10px] text-neutral-warm-300 block mt-0.5">Sem mensalidades ou assinaturas</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-neutral-warm-300 flex flex-wrap gap-x-4 gap-y-1 relative z-10 font-mono">
            <span>✔ Pagamento único</span>
            <span>✔ Sem mensalidade</span>
            <span>✔ Sem assinatura</span>
            <span>✔ Atualizações gratuitas</span>
          </div>
        </div>
      </div>

      {/* 6) OFERTA */}
      <div 
        id="price-buy-container"
        className="bg-white border-2 border-brand-100 rounded-[32px] p-6 md:p-8 shadow-xl text-center space-y-6 relative overflow-hidden"
      >
        <div className="space-y-1">
          <h3 className="font-serif text-2xl font-bold text-neutral-warm-900 tracking-tight leading-tight">
            💎 Acesso Premium Vitalício
          </h3>
        </div>

        <div className="py-2">
          <div className="flex items-baseline justify-center gap-1.5">
            {currentPrice !== 37 && (
              <span className="text-sm font-semibold text-neutral-warm-400 line-through">R$ 37,00</span>
            )}
            <span className="text-4xl font-serif font-bold text-brand-700">R$ {currentPrice},00</span>
          </div>
          <p className="text-[11px] text-neutral-warm-500 mt-2 font-semibold">
            Pagamento único. Sem mensalidades. Garantia de 7 dias. Atualizações gratuitas. Acesso imediato.
          </p>
        </div>

        {/* Checklist of benefits */}
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 py-4 px-4 rounded-2xl bg-neutral-warm-50/50 border border-neutral-warm-100/80 text-left max-w-sm mx-auto">
          {[
            "Sem mensalidades",
            "Atualizações gratuitas",
            "Garantia de 7 dias",
            "Acesso imediato"
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-neutral-warm-700">
              <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="space-y-3 max-w-sm mx-auto">
          <motion.button
            id="cta-buy-access-button"
            onClick={(e) => handleCtaClick(e, currentPrice === 27 ? "https://pay.kiwify.com.br/KtkK89u" : "https://pay.kiwify.com.br/1j4MNX7")}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-6 rounded-2xl transition shadow-xl shadow-brand-600/15 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden"
          >
            <span>Quero liberar meu aplicativo completo 💜</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </motion.button>
          
          <span className="text-[10px] text-neutral-warm-500 font-medium block leading-relaxed">
            🔒 Esta condição é exclusiva deste diagnóstico. Ao sair desta página ela poderá não estar mais disponível.
          </span>
        </div>

        {/* Support & guarantee row */}
        <div className="pt-4 border-t border-neutral-warm-100 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 justify-center">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <div className="text-left">
              <span className="text-[9px] text-neutral-warm-800 font-bold block leading-tight">Garantia 7 Dias</span>
              <span className="text-[8px] text-neutral-warm-500 block">Satisfação ou reembolso</span>
            </div>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <MessageCircle className="w-4.5 h-4.5 text-brand-500 shrink-0" />
            <div className="text-left">
              <span className="text-[9px] text-neutral-warm-800 font-bold block leading-tight">Suporte Premium</span>
              <span className="text-[8px] text-neutral-warm-500 block">Dúvidas por e-mail</span>
            </div>
          </div>
        </div>
      </div>

      {/* PREMIUM EXIT POPUP */}
      <AnimatePresence>
        {isPopupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-hidden" id="exit-popup-overlay">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPopupOpen(false)}
              className="absolute inset-0 bg-neutral-warm-950/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-white border border-brand-100 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative z-10 text-center space-y-6"
            >
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
                  Não queremos que você saia sem o plano ideal para a chegada do seu bebê. Por termos identificado um potencial de economia de até <strong>R$ 800,00</strong> no seu diagnóstico, decidimos fazer algo inédito.
                </p>
                <p className="text-xs text-neutral-warm-600 leading-relaxed font-semibold">
                  Liberamos o seu Plano Completo + Planilhas e Bônus com o maior desconto histórico: de R$ 37,00 por apenas <strong>R$ 27,00</strong>. Evite gastos desnecessários e sinta a tranquilidade de estar 100% preparada.
                </p>
              </div>

              <div className="bg-brand-50/60 border border-brand-100 rounded-2xl py-3 px-4 max-w-max mx-auto">
                <span className="text-[9px] font-mono tracking-widest text-brand-700 block uppercase font-bold">OFERTA DE ÚLTIMA CHANCE</span>
                <div className="flex items-baseline justify-center gap-1.5 mt-0.5">
                  <span className="text-xs text-neutral-warm-400 line-through">R$ 37,00</span>
                  <span className="text-xl font-serif font-bold text-neutral-warm-900">R$ 27,00</span>
                </div>
              </div>

              <p className="text-[10px] text-rose-500 font-semibold leading-normal">
                Esta condição é válida somente agora.<br />
                Ao fechar esta janela ela poderá não estar mais disponível.
              </p>

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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-warm-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-white border border-brand-100 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative z-10 text-center space-y-6"
            >
              <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-7 h-7" />
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-2xl font-bold text-neutral-warm-900 leading-tight">
                  🎉 Parabéns!
                </h3>
                <p className="text-sm text-neutral-warm-600 leading-relaxed font-semibold">
                  Seu planejamento foi preparado com sucesso.
                </p>
                <p className="text-xs text-neutral-warm-500 leading-relaxed">
                  Reservamos seu acesso pelos próximos <span className="font-bold text-brand-700">15 minutos</span>. Conclua seu acesso agora para desbloquear todas as funcionalidades.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] text-neutral-warm-400 font-mono font-semibold">
                  <span>PREPARANDO ACESSO SEGURO...</span>
                  <span>{preCheckoutProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-warm-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-brand-600 rounded-full"
                    style={{ width: `${preCheckoutProgress}%` }}
                  />
                </div>
              </div>

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
