export type Trimester = 'primeiro' | 'segundo' | 'terceiro';

export interface FunnelState {
  trimester: Trimester | null;
  isFirstBaby: boolean | null;
  dueDate: string; // YYYY-MM-DD
  birthState: string;
  isTwins: boolean;
  laundryFrequency: 'daily' | 'every_2_days' | 'few_times_week' | null;
  hasDryer: boolean | null;
  biggestConcern: string | null;
  startedBuying: 'not_yet' | 'some' | 'most' | null;
  organizePrenatal: 'yes' | 'medium' | 'not_yet' | null;
  controlSpending: 'yes' | 'some_idea' | 'no_idea' | null;
  babyName: string;
}

export type StepId =
  | 'welcome'                // FASE 1 - Tela 1
  | 'trimester_q'            // FASE 1 - Tela 2
  | 'trimester_msg'          // FASE 1 - Pos-trimester
  | 'first_baby_q'           // FASE 1 - Tela 3
  | 'first_baby_msg'         // FASE 1 - Pos-first_baby
  | 'edu_reality'            // EDU 1 (Você sabia? O maior erro...)
  | 'due_date_q'             // FASE 2 - Tela 4
  | 'due_date_msg'           // FASE 2 - Pos-due_date
  | 'edu_intelligent_spending' // EDU 2 (Um enxoval inteligente...)
  | 'state_q'                // FASE 2 - Tela 5
  | 'state_msg'              // FASE 2 - Pos-state
  | 'edu_climate_regional'   // EDU 3 (Você sabia? Julho no Sul...)
  | 'twins_q'                // FASE 2 - Tela 6
  | 'laundry_q'              // FASE 2 - Tela 7
  | 'dryer_q'                // FASE 2 - Tela 8
  | 'edu_size_waste'         // EDU 4 (Muitas famílias compram RN/P...)
  | 'concern_q'              // FASE 3 - Tela 12 (Pergunta emocional)
  | 'concern_msg'            // FASE 3 - Tela de acolhimento
  | 'started_buying_q'       // FASE 3 - Tela 13
  | 'edu_buy_right'          // EDU 5 (Comprar mais não significa...)
  | 'prenatal_organize_q'    // FASE 3 - Tela 14
  | 'spending_control_q'     // FASE 3 - Tela 15
  | 'baby_name_q'            // FASE 3 - Tela 16
  | 'edu_planning_benefits'  // EDU 6 (Um bom planejamento evita...)
  | 'connection_msg'         // FASE 4 - Tela 17 (Depoimento)
  | 'processing'             // FASE 5 - Tela 18 (Loading)
  | 'diagnosis'              // FASE 6 - Tela 19 (Diagnóstico)
  | 'offer';                 // FASE 7 - Tela 20 (Oferta)

export interface BrazilState {
  uf: string;
  nome: string;
  regiao: 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul';
  clima: 'quente' | 'temperado' | 'frio_sazonal';
}

export interface EnxovalItem {
  name: string;
  baseQty: number;
  calculatedQty: number;
  category: string;
  reason: string;
}
