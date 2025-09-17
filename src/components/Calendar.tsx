import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarDay, Reservation } from '../types';
import { getCalendarDays, getReservationsForDate, MONTHS, DAYS_OF_WEEK } from '../utils';

interface CalendarProps {
  currentMonth: number;
  currentYear: number;
  reservations: Reservation[];
  selectedDate: Date | null;
  onMonthChange: (month: number, year: number) => void;
  onDateSelect: (date: Date) => void;
}

export function Calendar({
  currentMonth,
  currentYear,
  reservations,
  selectedDate,
  onMonthChange,
  onDateSelect
}: CalendarProps) {
  const days = getCalendarDays(currentYear, currentMonth);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      onMonthChange(11, currentYear - 1);
    } else {
      onMonthChange(currentMonth - 1, currentYear);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      onMonthChange(0, currentYear + 1);
    } else {
      onMonthChange(currentMonth + 1, currentYear);
    }
  };

  const getDayReservationCount = (day: CalendarDay): number => {
    return getReservationsForDate(reservations, day.date).length;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {MONTHS[currentMonth]} {currentYear}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="p-3 text-center text-sm font-semibold text-gray-500">
            {day.slice(0, 3)}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const reservationCount = getDayReservationCount(day);
          const isSelected = selectedDate?.toDateString() === day.date.toDateString();
          
          return (
            <button
              key={index}
              onClick={() => onDateSelect(day.date)}
              className={`
                p-3 text-center rounded-lg transition-all duration-200 hover:scale-105 relative
                ${day.isCurrentMonth 
                  ? 'text-gray-900 hover:bg-blue-50' 
                  : 'text-gray-400 hover:bg-gray-50'
                }
                ${day.isToday 
                  ? 'bg-blue-100 font-bold' 
                  : ''
                }
                ${isSelected 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : ''
                }
              `}
            >
              <span className="text-sm">{day.date.getDate()}</span>
              {reservationCount > 0 && (
                <div className={`
                  absolute bottom-1 right-1 w-2 h-2 rounded-full
                  ${isSelected ? 'bg-white' : 'bg-blue-500'}
                `} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}