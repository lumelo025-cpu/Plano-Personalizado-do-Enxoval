import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Thermometer, Box, Sparkles, Check, Lock, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { FunnelState, EnxovalItem } from '../types';
import { getSeason, calculateWeeksRemaining, getClimateInfo, generatePersonalizedEnxoval } from '../data';

interface DiagnosisScreenProps {
  state: FunnelState;
  onNext: () => void;
}

export default function DiagnosisScreen({ state, onNext }: DiagnosisScreenProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Roupas Básicas');

  const season = getSeason(state.dueDate);
  const weeksRemaining = calculateWeeksRemaining(state.dueDate);
  const stateInfo = getClimateInfo(state.birthState);
  const calculatedItems = generatePersonalizedEnxoval(state);
  
  const totalItemsCount = calculatedItems.reduce((acc, item) => acc + item.calculatedQty, 0);

  // Group items by category
  const categories = Array.from(new Set(calculatedItems.map(item => item.category)));

  const formattedDueDate = state.dueDate
    ? new Date(state.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : 'Não definida';

  const babyTitle = state.babyName ? state.babyName.trim() : 'seu bebê';

  const toggleCategory = (cat: string) => {
    if (expandedCategory === cat) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(cat);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-xl mx-auto w-full flex flex-col gap-6 px-4 pb-12"
      id="diagnosis-screen-container"
    >
      {/* Title section */}
      <div className="text-center mt-2">
        <span className="text-xs font-semibold uppercase tracking-wider bg-brand-100 text-brand-700 px-3 py-1 rounded-full inline-block mb-3">
          Diagnóstico Concluído 💜
        </span>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-neutral-warm-900 leading-tight">
          Plano Personalizado para o enxoval de <span className="text-brand-600 font-serif italic">{babyTitle}</span>
        </h2>
        <p className="text-xs text-neutral-warm-500 mt-2 max-w-sm mx-auto">
          Analisamos as condições climáticas de {stateInfo.name} para a estação {season} e calibramos as quantidades conforme a rotina da sua família.
        </p>
      </div>

      {/* Main Stats Panel */}
      <div className="bg-white border border-neutral-warm-200/80 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-serif text-sm font-semibold text-neutral-warm-800 border-b border-neutral-warm-100 pb-2">
          Resumo da sua Análise
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-500 shrink-0 mt-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-warm-400 block font-mono">NASCIMENTO</span>
              <span className="text-xs font-semibold text-neutral-warm-800 block leading-tight">{formattedDueDate}</span>
              <span className="text-[10px] text-neutral-warm-500 block">{weeksRemaining} semanas restantes</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0 mt-0.5">
              <Thermometer className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-warm-400 block font-mono">ESTAÇÃO & CLIMA</span>
              <span className="text-xs font-semibold text-neutral-warm-800 block leading-tight">{season} em {state.birthState}</span>
              <span className="text-[10px] text-neutral-warm-500 block">{stateInfo.isCold ? 'Frio relevante' : 'Clima ameno'}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0 mt-0.5">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-warm-400 block font-mono">VOLUME RECOMENDADO</span>
              <span className="text-xs font-semibold text-neutral-warm-800 block leading-tight">{totalItemsCount} peças essenciais</span>
              <span className="text-[10px] text-neutral-warm-500 block">Adaptado para {state.isTwins ? 'gêmeos' : '1 bebê'}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-warm-400 block font-mono">LAVAGEM DE ROUPAS</span>
              <span className="text-xs font-semibold text-neutral-warm-800 block leading-tight">
                {state.laundryFrequency === 'daily' && 'Diária'}
                {state.laundryFrequency === 'every_2_days' && 'A cada 2 dias'}
                {state.laundryFrequency === 'few_times_week' && 'Infrequente'}
              </span>
              <span className="text-[10px] text-neutral-warm-500 block">Possui secadora: {state.hasDryer ? 'Sim' : 'Não'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compatibility Score */}
      <div className="bg-gradient-to-br from-brand-50 to-rose-50/50 border border-brand-100/60 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-neutral-warm-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-500" />
            Compatibilidade do seu enxoval atual
          </span>
          <span className="text-sm font-bold font-mono text-brand-700">87%</span>
        </div>
        
        {/* Animated meter bar */}
        <div className="w-full h-2.5 bg-neutral-warm-200 rounded-full overflow-hidden mb-3">
          <div className="h-full bg-gradient-to-r from-brand-400 via-brand-500 to-rose-400 rounded-full w-[87%]" />
        </div>

        <p className="text-xs text-neutral-warm-700 leading-relaxed">
          Encontramos alguns pontos importantes para que seu enxoval fique realmente adequado à realidade do seu bebê. Com base nas respostas, você pode ter desperdício comprando excesso de tamanhos RN ou faltar roupas de frio caso as lavagens acumulem.
        </p>
      </div>

      {/* Section 1: Unlocked customization plan (Real lists) */}
      <div className="space-y-3" id="unlocked-sections">
        <h4 className="text-xs font-mono font-semibold tracking-wider text-neutral-warm-500 uppercase px-1">
          ✓ Planejamento Liberado
        </h4>

        {/* Dynamic customized list */}
        <div className="bg-white border border-neutral-warm-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-neutral-warm-100/50 border-b border-neutral-warm-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-serif font-bold text-neutral-warm-800 block">Lista Estimada do Enxoval</span>
              <span className="text-[10px] text-neutral-warm-500 block">Focado exclusivamente em peças de vestuário e colo</span>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-brand-100 text-brand-700 rounded-full">
              Inteligente
            </span>
          </div>

          <div className="divide-y divide-neutral-warm-100">
            {categories.map(cat => {
              const isExpanded = expandedCategory === cat;
              const catItems = calculatedItems.filter(item => item.category === cat);
              const catCount = catItems.reduce((acc, item) => acc + item.calculatedQty, 0);

              return (
                <div key={cat} className="w-full">
                  <button
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className="w-full flex items-center justify-between p-4 hover:bg-neutral-warm-50 transition text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                      <span className="text-xs font-medium text-neutral-warm-800">{cat}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-neutral-warm-500 bg-neutral-warm-100 px-2 py-0.5 rounded-md">
                        {catCount} {catCount === 1 ? 'item' : 'itens'}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-warm-400" /> : <ChevronDown className="w-4 h-4 text-neutral-warm-400" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 pt-1 bg-neutral-warm-50/50 space-y-3">
                      {catItems.map((item, idx) => (
                        <div key={idx} className="bg-white border border-neutral-warm-100 rounded-xl p-3 shadow-sm">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-xs font-semibold text-neutral-warm-800">{item.name}</span>
                            <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-100 px-2.5 py-0.5 rounded-lg font-mono whitespace-nowrap">
                              Qtd: {item.calculatedQty}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-warm-500 leading-normal">
                            {item.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 2: Locked Sections (Blurs) */}
      <div className="space-y-3" id="locked-sections">
        <h4 className="text-xs font-mono font-semibold tracking-wider text-neutral-warm-500 uppercase px-1">
          🔒 Módulos Adicionais Reservados
        </h4>

        {[
          'Checklist completo do pré-natal',
          'Controle inteligente de gastos',
          'Agenda de exames e consultas',
          'Mala maternidade inteligente',
          'Links para compras com descontos'
        ].map((title, i) => (
          <div
            key={i}
            className="bg-white border border-neutral-warm-100 rounded-xl p-4 flex items-center justify-between relative overflow-hidden select-none"
          >
            {/* Soft blur overlay */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-warm-100 flex items-center justify-center text-neutral-warm-400 shrink-0">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-neutral-warm-700 blur-[1px]">
                {title}
              </span>
            </div>

            <span className="text-[10px] font-mono tracking-wider font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full relative z-20">
              RESERVADO
            </span>
          </div>
        ))}
      </div>

      {/* Call to action to see the actual app solution */}
      <motion.button
        type="button"
        id="diagnosis-see-plan-button"
        whileTap={{ scale: 0.98 }}
        onClick={onNext}
        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-4 px-6 rounded-2xl transition shadow-lg shadow-brand-600/10 hover:shadow-brand-600/20 text-sm flex items-center justify-center gap-2 mt-4 cursor-pointer"
      >
        Acessar Meu Plano Completo 💜
      </motion.button>
    </motion.div>
  );
}
