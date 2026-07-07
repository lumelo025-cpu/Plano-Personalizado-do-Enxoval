import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getSeason, calculateWeeksRemaining } from '../data';

interface CalendarSelectorProps {
  selectedDate: string; // YYYY-MM-DD
  onSelect: (dateStr: string) => void;
}

export default function CalendarSelector({ selectedDate, onSelect }: CalendarSelectorProps) {
  // Parse initial state or default to current date + 6 months
  const defaultDate = new Date('2026-07-07');
  defaultDate.setMonth(defaultDate.getMonth() + 6);
  const initialDateStr = selectedDate || defaultDate.toISOString().split('T')[0];

  const [date, setDate] = useState<Date>(new Date(initialDateStr + 'T00:00:00'));
  const [currentYear, setCurrentYear] = useState<number>(date.getUTCFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(date.getUTCMonth());

  useEffect(() => {
    if (selectedDate) {
      const parsed = new Date(selectedDate + 'T00:00:00');
      setDate(parsed);
      setCurrentYear(parsed.getUTCFullYear());
      setCurrentMonth(parsed.getUTCMonth());
    }
  }, [selectedDate]);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  // Helper to get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper to get first day of month as index
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const paddedMonth = String(currentMonth + 1).padStart(2, '0');
    const paddedDay = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${paddedMonth}-${paddedDay}`;
    onSelect(dateStr);
  };

  const formattedSelectedDate = date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  });

  const selectedDateStr = date.toISOString().split('T')[0];
  const calculatedSeason = getSeason(selectedDateStr);
  const calculatedWeeks = calculateWeeksRemaining(selectedDateStr);
  const gestationalAge = 40 - calculatedWeeks;

  // Render dummy days for spacing
  const blankDays = Array.from({ length: firstDayIndex });
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="w-full flex flex-col gap-6" id="calendar-selector-container">
      {/* Calendar Grid */}
      <div className="bg-white border border-neutral-warm-200/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4 px-2">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1.5 rounded-full hover:bg-neutral-warm-100 text-neutral-warm-600 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <span className="font-serif font-semibold text-neutral-warm-800">
            {months[currentMonth]} de {currentYear}
          </span>
          
          <button
            type="button"
            onClick={nextMonth}
            className="p-1.5 rounded-full hover:bg-neutral-warm-100 text-neutral-warm-600 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {daysOfWeek.map((day, i) => (
            <span key={i} className="text-xs font-semibold text-neutral-warm-400 py-1">
              {day}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {blankDays.map((_, i) => (
            <div key={`blank-${i}`} className="aspect-square" />
          ))}
          {monthDays.map(day => {
            const isSelected =
              date.getUTCDate() === day &&
              date.getUTCMonth() === currentMonth &&
              date.getUTCFullYear() === currentYear;

            return (
              <button
                key={day}
                type="button"
                onClick={() => handleSelectDay(day)}
                className={`aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all relative ${
                  isSelected
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20 scale-105 font-bold z-10'
                    : 'text-neutral-warm-800 hover:bg-brand-50 hover:text-brand-700'
                }`}
              >
                {day}
                {isSelected && (
                  <motion.span
                    layoutId="selectedDayBubble"
                    className="absolute inset-0 border border-brand-300 rounded-xl pointer-events-none"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Summary Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDateStr}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-brand-50/50 border border-brand-100/60 rounded-2xl p-5 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2 text-brand-700 font-medium text-sm">
            <Sparkles className="w-4 h-4 text-brand-500 shrink-0" />
            <span>Previsão de Parto: <strong>{formattedSelectedDate}</strong></span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-1">
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-neutral-warm-100">
              <span className="text-xs text-neutral-warm-500 block">Estação Prevista</span>
              <span className="text-sm font-serif font-medium text-neutral-warm-800 flex items-center gap-1.5 mt-0.5">
                {calculatedSeason === 'Verão' && '☀️ Verão'}
                {calculatedSeason === 'Inverno' && '❄️ Inverno'}
                {calculatedSeason === 'Outono' && '🍁 Outono'}
                {calculatedSeason === 'Primavera' && '🌸 Primavera'}
              </span>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-neutral-warm-100">
              <span className="text-xs text-neutral-warm-500 block">Semanas Restantes</span>
              <span className="text-sm font-serif font-medium text-neutral-warm-800 mt-0.5 block">
                ~ {calculatedWeeks} {calculatedWeeks === 1 ? 'semana' : 'semanas'}
              </span>
            </div>
          </div>

          {gestationalAge > 0 && gestationalAge < 40 && (
            <p className="text-xs text-neutral-warm-600 leading-relaxed text-center mt-1">
              Hoje você estaria com aproximadamente <strong>{gestationalAge} semanas</strong> de gestação.
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
