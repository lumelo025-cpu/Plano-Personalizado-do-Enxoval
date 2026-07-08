import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { StepId } from '../types';

interface HeaderProps {
  currentStep: StepId;
  onBack: () => void;
  canGoBack: boolean;
  progressPercent: number;
}

const STEP_NUMBERS: Record<string, number> = {
  'trimester_q': 1,
  'trimester_msg': 1,
  'first_baby_q': 2,
  'first_baby_msg': 2,
  'edu_reality': 3,
  'due_date_q': 4,
  'due_date_msg': 4,
  'edu_intelligent_spending': 5,
  'state_q': 6,
  'state_msg': 6,
  'edu_climate_regional': 7,
  'twins_q': 8,
  'laundry_q': 9,
  'dryer_q': 10,
  'edu_size_waste': 11,
  'concern_q': 12,
  'concern_msg': 12,
  'started_buying_q': 13,
  'edu_buy_right': 14,
  'prenatal_organize_q': 15,
  'spending_control_q': 16,
  'baby_name_q': 17,
  'edu_planning_benefits': 18,
  'connection_msg': 19,
};

export default function Header({ currentStep, onBack, canGoBack, progressPercent }: HeaderProps) {
  // Hide header on landing, loading, diagnosis, and offer pages
  const isMinimal = ['welcome', 'processing', 'diagnosis', 'offer'].includes(currentStep);

  if (isMinimal) {
    return (
      <header className="py-6 px-6 flex justify-between items-center max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="text-xl font-serif font-semibold tracking-tight text-neutral-warm-900">
            Gestante <span className="text-brand-500 italic">Organizada</span>
          </span>
        </div>
        <div className="text-xs font-mono tracking-wider text-neutral-warm-500 uppercase">
          {currentStep === 'diagnosis' ? 'Análise de Gestação' : currentStep === 'offer' ? 'Planejamento Personalizado' : 'Plano Inteligente'}
        </div>
      </header>
    );
  }

  const stepNumber = STEP_NUMBERS[currentStep] || 1;
  const totalSteps = 19;
  const stepsRemaining = totalSteps - stepNumber;

  return (
    <header className="w-full bg-neutral-warm-50/80 backdrop-blur-md sticky top-0 z-40 border-b border-neutral-warm-100 transition-all duration-300">
      <div className="max-w-xl mx-auto px-6 py-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="w-10">
            {canGoBack && (
              <button
                onClick={onBack}
                id="header-back-button"
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-warm-600 hover:text-brand-600 hover:bg-neutral-warm-100 transition-colors cursor-pointer"
                aria-label="Voltar"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex flex-col items-center text-center">
            <span className="text-xs font-serif italic text-neutral-warm-800 font-medium">
              Passo {stepNumber} de {totalSteps} • {Math.round(progressPercent)}% concluído
            </span>
            <span className="text-[10px] text-brand-600 font-medium font-mono mt-0.5">
              {stepsRemaining > 0 
                ? `Faltam apenas ${stepsRemaining} ${stepsRemaining === 1 ? 'passo' : 'passos'} para finalizar` 
                : 'Última etapa do seu plano personalizado!'}
            </span>
          </div>
          
          <div className="w-10 text-right" />
        </div>

        {/* Minimalist Progress Track */}
        <div className="w-full h-1 bg-neutral-warm-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-300 to-brand-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          />
        </div>
      </div>
    </header>
  );
}
