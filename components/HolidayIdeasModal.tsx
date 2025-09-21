import React, { useEffect } from 'react';
import { Holiday, HolidayIdeasCache } from '../types';
import LoadingSpinner from './LoadingSpinner';
import LightbulbIcon from './icons/LightbulbIcon';
import AlertTriangleIcon from './icons/AlertTriangleIcon';
import XIcon from './icons/XIcon';

interface HolidayIdeasModalProps {
  isOpen: boolean;
  onClose: () => void;
  holiday: Holiday | null;
  holidayIdeasCache: HolidayIdeasCache;
  onFetchHolidayIdeas: (date: string, name: string) => void;
}

const HolidayIdeasModal: React.FC<HolidayIdeasModalProps> = ({
  isOpen,
  onClose,
  holiday,
  holidayIdeasCache,
  onFetchHolidayIdeas,
}) => {
  
  useEffect(() => {
    // Fetch ideas when modal opens if they don't exist in cache
    if (isOpen && holiday && !holidayIdeasCache.has(holiday.date)) {
      onFetchHolidayIdeas(holiday.date, holiday.name);
    }
  }, [isOpen, holiday, holidayIdeasCache, onFetchHolidayIdeas]);

  if (!isOpen || !holiday) {
    return null;
  }

  const ideasData = holidayIdeasCache.get(holiday.date);

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="holiday-ideas-title"
    >
      <div
        className="w-full max-w-lg bg-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
          <div className="flex flex-col">
            <h2 id="holiday-ideas-title" className="text-xl font-bold text-teal-300">{holiday.name}</h2>
            <p className="text-sm text-slate-400">{new Date(holiday.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors" aria-label="Fechar">
            <XIcon className="w-5 h-5" />
          </button>
        </header>

        {/* Body */}
        <div className="p-6 min-h-[200px] flex items-center justify-center">
          {ideasData?.status === 'loading' && (
            <div className="flex flex-col items-center gap-2 text-slate-300">
                <LoadingSpinner className="h-8 w-8" />
                <span>Buscando ideias criativas...</span>
            </div>
          )}
          
          {ideasData?.status === 'error' && (
            <div className="text-red-400 text-center">
              <AlertTriangleIcon className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">Erro ao Gerar Ideias</p>
              <p className="text-sm">{ideasData.error}</p>
            </div>
          )}

          {ideasData?.status === 'success' && ideasData.data && (
            <div className="w-full">
              <ul className="space-y-4 text-left text-slate-200">
                {ideasData.data.map((idea, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <LightbulbIcon className="w-6 h-6 mt-0.5 flex-shrink-0 text-teal-400" />
                    <span className="text-base">{idea}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HolidayIdeasModal;
