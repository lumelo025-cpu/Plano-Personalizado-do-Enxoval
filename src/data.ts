import { BrazilState, EnxovalItem, FunnelState } from './types';

export const BRAZIL_STATES: BrazilState[] = [
  { uf: 'AC', nome: 'Acre', regiao: 'Norte', clima: 'quente' },
  { uf: 'AL', nome: 'Alagoas', regiao: 'Nordeste', clima: 'quente' },
  { uf: 'AP', nome: 'Amapá', regiao: 'Norte', clima: 'quente' },
  { uf: 'AM', nome: 'Amazonas', regiao: 'Norte', clima: 'quente' },
  { uf: 'BA', nome: 'Bahia', regiao: 'Nordeste', clima: 'quente' },
  { uf: 'CE', nome: 'Ceará', regiao: 'Nordeste', clima: 'quente' },
  { uf: 'DF', nome: 'Distrito Federal', regiao: 'Centro-Oeste', clima: 'temperado' },
  { uf: 'ES', nome: 'Espírito Santo', regiao: 'Sudeste', clima: 'temperado' },
  { uf: 'GO', nome: 'Goiás', regiao: 'Centro-Oeste', clima: 'temperado' },
  { uf: 'MA', nome: 'Maranhão', regiao: 'Nordeste', clima: 'quente' },
  { uf: 'MT', nome: 'Mato Grosso', regiao: 'Centro-Oeste', clima: 'quente' },
  { uf: 'MS', nome: 'Mato Grosso do Sul', regiao: 'Centro-Oeste', clima: 'temperado' },
  { uf: 'MG', nome: 'Minas Gerais', regiao: 'Sudeste', clima: 'temperado' },
  { uf: 'PA', nome: 'Pará', regiao: 'Norte', clima: 'quente' },
  { uf: 'PB', nome: 'Paraíba', regiao: 'Nordeste', clima: 'quente' },
  { uf: 'PR', nome: 'Paraná', regiao: 'Sul', clima: 'frio_sazonal' },
  { uf: 'PE', nome: 'Pernambuco', regiao: 'Nordeste', clima: 'quente' },
  { uf: 'PI', nome: 'Piauí', regiao: 'Nordeste', clima: 'quente' },
  { uf: 'RJ', nome: 'Rio de Janeiro', regiao: 'Sudeste', clima: 'temperado' },
  { uf: 'RN', nome: 'Rio Grande do Norte', regiao: 'Nordeste', clima: 'quente' },
  { uf: 'RS', nome: 'Rio Grande do Sul', regiao: 'Sul', clima: 'frio_sazonal' },
  { uf: 'RO', nome: 'Rondônia', regiao: 'Norte', clima: 'quente' },
  { uf: 'RR', nome: 'Roraima', regiao: 'Norte', clima: 'quente' },
  { uf: 'SC', nome: 'Santa Catarina', regiao: 'Sul', clima: 'frio_sazonal' },
  { uf: 'SP', nome: 'São Paulo', regiao: 'Sudeste', clima: 'temperado' },
  { uf: 'SE', nome: 'Sergipe', regiao: 'Nordeste', clima: 'quente' },
  { uf: 'TO', nome: 'Tocantins', regiao: 'Norte', clima: 'quente' }
];

export function getSeason(dateStr: string): 'Verão' | 'Outono' | 'Inverno' | 'Primavera' {
  if (!dateStr) return 'Primavera';
  const date = new Date(dateStr);
  const month = date.getUTCMonth(); // 0-indexed (0 is Jan, 11 is Dec)
  const day = date.getUTCDate();

  // Seasons in Southern Hemisphere (Brazil):
  // Outono: 20/03 to 20/06
  // Inverno: 21/06 to 21/09
  // Primavera: 22/09 to 20/12
  // Verão: 21/12 to 19/03

  const value = month * 100 + day;

  if (value >= 220 && value < 521) {
    return 'Outono';
  } else if (value >= 521 && value < 822) {
    return 'Inverno';
  } else if (value >= 822 && value < 1121) {
    return 'Primavera';
  } else {
    return 'Verão';
  }
}

export function calculateWeeksRemaining(dueDateStr: string): number {
  if (!dueDateStr) return 20;
  const today = new Date('2026-07-07'); // Set relative to prompt environment timestamp
  const due = new Date(dueDateStr);
  const diffTime = due.getTime() - today.getTime();
  if (diffTime <= 0) return 1;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const weeks = Math.ceil(diffDays / 7);
  return Math.min(Math.max(weeks, 1), 41);
}

export function getClimateInfo(stateUf: string): { name: string; climateDesc: string; isCold: boolean } {
  const state = BRAZIL_STATES.find(s => s.uf === stateUf);
  if (!state) return { name: 'Brasil', climateDesc: 'Clima diversificado', isCold: false };

  let desc = 'Clima majoritariamente quente e tropical';
  let isCold = false;

  if (state.clima === 'frio_sazonal') {
    desc = 'Clima subtropical, com invernos acentuados e frio sazonal importante';
    isCold = true;
  } else if (state.clima === 'temperado') {
    desc = 'Clima temperado ameno, com variações térmicas moderadas';
    isCold = false;
  }

  return { name: state.nome, climateDesc: desc, isCold };
}

