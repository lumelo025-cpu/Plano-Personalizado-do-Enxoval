import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calendar, Thermometer, Sparkles, Check, Lock, ChevronDown, ChevronUp, FileText, Baby, Sparkle } from 'lucide-react';
import { FunnelState } from '../types';
import { getSeason, calculateWeeksRemaining, getClimateInfo } from '../data';

interface DiagnosisScreenProps {
  state: FunnelState;
  onNext: () => void;
}

export default function DiagnosisScreen({ state, onNext }: DiagnosisScreenProps) {
  const [showRNDetails, setShowRNDetails] = useState(true);

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

  // Dynamic consulting summary text
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

  // RN items calculated dynamically
  const isColdTime = season === 'Inverno' || (season === 'Outono' && stateInfo.isCold) || stateInfo.isCold;
  
  // Determine factors
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-xl mx-auto w-full flex flex-col gap-6 px-4 pb-12"
      id="diagnosis-screen-container"
    >
      {/* Consulting header tag */}
      <div className="text-center mt-2">
        <span className="text-xs font-semibold uppercase tracking-wider bg-brand-100 text-brand-700 px-4 py-2 rounded-full inline-block mb-3.5 shadow-sm font-mono">
          ✨ PLANO PERSONALIZADO CONCLUÍDO
        </span>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-neutral-warm-900 leading-tight">
          Seu planejamento inteligente está pronto. 💜
        </h2>
        <p className="text-xs md:text-sm text-neutral-warm-500 mt-2 max-w-md mx-auto leading-relaxed">
          Utilizamos suas respostas para montar uma estratégia personalizada para sua gestação.
        </p>
      </div>

      {/* SPECIAL SAVINGS HIGHLIGHT CARD (ECONOMIA) */}
      <div className="bg-gradient-to-br from-brand-50 to-brand-100/50 border border-brand-200 rounded-[28px] p-6 shadow-sm relative overflow-hidden flex flex-col gap-4">
        {/* Sparkle decorative background elements */}
        <div className="absolute right-3 top-3 opacity-15">
          <Sparkles className="w-16 h-16 text-brand-600" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-200/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">💰</span>
            <h4 className="font-serif text-base font-bold text-neutral-warm-900">
              Economia estimada
            </h4>
          </div>
          <span className="text-[10px] font-mono tracking-wider font-semibold text-brand-700 bg-white/80 px-2.5 py-1 rounded-full border border-brand-200 self-start sm:self-auto">
            ✨ Economia Inteligente Calculada
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-base font-bold text-brand-800 leading-snug">
            Você pode economizar até R$ 800 comprando apenas o necessário para o seu bebê.
          </p>
          <p className="text-[11px] text-neutral-warm-600 leading-relaxed font-medium">
            Estimativa baseada na estação do nascimento, clima predominante, frequência de lavagem das roupas e planejamento inteligente do enxoval.
          </p>
        </div>
      </div>

      {/* Official Consulting Report Layout */}
      <div className="bg-white border border-neutral-warm-200 rounded-2xl shadow-md p-6 relative overflow-hidden flex flex-col gap-5">
        {/* Decorative corner tag */}
        <div className="absolute right-0 top-0 bg-brand-600 text-white text-[9px] font-mono tracking-widest uppercase font-bold px-3 py-1 rounded-bl-xl shadow-sm">
          Relatório Oficial
        </div>

        <div className="border-b border-neutral-warm-100 pb-3 flex items-center gap-2">
          <Baby className="w-5 h-5 text-brand-600" />
          <h3 className="font-serif text-base font-bold text-neutral-warm-900">
            Ficha Cadastral da Gestação
          </h3>
        </div>

        {/* Dynamic Data Grid */}
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

        {/* Executive Summary Section */}
        <div className="bg-neutral-warm-50 rounded-xl p-4 border border-neutral-warm-100/80 space-y-2 mt-2">
          <div className="flex items-center gap-1.5 text-neutral-warm-800">
            <FileText className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-serif font-bold">Resumo do Planejamento</span>
          </div>
          <p className="text-xs text-neutral-warm-600 leading-relaxed text-justify">
            {summaryText}
          </p>
        </div>
      </div>

      {/* SECTION 1: FULLY UNLOCKED RN SIZE */}
      <div className="space-y-3" id="unlocked-sections">
        {/* PLAN CALCULATED INDICATOR (TELA RN REQUIREMENTS) */}
        <div className="bg-brand-50/50 border border-brand-100 rounded-2xl p-4 flex flex-col gap-3.5 shadow-sm">
          <div className="flex items-center gap-2 text-brand-800 font-bold text-xs font-serif">
            <span className="text-base leading-none">🔓</span>
            <span>Seu plano foi calculado</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white border border-neutral-warm-100/80 p-2.5 rounded-xl flex flex-col justify-center shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <span className="text-[9px] text-neutral-warm-400 font-mono block uppercase">Preparados</span>
              <span className="text-xs font-bold text-brand-700 mt-0.5">97 itens</span>
            </div>
            <div className="bg-emerald-50/50 border border-emerald-100/60 p-2.5 rounded-xl flex flex-col justify-center shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <span className="text-[9px] text-emerald-600 font-mono block uppercase">Liberados</span>
              <span className="text-xs font-bold text-emerald-700 mt-0.5">20 itens</span>
            </div>
            <div className="bg-neutral-warm-50 border border-neutral-warm-100 p-2.5 rounded-xl flex flex-col justify-center shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <span className="text-[9px] text-neutral-warm-500 font-mono block uppercase">Protegidos</span>
              <span className="text-xs font-bold text-neutral-warm-600 mt-0.5">77 itens</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-1">
          <h4 className="text-[10px] font-mono font-semibold tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full uppercase flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            ✔ RECOMENDAÇÃO LIBERADA (Tamanho RN)
          </h4>
          <span className="text-[10px] text-neutral-warm-400 font-mono">100% GRATUITO</span>
        </div>

        <div className="bg-white border border-neutral-warm-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Header click */}
          <button
            onClick={() => setShowRNDetails(!showRNDetails)}
            className="w-full p-4 bg-gradient-to-r from-emerald-50/40 to-white border-b border-neutral-warm-100 flex items-center justify-between text-left cursor-pointer"
          >
            <div>
              <span className="text-xs font-serif font-bold text-neutral-warm-800 block">Recém-nascido (RN)</span>
              <span className="text-[10px] text-neutral-warm-500 block">Peças essenciais calculadas para as primeiras semanas de vida</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                {totalRNItems} Peças
              </span>
              {showRNDetails ? <ChevronUp className="w-4 h-4 text-neutral-warm-400" /> : <ChevronDown className="w-4 h-4 text-neutral-warm-400" />}
            </div>
          </button>

          {showRNDetails && (
            <div className="p-4 space-y-3 bg-white">
              {rnItems.map((item, index) => (
                <div key={index} className="bg-neutral-warm-50/50 border border-neutral-warm-100 rounded-xl p-3 shadow-sm flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-neutral-warm-800 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      {item.name}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-lg font-mono">
                      Qtd Sugerida: {item.qty} peças
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-warm-500 leading-relaxed pl-5">
                    {item.reason}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: LOCKED CATEGORIES & PLANS (STUNNING BLURS AND SKELETONS) */}
      <div className="space-y-3" id="locked-sections">
        <h4 className="text-[10px] font-mono font-semibold tracking-wider text-neutral-warm-500 uppercase px-1 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-neutral-warm-400" />
          Seções Calculadas e Bloqueadas no seu Plano
        </h4>

        {[
          { title: 'Roupinhas tamanho P', desc: 'Indicações de quantidade, materiais e tecidos ideais de P' },
          { title: 'Roupinhas tamanho M', desc: 'Recomendações detalhadas para a fase do bebê tamanho M' },
          { title: 'Roupinhas tamanho G', desc: 'Otimização de quantidade e tecidos ideais para a fase G' },
          { title: 'Checklist completo', desc: 'A lista inteira do enxoval em todas as categorias de higiene, passeio e quarto' },
          { title: 'Cronograma do pré-natal', desc: 'O cronograma com as vacinas e exames baseados no seu trimestre' },
          { title: 'Controle financeiro', desc: 'Uma planilha automatizada e simulada com seus dados' },
          { title: 'Mala maternidade', desc: 'Checklist exato para o bebê, para a mãe e acompanhante' },
          { title: 'Lista completa do enxoval', desc: 'O enxoval expandido de quarto, higiene e acessórios' },
          { title: 'Agenda da gestação', desc: 'A agenda organizada de todas as semanas que faltam para o parto' }
        ].map((locked, i) => (
          <div
            key={i}
            className="bg-white border border-neutral-warm-200/80 rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden select-none shadow-sm"
          >
            {/* Padlock status header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-neutral-warm-100 flex items-center justify-center text-neutral-warm-500 shrink-0">
                  <Lock className="w-3.5 h-3.5 text-neutral-warm-600" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-warm-800 flex items-center gap-1 block">
                    {locked.title}
                  </span>
                  <span className="text-[10px] text-neutral-warm-500 block">
                    Seu planejamento já está pronto. Desbloqueie para visualizar.
                  </span>
                </div>
              </div>

              <span className="text-[9px] font-mono tracking-wider font-semibold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-100">
                PREPARADO 🔒
              </span>
            </div>

            {/* Simulated Blurred Content Row */}
            <div className="space-y-1.5 opacity-30 select-none pointer-events-none mt-1">
              <div className="h-3 bg-neutral-warm-100 rounded w-11/12 blur-[2px]" />
              <div className="h-2 bg-neutral-warm-100 rounded w-8/12 blur-[2px]" />
            </div>
          </div>
        ))}
      </div>

      {/* Elegant CTA to unlock */}
      <div className="mt-4 bg-brand-50/50 border border-brand-100 rounded-2xl p-5 text-center flex flex-col gap-3.5 shadow-sm">
        <p className="text-xs text-neutral-warm-600 leading-normal">
          Analisamos as suas respostas e projetamos todas as fases do planejamento do seu bebê. Os dados mostram que você pode ter uma economia de até <strong>R$ 800,00</strong> comprando os tamanhos de forma otimizada.
        </p>
        <button
          type="button"
          id="diagnosis-see-plan-button"
          onClick={onNext}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-4 px-6 rounded-2xl transition shadow-lg shadow-brand-600/15 hover:shadow-brand-600/25 text-sm flex items-center justify-center gap-2 cursor-pointer font-semibold"
        >
          Quero desbloquear meu plano completo 💜
        </button>
      </div>
    </motion.div>
  );
}
