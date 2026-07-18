import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Heart, ShieldCheck, Star, Sparkles, MessageSquare, Check, ArrowRight, Baby } from 'lucide-react';
import { FunnelState, StepId } from './types';
import Header from './components/Header';
import CalendarSelector from './components/CalendarSelector';
import StateSelector from './components/StateSelector';
import Depoimento from './components/Depoimento';
import LoadingScreen from './components/LoadingScreen';
import DiagnosisScreen from './components/DiagnosisScreen';
import OfferScreen from './components/OfferScreen';

const INITIAL_STATE: FunnelState = {
  trimester: null,
  isFirstBaby: null,
  dueDate: '2027-01-07', // default future date
  birthState: 'SP', // default São Paulo
  isTwins: false,
  laundryFrequency: null,
  hasDryer: null,
  biggestConcern: null,
  startedBuying: null,
  organizePrenatal: null,
  controlSpending: null,
  babyName: ''
};

// Map each StepId to progress percentage for visual bar
const PROGRESS_MAP: Record<StepId, number> = {
  welcome: 0,
  trimester_q: 5,
  trimester_msg: 10,
  first_baby_q: 15,
  first_baby_msg: 20,
  edu_reality: 24,
  due_date_q: 28,
  due_date_msg: 32,
  edu_intelligent_spending: 36,
  state_q: 40,
  state_msg: 44,
  edu_climate_regional: 48,
  twins_q: 52,
  laundry_q: 56,
  dryer_q: 60,
  edu_size_waste: 65,
  concern_q: 70,
  concern_msg: 74,
  started_buying_q: 78,
  edu_buy_right: 82,
  prenatal_organize_q: 86,
  spending_control_q: 90,
  baby_name_q: 94,
  edu_planning_benefits: 97,
  connection_msg: 99,
  processing: 100,
  diagnosis: 100,
  offer: 100
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<StepId>('welcome');
  const [history, setHistory] = useState<StepId[]>([]);
  const [state, setState] = useState<FunnelState>(INITIAL_STATE);

  // Helper to transition forward and record history
  const goTo = (nextStep: StepId) => {
    setHistory(prev => [...prev, currentStep]);
    setCurrentStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to go back using the history stack
  const handleBack = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setCurrentStep(previous);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateState = (updates: Partial<FunnelState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const progressPercent = useMemo(() => PROGRESS_MAP[currentStep] || 0, [currentStep]);
  const canGoBack = history.length > 0 && !['processing', 'diagnosis', 'offer'].includes(currentStep);

  // Generate dynamic contextual copy for welcome responses
  const trimesterMessage = useMemo(() => {
    if (state.trimester === 'primeiro') {
      return 'Excelente momento para começar a organizar tudo com calma. O primeiro trimestre é perfeito para planejar sem a pressão do tempo.';
    }
    if (state.trimester === 'segundo') {
      return 'A maioria das mães começa a montar o enxoval exatamente nessa fase. Você está no período ideal de disposição física!';
    }
    return 'Ainda dá tempo de organizar tudo sem correria. Vamos focar nos itens mais urgentes e fundamentais para a chegada do seu bebê.';
  }, [state.trimester]);

  const firstBabyMessage = useMemo(() => {
    if (state.isFirstBaby) {
      return 'É completamente normal sentir dúvidas e receios nessa fase. Há muita informação na internet e nós vamos simplificar tudo para você.';
    }
    return 'Cada gestação é única e traz novos aprendizados. Vamos adaptar todo o planejamento para essa nova realidade da família.';
  }, [state.isFirstBaby]);

  const dateMessage = useMemo(() => {
    const formattedDate = new Date(state.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long'
    });
    return (
      <div className="space-y-4">
        <p>
          Perfeito 💜 <br />
          Agora já sabemos que seu bebê deve chegar por volta de <strong>{formattedDate}</strong>.
        </p>
        <p className="text-neutral-warm-600">
          Isso será importantíssimo para calcular as quantidades ideais de roupas e adaptar seu enxoval para a estação do ano, garantindo que você compre apenas o que o bebê realmente usará.
        </p>
      </div>
    );
  }, [state.dueDate]);

  const stateMessage = useMemo(() => {
    return (
      <div className="space-y-4">
        <p>
          Entendido! Cada região possui um clima diferente.
        </p>
        <p className="text-neutral-warm-600">
          Nossa inteligência está ajustando as quantidades e os tecidos das roupinhas do seu enxoval conforme a realidade climática do seu estado.
        </p>
      </div>
    );
  }, [state.birthState]);

  // Live feedback message mapper
  const liveFeedbackMessage = useMemo(() => {
    if (['due_date_q', 'due_date_msg'].includes(currentStep)) {
      return "Estamos adaptando sua lista para a estação do nascimento.";
    }
    if (['state_q', 'state_msg'].includes(currentStep)) {
      return "Personalizando seu enxoval conforme sua região.";
    }
    if (['laundry_q', 'dryer_q'].includes(currentStep)) {
      return "Calculando quantidades mais adequadas para sua rotina.";
    }
    if (['concern_q', 'concern_msg', 'started_buying_q'].includes(currentStep)) {
      return "Identificando oportunidades para evitar desperdícios.";
    }
    if (['prenatal_organize_q', 'spending_control_q', 'baby_name_q'].includes(currentStep)) {
      return "Organizando tudo para reduzir compras desnecessárias.";
    }
    return null;
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-neutral-warm-50 flex flex-col font-sans select-none" id="main-app-layout">
      {/* Premium subtle header navigation */}
      <Header
        currentStep={currentStep}
        onBack={handleBack}
        canGoBack={canGoBack}
        progressPercent={progressPercent}
      />

      <main className="flex-1 flex flex-col items-center justify-center py-6 px-4 md:px-6 max-w-2xl mx-auto w-full">
        {liveFeedbackMessage && (
          <motion.div
            key={liveFeedbackMessage}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 bg-brand-50/85 border border-brand-100/70 px-4 py-2 rounded-full flex items-center justify-center gap-2 text-brand-700 text-xs font-semibold font-mono text-center max-w-md w-full shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-500 animate-pulse" />
            <span>{liveFeedbackMessage}</span>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          
          {/* FASE 1 - TELA 1 (Boas-vindas) */}
          {currentStep === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="text-center max-w-md w-full flex flex-col gap-6"
              id="step-welcome"
            >
              <div className="w-full h-48 md:h-56 rounded-2xl overflow-hidden shadow-sm border border-neutral-warm-100">
                <img
                  src="https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-9-de-jul.-de-2026-11_16_41.png"
                  alt="Gestante Feliz"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-neutral-warm-900 leading-tight">
                💜 Vamos criar um plano personalizado para a chegada do seu bebê.
              </h1>
              
              <p className="text-sm md:text-base text-neutral-warm-600 leading-relaxed">
                Em menos de 2 minutos vamos analisar sua gestação e mostrar exatamente o que faz sentido comprar, organizar e preparar para o seu bebê de forma inteligente.
              </p>

              <div className="mt-4 flex flex-col gap-3">
                <button
                  type="button"
                  id="welcome-start-button"
                  onClick={() => goTo('trimester_q')}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-4 px-6 rounded-2xl transition shadow-lg shadow-brand-600/15 text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  Quero montar meu plano
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-[10px] text-neutral-warm-400 font-mono">
                  ANÁLISE INTEGRAL • PRIVACIDADE ASSEGURADA
                </span>
              </div>
            </motion.div>
          )}

          {/* FASE 1 - TELA 2 (Pergunta Trimestre) */}
          {currentStep === 'trimester_q' && (
            <motion.div
              key="trimester_q"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-md flex flex-col gap-6"
              id="step-trimester-q"
            >
              <div className="w-full h-40 rounded-2xl overflow-hidden shadow-sm border border-neutral-warm-100">
                <img
                  src="https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-9-de-jul.-de-2026-11_07_38.png"
                  alt="Ultrassom"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider block font-mono">Fase 1 — Seu Momento</span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-neutral-warm-900 leading-tight">
                  Em que fase da gestação você está?
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {(['primeiro', 'segundo', 'terceiro'] as const).map(tri => (
                  <button
                    key={tri}
                    type="button"
                    onClick={() => {
                      updateState({ trimester: tri });
                      goTo('trimester_msg');
                    }}
                    className="w-full text-left p-4 rounded-2xl border border-neutral-warm-200/80 bg-white hover:border-brand-400 hover:bg-brand-50/30 transition-all font-medium text-sm text-neutral-warm-800 capitalize cursor-pointer shadow-sm flex items-center justify-between"
                  >
                    <span>{tri} trimestre</span>
                    <span className="text-xs text-neutral-warm-400 font-mono">
                      {tri === 'primeiro' && 'Semana 1 a 12'}
                      {tri === 'segundo' && 'Semana 13 a 27'}
                      {tri === 'terceiro' && 'Semana 28+'}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* FASE 1 - POS TRIMESTRE TELA (Mensagem acolhimento) */}
          {currentStep === 'trimester_msg' && (
            <motion.div
              key="trimester_msg"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="text-center max-w-md w-full flex flex-col gap-6"
              id="step-trimester-msg"
            >
              <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-2">
                <Heart className="w-5 h-5 fill-brand-200" />
              </div>
              <h3 className="font-serif text-xl md:text-2xl font-bold text-neutral-warm-900 leading-tight">
                {state.trimester === 'primeiro' && 'Um novo começo...'}
                {state.trimester === 'segundo' && 'O melhor período!'}
                {state.trimester === 'terceiro' && 'Reta final!'}
              </h3>
              <p className="text-sm md:text-base text-neutral-warm-600 leading-relaxed">
                {trimesterMessage}
              </p>
              <button
                type="button"
                id="trimester-msg-continue"
                onClick={() => goTo('first_baby_q')}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3.5 px-6 rounded-2xl transition shadow-md text-sm cursor-pointer"
              >
                Continuar
              </button>
            </motion.div>
          )}

          {/* FASE 1 - TELA 3 (Primeiro bebê) */}
          {currentStep === 'first_baby_q' && (
            <motion.div
              key="first_baby_q"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-md flex flex-col gap-6"
              id="step-first-baby-q"
            >
              <div className="w-full h-40 rounded-2xl overflow-hidden shadow-sm border border-neutral-warm-100">
                <img
                  src="https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-9-de-jul.-de-2026-11_09_48.png"
                  alt="Preparando o quartinho"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider block font-mono">Fase 1 — Experiência</span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-neutral-warm-900 leading-tight">
                  É seu primeiro bebê?
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    updateState({ isFirstBaby: true });
                    goTo('first_baby_msg');
                  }}
                  className="p-6 rounded-2xl border border-neutral-warm-200/80 bg-white hover:border-brand-400 hover:bg-brand-50/30 transition-all font-medium text-base text-neutral-warm-800 cursor-pointer shadow-sm flex flex-col items-center gap-3"
                >
                  <span className="text-2xl">🍼</span>
                  <span>Sim</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateState({ isFirstBaby: false });
                    goTo('first_baby_msg');
                  }}
                  className="p-6 rounded-2xl border border-neutral-warm-200/80 bg-white hover:border-brand-400 hover:bg-brand-50/30 transition-all font-medium text-base text-neutral-warm-800 cursor-pointer shadow-sm flex flex-col items-center gap-3"
                >
                  <span className="text-2xl">🧸</span>
                  <span>Não</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* FASE 1 - POS FIRST BABY MESSAGE */}
          {currentStep === 'first_baby_msg' && (
            <motion.div
              key="first_baby_msg"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="text-center max-w-md w-full flex flex-col gap-6"
              id="step-first-baby-msg"
            >
              <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-5 h-5 text-brand-500" />
              </div>
              <h3 className="font-serif text-xl md:text-2xl font-bold text-neutral-warm-900 leading-tight">
                {state.isFirstBaby ? 'Uma jornada mágica' : 'Novos capítulos'}
              </h3>
              <p className="text-sm md:text-base text-neutral-warm-600 leading-relaxed">
                {firstBabyMessage}
              </p>
              <button
                type="button"
                id="first-baby-msg-continue"
                onClick={() => goTo('edu_reality')}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3.5 px-6 rounded-2xl transition shadow-md text-sm cursor-pointer"
              >
                Continuar
              </button>
            </motion.div>
          )}

          {/* FASE 2 - TELA 4 (Data provável do parto) */}
          {currentStep === 'due_date_q' && (
            <motion.div
              key="due_date_q"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-md flex flex-col gap-6"
              id="step-due-date-q"
            >
              <div className="w-full h-40 rounded-2xl overflow-hidden shadow-sm border border-neutral-warm-100">
                <img
                  src="https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-9-de-jul.-de-2026-11_14_45.png"
                  alt="Bebê dormindo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider block font-mono">Fase 2 — Personalização</span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-neutral-warm-900 leading-tight">
                  Qual a data prevista do parto?
                </h2>
                <p className="text-xs text-neutral-warm-500 leading-relaxed">
                  Caso não saiba a data exata, escolha uma estimativa baseada no seu período menstrual ou primeiro ultrassom.
                </p>
              </div>

              {/* Custom interactive premium calendar */}
              <CalendarSelector
                selectedDate={state.dueDate}
                onSelect={(selectedDateStr) => {
                  updateState({ dueDate: selectedDateStr });
                }}
              />

              <button
                type="button"
                id="due-date-confirm-button"
                onClick={() => goTo('due_date_msg')}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3.5 px-6 rounded-2xl transition shadow-md text-sm cursor-pointer mt-2"
              >
                Confirmar data do parto
              </button>
            </motion.div>
          )}

          {/* FASE 2 - POS DUE DATE MESSAGE */}
          {currentStep === 'due_date_msg' && (
            <motion.div
              key="due_date_msg"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="text-center max-w-md w-full flex flex-col gap-6"
              id="step-due-date-msg"
            >
              <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-5 h-5 text-brand-500" />
              </div>
              <div className="text-sm md:text-base text-neutral-warm-800 leading-relaxed">
                {dateMessage}
              </div>
              <button
                type="button"
                id="due-date-msg-continue"
                onClick={() => goTo('edu_intelligent_spending')}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3.5 px-6 rounded-2xl transition shadow-md text-sm cursor-pointer"
              >
                Continuar
              </button>
            </motion.div>
          )}

          {/* FASE 2 - TELA 5 (Estado de nascimento) */}
          {currentStep === 'state_q' && (
            <motion.div
              key="state_q"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-md flex flex-col gap-6"
              id="step-state-q"
            >
              <div className="w-full h-40 rounded-2xl overflow-hidden shadow-sm border border-neutral-warm-100">
                <img
                  src="https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-17-de-jul.-de-2026-21_06_54.png"
                  alt="Detalhes do enxoval"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider block font-mono">Fase 2 — Região</span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-neutral-warm-900 leading-tight">
                  Em qual estado seu bebê vai nascer?
                </h2>
                <p className="text-xs text-neutral-warm-500 leading-relaxed">
                  O clima regional é determinante para as roupinhas que você deve providenciar.
                </p>
              </div>

              {/* Custom state search and select */}
              <StateSelector
                selectedStateUf={state.birthState}
                onSelect={(uf) => {
                  updateState({ birthState: uf });
                  goTo('state_msg');
                }}
              />
            </motion.div>
          )}

          {/* FASE 2 - POS STATE MESSAGE */}
          {currentStep === 'state_msg' && (
            <motion.div
              key="state_msg"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="text-center max-w-md w-full flex flex-col gap-6"
              id="step-state-msg"
            >
              <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-5 h-5 text-brand-500" />
              </div>
              <div className="text-sm md:text-base text-neutral-warm-800 leading-relaxed">
                {stateMessage}
              </div>
              <button
                type="button"
                id="state-msg-continue"
                onClick={() => goTo('edu_climate_regional')}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3.5 px-6 rounded-2xl transition shadow-md text-sm cursor-pointer"
              >
                Continuar
              </button>
            </motion.div>
          )}

          {/* FASE 2 - TELA 6 (Gêmeos ou um bebê) */}
          {currentStep === 'twins_q' && (
            <motion.div
              key="twins_q"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-md flex flex-col gap-6"
              id="step-twins-q"
            >
              <div className="w-full h-40 rounded-2xl overflow-hidden shadow-sm border border-neutral-warm-100">
                <img
                  src="https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-17-de-jul.-de-2026-21_08_33.png"
                  alt="Brinquedos infantis"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider block font-mono">Fase 2 — Quantidades</span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-neutral-warm-900 leading-tight">
                  Você está esperando:
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    updateState({ isTwins: false });
                    goTo('laundry_q');
                  }}
                  className="p-6 rounded-2xl border border-neutral-warm-200/80 bg-white hover:border-brand-400 hover:bg-brand-50/30 transition-all font-medium text-base text-neutral-warm-800 cursor-pointer shadow-sm flex flex-col items-center gap-3"
                >
                  <span className="text-2xl">👶</span>
                  <span>Um bebê</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateState({ isTwins: true });
                    goTo('laundry_q');
                  }}
                  className="p-6 rounded-2xl border border-neutral-warm-200/80 bg-white hover:border-brand-400 hover:bg-brand-50/30 transition-all font-medium text-base text-neutral-warm-800 cursor-pointer shadow-sm flex flex-col items-center gap-3"
                >
                  <span className="text-2xl">👶👶</span>
                  <span>Gêmeos</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* FASE 2 - TELA 7 (Frequência lavagem de roupas) */}
          {currentStep === 'laundry_q' && (
            <motion.div
              key="laundry_q"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-md flex flex-col gap-6"
              id="step-laundry-q"
            >
              <div className="w-full h-40 rounded-2xl overflow-hidden shadow-sm border border-neutral-warm-100">
                <img
                  src="https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-17-de-jul.-de-2026-21_09_23.png"
                  alt="Roupas de bebê organizadas"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider block font-mono">Fase 2 — Rotina</span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-neutral-warm-900 leading-tight">
                  Com que frequência você costuma lavar roupas?
                </h2>
                <p className="text-xs text-neutral-warm-500 leading-relaxed">
                  A frequência de lavagem afeta diretamente o cálculo de peças de reposição na gaveta.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { value: 'daily', label: 'Todos os dias', desc: 'Sempre há roupinhas limpas saindo' },
                  { value: 'every_2_days', label: 'A cada 2 dias', desc: 'Rotina equilibrada de lavanderia' },
                  { value: 'few_times_week', label: 'Apenas algumas vezes por semana', desc: 'Lavagens acumuladas para otimizar tempo' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      updateState({ laundryFrequency: opt.value as any });
                      goTo('dryer_q');
                    }}
                    className="w-full text-left p-4 rounded-2xl border border-neutral-warm-200/80 bg-white hover:border-brand-400 hover:bg-brand-50/30 transition-all font-medium text-sm text-neutral-warm-800 cursor-pointer shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <span className="font-semibold block">{opt.label}</span>
                      <span className="text-xs text-neutral-warm-400 font-normal mt-0.5 block">{opt.desc}</span>
                    </div>
                    <span className="text-neutral-warm-300">🧺</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* FASE 2 - TELA 8 (Secadora) */}
          {currentStep === 'dryer_q' && (
            <motion.div
              key="dryer_q"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-md flex flex-col gap-6"
              id="step-dryer-q"
            >
              <div className="w-full h-40 rounded-2xl overflow-hidden shadow-sm border border-neutral-warm-100">
                <img
                  src="https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-17-de-jul.-de-2026-21_10_57.png"
                  alt="Secadora e roupas macias"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider block font-mono">Fase 2 — Lavanderia</span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-neutral-warm-900 leading-tight">
                  Você possui secadora?
                </h2>
                <p className="text-xs text-neutral-warm-500 leading-relaxed">
                  A secadora acelera a velocidade com que as roupas voltam a ficar disponíveis para uso.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    updateState({ hasDryer: true });
                    goTo('edu_size_waste');
                  }}
                  className="p-6 rounded-2xl border border-neutral-warm-200/80 bg-white hover:border-brand-400 hover:bg-brand-50/30 transition-all font-medium text-base text-neutral-warm-800 cursor-pointer shadow-sm flex flex-col items-center gap-3"
                >
                  <span className="text-2xl">💨</span>
                  <span>Sim</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateState({ hasDryer: false });
                    goTo('edu_size_waste');
                  }}
                  className="p-6 rounded-2xl border border-neutral-warm-200/80 bg-white hover:border-brand-400 hover:bg-brand-50/30 transition-all font-medium text-base text-neutral-warm-800 cursor-pointer shadow-sm flex flex-col items-center gap-3"
                >
                  <span className="text-2xl">☀️</span>
                  <span>Não</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* EDU 1 (Você sabia? O maior erro...) */}
          {currentStep === 'edu_reality' && (
            <motion.div
              key="edu_reality"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="text-center max-w-md w-full flex flex-col gap-6"
              id="step-edu-reality"
            >
              <div className="w-full h-48 rounded-2xl overflow-hidden shadow-sm border border-neutral-warm-100 mb-2">
                <img
                  src="https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-17-de-jul.-de-2026-21_07_41.png"
                  alt="Gestante Feliz"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-serif text-2xl font-bold text-neutral-warm-900 leading-tight">
                💜 Você sabia?
              </h3>
              <div className="space-y-4 text-sm leading-relaxed text-neutral-warm-600">
                <p>
                  O maior erro na montagem do enxoval não é comprar pouco.
                </p>
                <p className="font-semibold text-neutral-warm-800 text-base">
                  É comprar sem considerar a realidade do seu bebê.
                </p>
              </div>
              <button
                type="button"
                id="edu-reality-continue"
                onClick={() => goTo('due_date_q')}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3.5 px-6 rounded-2xl transition shadow-md text-sm cursor-pointer"
              >
                Continuar
              </button>
            </motion.div>
          )}

          {/* EDU 2 (Um enxoval inteligente...) */}
          {currentStep === 'edu_intelligent_spending' && (
            <motion.div
              key="edu_intelligent_spending"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="text-center max-w-md w-full flex flex-col gap-6"
              id="step-edu-intelligent-spending"
            >
              <div className="w-full h-48 rounded-2xl overflow-hidden shadow-sm border border-neutral-warm-100 mb-2">
                <img
                  src="https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-17-de-jul.-de-2026-21_11_46.png"
                  alt="Controle financeiro"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-serif text-2xl font-bold text-neutral-warm-900 leading-tight">
                💜 Um enxoval inteligente não significa gastar mais.
              </h3>
              <div className="space-y-4 text-sm leading-relaxed text-neutral-warm-600">
                <p>
                  Significa comprar apenas aquilo que realmente será utilizado.
                </p>
                <p className="font-semibold text-neutral-warm-800">
                  Isso evita desperdícios e deixa você muito mais tranquila durante toda a gestação.
                </p>
              </div>
              <button
                type="button"
                id="edu-intelligent-spending-continue"
                onClick={() => goTo('state_q')}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3.5 px-6 rounded-2xl transition shadow-md text-sm cursor-pointer"
              >
                Continuar
              </button>
            </motion.div>
          )}

          {/* EDU 3 (Você sabia? Julho no Sul...) */}
          {currentStep === 'edu_climate_regional' && (
            <motion.div
              key="edu_climate_regional"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="text-center max-w-md w-full flex flex-col gap-6"
              id="step-edu-climate-regional"
            >
              <div className="w-full h-48 rounded-2xl overflow-hidden shadow-sm border border-neutral-warm-100 mb-2">
                <img
                  src="https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-17-de-jul.-de-2026-21_11_46.png"
                  alt="Roupas de bebê no cabide"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-serif text-2xl font-bold text-neutral-warm-900 leading-tight">
                Você sabia?
              </h3>
              <div className="space-y-4 text-sm leading-relaxed text-neutral-warm-600">
                <p>
                  Um bebê que nasce em julho no Sul pode precisar de um enxoval completamente diferente de um bebê que nasce em novembro no Nordeste.
                </p>
                <p className="font-semibold text-neutral-warm-800 text-base">
                  Por isso listas prontas raramente funcionam para todas as famílias.
                </p>
              </div>
              <button
                type="button"
                id="edu-climate-regional-continue"
                onClick={() => goTo('twins_q')}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3.5 px-6 rounded-2xl transition shadow-md text-sm cursor-pointer"
              >
                Continuar
              </button>
            </motion.div>
          )}

          {/* EDU 4 (Muitas famílias compram RN/P...) */}
          {currentStep === 'edu_size_waste' && (
            <motion.div
              key="edu_size_waste"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="text-center max-w-md w-full flex flex-col gap-6"
              id="step-edu-size-waste"
            >
              <div className="w-full h-48 rounded-2xl overflow-hidden shadow-sm border border-neutral-warm-100 mb-2">
                <img
                  src="https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-9-de-jul.-de-2026-11_13_07.png"
                  alt="Roupas de bebê organizadas"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-serif text-2xl font-bold text-neutral-warm-900 leading-tight">
                Você sabia?
              </h3>
              <div className="space-y-4 text-sm leading-relaxed text-neutral-warm-600">
                <p>
                  Muitas famílias compram roupas demais nos tamanhos RN e P.
                </p>
                <p className="font-semibold text-neutral-warm-800 text-base">
                  Quando percebem... O bebê cresceu antes mesmo de usar boa parte delas.
                </p>
              </div>
              <button
                type="button"
                id="edu-size-waste-continue"
                onClick={() => goTo('concern_q')}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3.5 px-6 rounded-2xl transition shadow-md text-sm cursor-pointer"
              >
                Continuar
              </button>
            </motion.div>
          )}

          {/* EDU 5 (Comprar mais não significa...) */}
          {currentStep === 'edu_buy_right' && (
            <motion.div
              key="edu_buy_right"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="text-center max-w-md w-full flex flex-col gap-6"
              id="step-edu-buy-right"
            >
              <div className="w-full h-48 rounded-2xl overflow-hidden shadow-sm border border-neutral-warm-100 mb-2">
                <img
                  src="https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-17-de-jul.-de-2026-21_17_57.png"
                  alt="Quarto do bebê"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-serif text-2xl font-bold text-neutral-warm-900 leading-tight">
                Comprar mais não significa estar mais preparada.
              </h3>
              <p className="font-semibold text-neutral-warm-800 text-base leading-relaxed">
                Comprar certo faz toda a diferença.
              </p>
              <button
                type="button"
                id="edu-buy-right-continue"
                onClick={() => goTo('prenatal_organize_q')}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3.5 px-6 rounded-2xl transition shadow-md text-sm cursor-pointer"
              >
                Continuar
              </button>
            </motion.div>
          )}

          {/* EDU 6 (Um bom planejamento evita...) */}
          {currentStep === 'edu_planning_benefits' && (
            <motion.div
              key="edu_planning_benefits"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-md w-full flex flex-col gap-6"
              id="step-edu-planning-benefits"
            >
              <div className="w-full h-48 rounded-2xl overflow-hidden shadow-sm border border-neutral-warm-100 mb-2">
                <img
                  src="https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-17-de-jul.-de-2026-21_31_35.png"
                  alt="Bebê dormindo calmo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-center">
                <h3 className="font-serif text-2xl font-bold text-neutral-warm-900 leading-tight">
                  💜 Um bom planejamento evita:
                </h3>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-neutral-warm-200/60 shadow-sm space-y-3">
                {[
                  'desperdícios',
                  'compras duplicadas',
                  'esquecer itens importantes',
                  'gastos desnecessários',
                  'estresse na reta final da gestação',
                  'dúvidas durante as compras'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-neutral-warm-700">
                    <span className="text-brand-500 font-bold mt-0.5">✔</span>
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                id="edu-planning-benefits-continue"
                onClick={() => goTo('connection_msg')}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3.5 px-6 rounded-2xl transition shadow-md text-sm cursor-pointer"
              >
                Continuar
              </button>
            </motion.div>
          )}

          {/* FASE 3 - TELA 12 (Pergunta Emocional Maior Preocupação) */}
          {currentStep === 'concern_q' && (
            <motion.div
              key="concern_q"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-md flex flex-col gap-6"
              id="step-concern-q"
            >
              <div className="w-full h-40 rounded-2xl overflow-hidden shadow-sm border border-neutral-warm-100">
                <img
                  src="https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-17-de-jul.-de-2026-21_12_40.png"
                  alt="Preocupação materna"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider block font-mono">Fase 3 — Emoções</span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-neutral-warm-900 leading-tight">
                  Qual é sua maior preocupação neste momento?
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  'Esquecer algum item importante',
                  'Gastar dinheiro com coisas desnecessárias',
                  'Não saber por onde começar',
                  'Organizar exames e consultas',
                  'Outra'
                ].map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      updateState({ biggestConcern: opt });
                      goTo('concern_msg');
                    }}
                    className="w-full text-left p-4 rounded-2xl border border-neutral-warm-200/80 bg-white hover:border-brand-400 hover:bg-brand-50/30 transition-all font-medium text-sm text-neutral-warm-800 cursor-pointer shadow-sm"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* FASE 3 - POS CONCERN SCREEN (Tela de Acolhimento) */}
          {currentStep === 'concern_msg' && (
            <motion.div
              key="concern_msg"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="text-center max-w-md w-full flex flex-col gap-6"
              id="step-concern-msg"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-2">
                <Heart className="w-5 h-5 fill-rose-200" />
              </div>
              <h3 className="font-serif text-xl md:text-2xl font-bold text-neutral-warm-900 leading-tight">
                Você não está sozinha 💜
              </h3>
              <div className="space-y-4 text-sm leading-relaxed text-neutral-warm-600">
                <p>
                  Independentemente da sua resposta, essa é uma das maiores preocupações das futuras mamães de todo o país.
                </p>
                <p className="font-medium text-neutral-warm-800">
                  É exatamente por isso que criamos esse planejamento personalizado, para que você sinta clareza absoluta e paz de espírito em cada etapa.
                </p>
              </div>
              <button
                type="button"
                id="concern-msg-continue"
                onClick={() => goTo('started_buying_q')}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3.5 px-6 rounded-2xl transition shadow-md text-sm cursor-pointer"
              >
                Continuar
              </button>
            </motion.div>
          )}

          {/* FASE 3 - TELA 13 (Começou a comprar enxoval?) */}
          {currentStep === 'started_buying_q' && (
            <motion.div
              key="started_buying_q"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-md flex flex-col gap-6"
              id="step-started-buying-q"
            >
              <div className="w-full h-40 rounded-2xl overflow-hidden shadow-sm border border-neutral-warm-100">
                <img
                  src="https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-17-de-jul.-de-2026-21_13_45.png"
                  alt="Preparativos enxoval"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider block font-mono">Fase 3 — Preparativos</span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-neutral-warm-900 leading-tight">
                  Você já começou a comprar itens do enxoval?
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { value: 'not_yet', label: 'Ainda não' },
                  { value: 'some', label: 'Comprei algumas coisas' },
                  { value: 'most', label: 'Já comprei boa parte' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      updateState({ startedBuying: opt.value as any });
                      goTo('edu_buy_right');
                    }}
                    className="w-full text-left p-4 rounded-2xl border border-neutral-warm-200/80 bg-white hover:border-brand-400 hover:bg-brand-50/30 transition-all font-medium text-sm text-neutral-warm-800 cursor-pointer shadow-sm"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* FASE 3 - TELA 14 (Organização compromissos pré-natal) */}
          {currentStep === 'prenatal_organize_q' && (
            <motion.div
              key="prenatal_organize_q"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-md flex flex-col gap-6"
              id="step-prenatal-organize-q"
            >
              <div className="w-full h-40 rounded-2xl overflow-hidden shadow-sm border border-neutral-warm-100">
                <img
                  src="https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-17-de-jul.-de-2026-21_23_01.png"
                  alt="Pré-natal planejado"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider block font-mono">Fase 3 — Pré-Natal</span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-neutral-warm-900 leading-tight">
                  Você costuma organizar seus compromissos do pré-natal?
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { value: 'yes', label: 'Sim', desc: 'Tenho uma rotina bem definida' },
                  { value: 'medium', label: 'Mais ou menos', desc: 'Esqueço uma data ou outra ocasionalmente' },
                  { value: 'not_yet', label: 'Ainda não', desc: 'Sinto que preciso de um guia estruturado' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      updateState({ organizePrenatal: opt.value as any });
                      goTo('spending_control_q');
                    }}
                    className="w-full text-left p-4 rounded-2xl border border-neutral-warm-200/80 bg-white hover:border-brand-400 hover:bg-brand-50/30 transition-all font-medium text-sm text-neutral-warm-800 cursor-pointer shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <span className="font-semibold block">{opt.label}</span>
                      <span className="text-xs text-neutral-warm-400 font-normal mt-0.5 block">{opt.desc}</span>
                    </div>
                    <span className="text-neutral-warm-300">📅</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* FASE 3 - TELA 15 (Controle financeiro) */}
          {currentStep === 'spending_control_q' && (
            <motion.div
              key="spending_control_q"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-md flex flex-col gap-6"
              id="step-spending-control-q"
            >
              <div className="w-full h-40 rounded-2xl overflow-hidden shadow-sm border border-neutral-warm-100">
                <img
                  src="https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-17-de-jul.-de-2026-21_27_10.png"
                  alt="Controle financeiro"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider block font-mono">Fase 3 — Finanças</span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-neutral-warm-900 leading-tight">
                  Você controla quanto já investiu na gestação?
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { value: 'yes', label: 'Sim', desc: 'Registro tudo detalhadamente' },
                  { value: 'some_idea', label: 'Tenho uma ideia', desc: 'Sei por cima os valores das grandes compras' },
                  { value: 'no_idea', label: 'Não faço ideia', desc: 'Não anoto nada e sinto certa insegurança' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      updateState({ controlSpending: opt.value as any });
                      goTo('baby_name_q');
                    }}
                    className="w-full text-left p-4 rounded-2xl border border-neutral-warm-200/80 bg-white hover:border-brand-400 hover:bg-brand-50/30 transition-all font-medium text-sm text-neutral-warm-800 cursor-pointer shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <span className="font-semibold block">{opt.label}</span>
                      <span className="text-xs text-neutral-warm-400 font-normal mt-0.5 block">{opt.desc}</span>
                    </div>
                    <span className="text-neutral-warm-300">💰</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* FASE 3 - TELA 16 (Nome do bebê - Opcional) */}
          {currentStep === 'baby_name_q' && (
            <motion.div
              key="baby_name_q"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-md flex flex-col gap-6"
              id="step-baby-name-q"
            >
              <div className="w-full h-40 rounded-2xl overflow-hidden shadow-sm border border-neutral-warm-100">
                <img
                  src="https://site.maecompleta.com/wp-content/uploads/2026/07/ChatGPT-Image-17-de-jul.-de-2026-21_29_36.png"
                  alt="Nome do bebê"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider block font-mono">Fase 3 — Identidade</span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-neutral-warm-900 leading-tight">
                  Você já escolheu o nome do bebê?
                </h2>
                <p className="text-xs text-neutral-warm-500">
                  Insira o nome para personalizarmos o diagnóstico oficial. Se não decidiu, pule esta etapa.
                </p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={state.babyName}
                  onChange={e => updateState({ babyName: e.target.value })}
                  placeholder="Nome do bebê (opcional)"
                  id="baby-name-input"
                  className="w-full px-4 py-4 bg-white border border-neutral-warm-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 rounded-2xl text-sm placeholder-neutral-warm-400 text-neutral-warm-800 transition outline-none"
                />

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    id="baby-name-submit"
                    onClick={() => goTo('edu_planning_benefits')}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3.5 px-6 rounded-2xl transition shadow-md text-sm cursor-pointer"
                  >
                    Continuar
                  </button>
                  
                  <button
                    type="button"
                    id="baby-name-skip"
                    onClick={() => {
                      updateState({ babyName: '' });
                      goTo('edu_planning_benefits');
                    }}
                    className="w-full text-center text-xs text-neutral-warm-500 hover:text-brand-600 py-2 font-medium cursor-pointer"
                  >
                    Ainda não decidimos / Pular etapa
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* FASE 4 - TELA 17 (Depoimento de conexão) */}
          {currentStep === 'connection_msg' && (
            <Depoimento onNext={() => goTo('processing')} />
          )}

          {/* FASE 5 - TELA 18 (Loading Screen) */}
          {currentStep === 'processing' && (
            <LoadingScreen onComplete={() => goTo('diagnosis')} />
          )}

          {/* FASE 6 - TELA 19 (O Diagnóstico inteligente) */}
          {currentStep === 'diagnosis' && (
            <DiagnosisScreen state={state} onNext={() => goTo('offer')} />
          )}

          {/* FASE 7 - TELA 20 (A Oferta) */}
          {currentStep === 'offer' && (
            <OfferScreen babyName={state.babyName} />
          )}

        </AnimatePresence>
      </main>

      {/* Persistent cozy footer */}
      <footer className="py-8 bg-neutral-warm-50 text-center border-t border-neutral-warm-100">
        <div className="max-w-md mx-auto px-6 space-y-2 text-[10px] text-neutral-warm-400 font-mono tracking-wider">
          <p>© 2026 GESTANTE ORGANIZADA • TODOS OS DIREITOS RESERVADOS</p>
          <p>Experiência Exclusiva de Diagnóstico e Planejamento</p>
        </div>
      </footer>
    </div>
  );
}
