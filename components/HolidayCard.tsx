import React from 'react';
import { Holiday } from '../types';
import LightbulbIcon from './icons/LightbulbIcon';

interface HolidayCardProps {
  holiday: Holiday;
  onOpenIdeasModal: (holiday: Holiday) => void;
  onDateClick: (date: string) => void;
}

const HolidayCard: React.FC<HolidayCardProps> = ({ holiday, onOpenIdeasModal, onDateClick }) => {
  const handleDateNavigation = (e: React.MouseEvent) => {
    e.stopPropagation(); // Previne a abertura do modal ao clicar apenas no nome
    onDateClick(holiday.date);
  };

  return (
    <button
      className="w-full h-28 bg-teal-900/50 border border-teal-700/60 rounded-lg p-2 flex flex-col text-left cursor-pointer hover:bg-teal-800/80 hover:border-teal-600 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
      onClick={() => onOpenIdeasModal(holiday)}
      aria-label={`Ver ideias de conteúdo para ${holiday.name}`}
    >
      <span className="font-semibold text-teal-300">{new Date(holiday.date + 'T00:00:00').getDate()}</span>
      <span
        className="text-xs text-teal-400 mt-1 leading-tight flex-grow hover:underline"
        onClick={handleDateNavigation}
        title={`Ver plano semanal para ${holiday.name}`}
      >
        {holiday.name}
      </span>
      <span className="text-right text-xs text-teal-500 font-mono flex items-center justify-end gap-1">
        <LightbulbIcon className="w-3 h-3"/>
        ideias
      </span>
    </button>
  );
};

export default HolidayCard;
