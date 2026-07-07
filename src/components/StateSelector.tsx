import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { BRAZIL_STATES } from '../data';
import { BrazilState } from '../types';

interface StateSelectorProps {
  selectedStateUf: string;
  onSelect: (uf: string) => void;
}

export default function StateSelector({ selectedStateUf, onSelect }: StateSelectorProps) {
  const [search, setSearch] = useState('');

  const filteredStates = BRAZIL_STATES.filter(state =>
    state.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(search.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) ||
    state.uf.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-4" id="state-selector-container">
      {/* Elegant search input */}
      <div className="relative">
        <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-warm-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Pesquise seu estado..."
          id="state-search-input"
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-neutral-warm-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 rounded-2xl text-sm placeholder-neutral-warm-400 text-neutral-warm-800 transition outline-none"
        />
      </div>

      {/* States List */}
      <div className="max-h-[280px] overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-neutral-warm-200">
        {filteredStates.length > 0 ? (
          filteredStates.map((state: BrazilState) => {
            const isSelected = selectedStateUf === state.uf;
            return (
              <button
                key={state.uf}
                type="button"
                onClick={() => onSelect(state.uf)}
                className={`w-full text-left p-3.5 px-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-brand-50 border-brand-300 text-brand-900 shadow-sm'
                    : 'bg-white border-neutral-warm-100/80 text-neutral-warm-700 hover:border-neutral-warm-300 hover:bg-neutral-warm-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className={`w-4 h-4 shrink-0 ${isSelected ? 'text-brand-500' : 'text-neutral-warm-400'}`} />
                  <div>
                    <span className="font-medium text-sm block leading-tight">{state.nome}</span>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-warm-400">Região {state.regiao}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-mono font-semibold tracking-wider ${
                    isSelected ? 'bg-brand-100 text-brand-700' : 'bg-neutral-warm-100 text-neutral-warm-600'
                  }`}>
                    {state.uf}
                  </span>
                </div>
              </button>
            );
          })
        ) : (
          <div className="py-8 text-center text-xs text-neutral-warm-400">
            Nenhum estado encontrado para "{search}"
          </div>
        )}
      </div>
    </div>
  );
}
