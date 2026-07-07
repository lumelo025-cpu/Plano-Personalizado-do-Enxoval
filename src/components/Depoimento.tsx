import { Quote, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface DepoimentoProps {
  onNext: () => void;
}

export default function Depoimento({ onNext }: DepoimentoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto w-full flex flex-col gap-6"
      id="depoimento-container"
    >
      <div className="bg-white border border-brand-100 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute -right-16 -top-16 w-36 h-36 bg-brand-50 rounded-full blur-2xl opacity-70 pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-36 h-36 bg-rose-50 rounded-full blur-2xl opacity-70 pointer-events-none" />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-brand-100/75 border border-brand-200/50 flex items-center justify-center">
              <Quote className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <span className="font-semibold text-neutral-warm-800 text-sm block">Mariana L.</span>
              <span className="text-[10px] text-neutral-warm-400 block font-mono">Fundadora & Mãe do Lorenzo</span>
            </div>
          </div>
          <Heart className="w-5 h-5 text-rose-400 fill-rose-100" />
        </div>

        <h3 className="font-serif text-xl md:text-2xl font-bold text-neutral-warm-900 leading-tight mb-5">
          💜 Quero compartilhar uma coisa com você...
        </h3>

        <div className="space-y-4 text-sm leading-relaxed text-neutral-warm-700 font-sans">
          <p>
            Quando descobri minha gravidez achei que bastava seguir uma lista pronta da internet.
          </p>
          <p>
            Logo percebi que cada site dizia uma coisa diferente. Acabei comprando itens que nunca usei e faltaram coisas essenciais bem no auge do inverno.
          </p>
          <p className="font-medium text-neutral-warm-900">
            Foi aí que entendi que cada gestação é única.
          </p>
          <p>
            O mês do nascimento, o clima da região, a frequência das lavagens, a rotina da família... <strong>Tudo influencia.</strong>
          </p>
          <p>
            Foi por isso que nasceu o <span className="font-serif italic text-brand-600 font-bold">Gestante Organizada</span>. Para que nenhuma mãe precise passar pela ansiedade de listas genéricas e palpites errados.
          </p>
        </div>

        {/* Elegant signature block */}
        <div className="mt-8 pt-6 border-t border-neutral-warm-100 flex items-center justify-between">
          <div className="font-serif italic text-brand-700/80 text-base select-none">
            Com carinho, Mari
          </div>
          <div className="text-[10px] bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full font-medium">
            Plano Gestante Organizada 2026
          </div>
        </div>
      </div>

      <motion.button
        type="button"
        id="depoimento-continue-button"
        whileTap={{ scale: 0.98 }}
        onClick={onNext}
        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3.5 px-6 rounded-2xl transition shadow-md shadow-brand-600/10 hover:shadow-lg hover:shadow-brand-600/20 text-sm flex items-center justify-center gap-2 cursor-pointer"
      >
        Continuar
      </motion.button>
    </motion.div>
  );
}
