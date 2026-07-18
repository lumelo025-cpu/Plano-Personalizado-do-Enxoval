import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LOADING_STEPS = [
  'Identificando estação do nascimento',
  'Calculando quantidade ideal de roupinhas',
  'Ajustando recomendações ao clima',
  'Identificando possíveis desperdícios',
  'Eliminando compras desnecessárias',
  'Organizando enxoval inteligente',
  'Preparando checklist do pré-natal',
  'Organizando mala maternidade',
  'Preparando agenda da gestação',
  'Configurando controle financeiro',
  'Finalizando seu planejamento'
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    // Exactly 5 seconds total (400ms * 11 steps = 4.4s, plus 600ms final timeout)
    const interval = setInterval(() => {
      setCompletedSteps(prev => [...prev, activeStepIndex]);
      
      if (activeStepIndex < LOADING_STEPS.length - 1) {
        setActiveStepIndex(prev => prev + 1);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 600);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [activeStepIndex, onComplete]);

  // Overall percentage
  const totalPercent = Math.min(
    Math.round(((completedSteps.length) / LOADING_STEPS.length) * 100),
    100
  );

  return (
    <div className="max-w-md mx-auto w-full flex flex-col items-center justify-center min-h-[450px] px-4" id="loading-screen-container">
      {/* Circle animation */}
      <div className="relative mb-8 flex items-center justify-center">
        {/* Soft pulse glow */}
        <div className="absolute w-24 h-24 bg-brand-100 rounded-full blur-xl animate-pulse opacity-60" />
        
        {/* Outer spinner */}
        <div className="w-20 h-20 rounded-full border-4 border-brand-100 border-t-brand-500 animate-spin" />
        
        {/* Inner percentage */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-serif font-bold text-neutral-warm-800">
            {totalPercent}%
          </span>
        </div>
      </div>

      <div className="text-center mb-8">
        <h3 className="font-serif text-xl font-bold text-neutral-warm-900 leading-tight mb-2">
          Análise Inteligente de Gestação
        </h3>
        <p className="text-xs text-neutral-warm-500 max-w-xs mx-auto">
          Nossa inteligência está correlacionando suas respostas para projetar seu plano sob medida.
        </p>
      </div>

      {/* Steps checklist with staggered transitions */}
      <div className="w-full bg-white border border-neutral-warm-100 rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
        {LOADING_STEPS.map((stepText, idx) => {
          const isCompleted = completedSteps.includes(idx);
          const isActive = idx === activeStepIndex;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 transition-opacity duration-300 ${
                isCompleted || isActive ? 'opacity-100' : 'opacity-40'
              }`}
            >
              {/* Indicator Icon */}
              <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div
                      key="checked"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </motion.div>
                  ) : isActive ? (
                    <motion.div
                      key="active"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-full bg-brand-50 border-2 border-brand-400 flex items-center justify-center"
                    >
                      <Loader2 className="w-3 h-3 text-brand-600 animate-spin" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="pending"
                      className="w-5 h-5 rounded-full bg-neutral-warm-100 border border-neutral-warm-200"
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Step label */}
              <span
                className={`text-xs ${
                  isCompleted
                    ? 'text-neutral-warm-600 line-through decoration-neutral-warm-300'
                    : isActive
                    ? 'text-brand-700 font-semibold'
                    : 'text-neutral-warm-500'
                }`}
              >
                {stepText}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
