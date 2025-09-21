import React from 'react';
import { ScheduleData, Holiday } from '../types';
import LoadingSpinner from './LoadingSpinner';
import WeeklyPlanCard from './WeeklyPlanCard';
import CalendarView from './CalendarView';

interface MonthlyScheduleDisplayProps {
  monthKey: string;
  scheduleData?: ScheduleData;
  onOpenHolidayModal: (holiday: Holiday) => void;
}

// Helper para descobrir em qual semana do mês uma data cai (1-5)
const getWeekOfMonth = (date: Date): number => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0=Sun, 1=Mon, ...
  const offsetDate = date.getDate() + firstDayOfWeek - 1;
  return Math.floor(offsetDate / 7) + 1;
}

const MonthlyScheduleDisplay: React.FC<MonthlyScheduleDisplayProps> = ({ monthKey, scheduleData, onOpenHolidayModal }) => {
  
  const handleDateClick = (dateStr: string) => {
    // dateStr is YYYY-MM-DD
    const clickedDate = new Date(dateStr + 'T00:00:00');
    const weekNumber = getWeekOfMonth(clickedDate);
    const targetId = `month-${monthKey}-week-${weekNumber}`;
    
    const element = document.getElementById(targetId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Adiciona um anel de destaque visual por 3 segundos
        element.classList.add('ring-2', 'ring-teal-400', 'ring-offset-4', 'ring-offset-slate-900');
        setTimeout(() => {
            element.classList.remove('ring-2', 'ring-teal-400', 'ring-offset-4', 'ring-offset-slate-900');
        }, 3000);
    }
  };

  if (!scheduleData || scheduleData.status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3 text-slate-400 bg-slate-800/50 rounded-xl">
        <LoadingSpinner className="h-8 w-8" />
        <span>Gerando plano estratégico para este mês...</span>
      </div>
    );
  }

  if (scheduleData.status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-red-400 bg-red-500/10 rounded-xl p-4">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 mb-2"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
        <span className="font-semibold text-lg">Erro ao gerar plano</span>
        <p className="text-sm text-center mt-1">{scheduleData.error || 'Não foi possível gerar as ideias para este mês.'}</p>
      </div>
    );
  }
  
  if (scheduleData.status === 'success' && scheduleData.data && scheduleData.holidays) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="lg:sticky lg:top-8">
                <CalendarView 
                    monthKey={monthKey}
                    holidays={scheduleData.holidays}
                    onDateClick={handleDateClick}
                    onOpenHolidayModal={onOpenHolidayModal}
                />
            </div>
            <div className="space-y-6">
                {scheduleData.data.weeks.map(weekPlan => (
                    <div 
                      id={`month-${monthKey}-week-${weekPlan.week}`} 
                      key={weekPlan.week} 
                      className="transition-all duration-300 rounded-xl"
                    >
                        <WeeklyPlanCard weekPlan={weekPlan} />
                    </div>
                ))}
            </div>
        </div>
    )
  }

  return null;
};

export default MonthlyScheduleDisplay;