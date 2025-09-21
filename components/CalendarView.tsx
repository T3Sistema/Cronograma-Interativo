import React from 'react';
import { Holiday } from '../types';
import HolidayCard from './HolidayCard';

interface CalendarViewProps {
  monthKey: string; // "YYYY-MM"
  holidays: Holiday[];
  onDateClick: (date: string) => void;
  onOpenHolidayModal: (holiday: Holiday) => void;
}

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const CalendarView: React.FC<CalendarViewProps> = ({ monthKey, holidays, onDateClick, onOpenHolidayModal }) => {
  const [year, month] = monthKey.split('-').map(Number);
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  
  const holidaysMap = new Map(holidays.map(h => [h.date, h]));

  const calendarDays = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`blank-start-${i}`} className="p-2 h-28"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const holiday = holidaysMap.get(dateStr);
    
    if (holiday) {
      calendarDays.push(
        <HolidayCard
          key={dateStr}
          holiday={holiday}
          onOpenIdeasModal={onOpenHolidayModal}
          onDateClick={onDateClick}
        />
      );
    } else {
      const cellClasses = 'relative p-2 rounded-lg transition-colors duration-200 h-28 flex flex-col bg-slate-800 border border-slate-700/50';
      calendarDays.push(
        <div key={dateStr} className={cellClasses}>
          <span className="font-semibold text-slate-300">{day}</span>
        </div>
      );
    }
  }
  
  return (
    <div className="bg-slate-800/70 p-4 rounded-xl border border-slate-700">
        <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-400 font-bold mb-3">
            {WEEK_DAYS.map(day => <div key={day}>{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-2">
            {calendarDays}
        </div>
    </div>
  );
};

export default CalendarView;
