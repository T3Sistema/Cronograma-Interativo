import React from 'react';
import { Schedule, Holiday } from '../types';
import MonthlyScheduleDisplay from './MonthlyScheduleDisplay';

interface ScheduleViewProps {
  schedule: Schedule;
  monthsToDisplay: string[];
  generationAttempted: boolean;
  onOpenHolidayModal: (holiday: Holiday) => void;
}

const months: { [key: string]: string } = {
  '01': 'Janeiro', '02': 'Fevereiro', '03': 'Março', '04': 'Abril',
  '05': 'Maio', '06': 'Junho', '07': 'Julho', '08': 'Agosto',
  '09': 'Setembro', '10': 'Outubro', '11': 'Novembro', '12': 'Dezembro'
};

const ScheduleView: React.FC<ScheduleViewProps> = ({ schedule, monthsToDisplay, generationAttempted, onOpenHolidayModal }) => {
  // Não exibe a seção do cronograma se nenhuma geração foi tentada
  if (!generationAttempted) {
    return (
      <div className="text-center py-16 px-6">
        <div className="max-w-md mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 mx-auto text-slate-600 mb-4"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
            <h3 className="text-xl font-semibold text-slate-300">Seu cronograma aparecerá aqui</h3>
            <p className="text-slate-400 mt-2">
                Primeiro, gere a análise de mercado. Em seguida, o botão para gerar o plano mensal aparecerá.
            </p>
        </div>
      </div>
    );
  }

  // Não exibe nada se a geração foi tentada, mas o mapa de schedule está vazio 
  // (ou seja, o usuário só gerou a análise, mas não clicou para gerar o plano)
  if (schedule.size === 0) {
    return null;
  }

  return (
    <div className="p-6 md:p-8 space-y-12">
      {monthsToDisplay.map((monthKey) => {
        const scheduleData = schedule.get(monthKey);
        const [year, monthNumber] = monthKey.split('-');
        const monthName = months[monthNumber];

        return (
            <div key={monthKey}>
            <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-teal-400 pl-4">{`${monthName} de ${year}`}</h2>
            <MonthlyScheduleDisplay 
              monthKey={monthKey}
              scheduleData={scheduleData}
              onOpenHolidayModal={onOpenHolidayModal}
            />
            </div>
        )
      })}
    </div>
  );
};

export default ScheduleView;