export function generatePersonalizedEnxoval(state: FunnelState): EnxovalItem[] {
  const season = getSeason(state.dueDate);
  const stateInfo = getClimateInfo(state.birthState);

  // Determine multiplier factors
  let laundryMultiplier = 1.0;
  if (state.laundryFrequency === 'daily') {
    laundryMultiplier = 0.75; // washes daily, needs fewer spares
  } else if (state.laundryFrequency === 'few_times_week') {
    laundryMultiplier = 1.35; // washes infrequently, needs more spares
  }

  let dryerMultiplier = 1.0;
  if (state.hasDryer === true) {
    dryerMultiplier = 0.85; // can dry quickly, reduces reserve requirement
  }

  const twinsMultiplier = state.isTwins ? 1.85 : 1.0;

  // Combine general factors
  const factor = laundryMultiplier * dryerMultiplier * twinsMultiplier;

  // Let's adjust items based on Season + State Climate
  // Winters or seasonal colds mean we need more heavy sleeve coats and pants.
  // Summers or warm states mean we need more light bodysuits.
  const isColdTime = season === 'Inverno' || (season === 'Outono' && stateInfo.isCold) || stateInfo.isCold;

  const items: Omit<EnxovalItem, 'calculatedQty'>[] = [
    {
      name: 'Body Manga Curta (Tamanho P/M)',
      baseQty: isColdTime ? 6 : 10,
      category: 'Roupas Básicas',
      reason: isColdTime
        ? 'Utilizado principalmente como segunda pele por baixo de macacões em dias frios.'
        : 'A peça principal para o dia a dia no calor, mantendo o bebê fresco e confortável.'
    },
    {
      name: 'Body Manga Longa (Tamanho P/M)',
      baseQty: isColdTime ? 10 : 5,
      category: 'Roupas Básicas',
      reason: isColdTime
        ? 'Item de altíssima necessidade para proteger o bebê das baixas temperaturas.'
        : 'Essencial para noites mais frescas e ambientes com ar-condicionado.'
    },
    {
      name: 'Mijão / Culote (Calça com ou sem pé)',
      baseQty: isColdTime ? 10 : 6,
      category: 'Roupas Básicas',
      reason: 'Ideal para usar com os bodys básicos, trocando apenas quando sujar.'
    },
    {
      name: 'Macacão Manga Longa (Tamanho RN/P)',
      baseQty: isColdTime ? 8 : 4,
      category: 'Roupas de Passeio/Sono',
      reason: isColdTime
        ? 'Peça central do enxoval para manter o corpinho totalmente aquecido e protegido.'
        : 'Utilizado para saídas estratégicas e noites com temperaturas amenas.'
    },
    {
      name: 'Casaquinho de Algodão ou Soft',
      baseQty: isColdTime ? 4 : 2,
      category: 'Agasalhos',
      reason: 'Camada de proteção extra de fácil remoção para variações de temperatura.'
    },
    {
      name: 'Meias macias para recém-nascido',
      baseQty: isColdTime ? 6 : 4,
      category: 'Acessórios',
      reason: 'Bebês perdem calor muito rápido pelas extremidades (pés e mãos).'
    },
    {
      name: 'Touca de algodão',
      baseQty: isColdTime ? 3 : 1,
      category: 'Acessórios',
      reason: 'Importante nas primeiras semanas para manter a temperatura da cabecinha.'
    },
    {
      name: 'Paninho de Boca / Babitas',
      baseQty: 12,
      category: 'Higiene e Praticidade',
      reason: 'O item mais usado da maternidade. Serve para amamentação, golfadas e higiene rápida.'
    },
    {
      name: 'Manta de Linho ou Algodão',
      baseQty: isColdTime ? 4 : 2,
      category: 'Acessórios de Colo',
      reason: 'Multiuso para ninar, cobrir no carrinho ou proteger do vento leve.'
    },
    {
      name: 'Cueiro de Flanela',
      baseQty: isColdTime ? 4 : 3,
      category: 'Acessórios de Colo',
      reason: 'Ideal para a técnica do "charutinho", acalmando o recém-nascido nas primeiras semanas.'
    }
  ];

  return items.map(item => {
    const rawQty = Math.round(item.baseQty * factor);
    // Keep minimum values logical (at least 1 for accessories, at least 2 for bodys)
    let finalQty = rawQty;
    if (item.category === 'Roupas Básicas' && finalQty < 4) finalQty = 4;
    if (item.category === 'Acessórios' && finalQty < 2) finalQty = 2;
    if (item.category === 'Agasalhos' && finalQty < 1) finalQty = 1;
    if (item.category === 'Acessórios de Colo' && finalQty < 2) finalQty = 2;
    if (item.category === 'Higiene e Praticidade' && finalQty < 6) finalQty = 6;

    return {
      ...item,
      calculatedQty: finalQty
    };
  });
}
