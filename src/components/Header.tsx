import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { StepId } from '../types';

interface HeaderProps {
  currentStep: StepId;
  onBack: () => void;
  canGoBack: boolean;
  progressPercent: number;
}

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
          {currentStep === 'diagnosis' ? 'Diagnóstico Inteligente' : currentStep === 'offer' ? 'Plano Exclusivo' : 'Planejamento Premium'}
        </div>
      </header>
    );
  }

  return (
    <header className="w-full bg-neutral-warm-50/80 backdrop-blur-md sticky top-0 z-40 border-b border-neutral-warm-100 transition-all duration-300">
      <div className="max-w-xl mx-auto px-6 py-4 flex flex-col gap-3">
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
          
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            <span className="text-xs font-serif italic text-neutral-warm-700">Análise de Gestação Ativa</span>
          </div>
          
          <div className="w-10 text-right">
            <span className="text-xs font-mono text-neutral-warm-500 font-medium">
              {Math.round(progressPercent)}%
            </span>
          </div>
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
