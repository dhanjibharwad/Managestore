import React, { useState, useEffect } from 'react';

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  highlightedDates?: { date: Date; label?: string; color?: string }[];
  mode?: 'single' | 'range';
  selectedRange?: { start: Date | null; end: Date | null };
  onRangeSelect?: (range: { start: Date | null; end: Date | null }) => void;
  showToday?: boolean;
  showWeekNumbers?: boolean;
  className?: string;
  locale?: string;
  firstDayOfWeek?: 0 | 1; // 0 = Sunday, 1 = Monday
}

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
  disabledDates = [],
  highlightedDates = [],
  mode = 'single',
  selectedRange,
  onRangeSelect,
  showToday = true,
  showWeekNumbers = false,
  className = '',
  locale = 'en-US',
  firstDayOfWeek = 0,
}) => {
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1) : new Date()
  );
  const [rangeStart, setRangeStart] = useState<Date | null>(selectedRange?.start || null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(selectedRange?.end || null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');

  useEffect(() => {
    if (selectedRange) {
      setRangeStart(selectedRange.start);
      setRangeEnd(selectedRange.end);
    }
  }, [selectedRange]);

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDayOfWeek === 1 ? (day === 0 ? 6 : day - 1) : day;
  };

  const getWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const monthNames = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2000, i, 1);
    return date.toLocaleDateString('en-US', { month: 'long' });
  });

  const dayNames = Array.from({ length: 7 }, (_, i) => {
    const day = firstDayOfWeek === 1 ? (i + 1) % 7 : i;
    const date = new Date(2000, 0, 2 + day);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  });

  const generateCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }

    return days;
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (minDate && date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true;
    if (maxDate && date > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) return true;
    return disabledDates.some(disabledDate => isSameDay(date, disabledDate));
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    return isSameDay(selectedDate, new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
  };

  const isDateInRange = (day: number) => {
    if (!rangeStart || !rangeEnd) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date >= rangeStart && date <= rangeEnd;
  };

  const isDateRangeStart = (day: number) => {
    if (!rangeStart) return false;
    return isSameDay(rangeStart, new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
  };

  const isDateRangeEnd = (day: number) => {
    if (!rangeEnd) return false;
    return isSameDay(rangeEnd, new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
  };

  const isDateInHoverRange = (day: number) => {
    if (!rangeStart || !hoveredDate || rangeEnd) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const start = rangeStart < hoveredDate ? rangeStart : hoveredDate;
    const end = rangeStart < hoveredDate ? hoveredDate : rangeStart;
    return date >= start && date <= end;
  };

  const getHighlightedDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return highlightedDates.find(h => isSameDay(h.date, date));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return isSameDay(today, new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
  };

  const handleDateClick = (day: number) => {
    if (isDateDisabled(day)) return;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

    if (mode === 'range') {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        setRangeStart(date);
        setRangeEnd(null);
        onRangeSelect?.({ start: date, end: null });
      } else {
        if (date < rangeStart) {
          setRangeEnd(rangeStart);
          setRangeStart(date);
          onRangeSelect?.({ start: date, end: rangeStart });
        } else {
          setRangeEnd(date);
          onRangeSelect?.({ start: rangeStart, end: date });
        }
      }
    } else {
      onDateSelect(date);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
    setViewMode('days');
  };

  const handleYearSelect = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setViewMode('months');
  };

  const generateYears = () => {
    const currentYear = currentMonth.getFullYear();
    const years = [];
    for (let i = currentYear - 6; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  };

  const renderDaysView = () => (
    <>
      <div className={`grid ${showWeekNumbers ? 'grid-cols-8' : 'grid-cols-7'} gap-1 mb-2`}>
        {showWeekNumbers && <div className="text-center text-xs font-medium text-gray-400 py-2">Wk</div>}
        {dayNames.map((day, i) => (
          <div key={i} className="text-center text-sm font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className={`grid ${showWeekNumbers ? 'grid-cols-8' : 'grid-cols-7'} gap-1`}>
        {generateCalendarDays().map((day, index) => {
          const weekNum = showWeekNumbers && index % 7 === 0 && day ? getWeekNumber(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)) : null;
          const highlighted = day ? getHighlightedDate(day) : null;

          return (
            <React.Fragment key={index}>
              {showWeekNumbers && index % 7 === 0 && (
                <div className="flex items-center justify-center text-xs text-gray-400">
                  {weekNum}
                </div>
              )}
              <div className="aspect-square relative">
                {day ? (
                  <div className="relative w-full h-full">
                    <button
                      onClick={() => handleDateClick(day)}
                      onMouseEnter={() => mode === 'range' && setHoveredDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
                      onMouseLeave={() => mode === 'range' && setHoveredDate(null)}
                      disabled={isDateDisabled(day)}
                      className={`
                        w-full h-full rounded-lg text-sm font-medium transition-all relative z-10
                        ${isDateSelected(day) || isDateRangeStart(day) || isDateRangeEnd(day)
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : isDateInRange(day) || isDateInHoverRange(day)
                          ? 'bg-blue-100 text-blue-900'
                          : isToday(day) && showToday
                          ? 'bg-blue-50 text-blue-600 border-2 border-blue-600 hover:bg-blue-100'
                          : highlighted
                          ? `${highlighted.color || 'bg-green-100 text-green-800'} hover:opacity-80`
                          : 'hover:bg-gray-100 text-gray-700'
                        }
                        ${isDateDisabled(day)
                          ? 'opacity-40 cursor-not-allowed hover:bg-transparent'
                          : 'cursor-pointer'
                        }
                      `}
                      title={highlighted?.label}
                    >
                      {day}
                    </button>
                    {highlighted && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-current rounded-full z-20" />
                    )}
                  </div>
                ) : (
                  <div />
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </>
  );

  const renderMonthsView = () => (
    <div className="grid grid-cols-3 gap-3">
      {monthNames.map((month, index) => (
        <button
          key={index}
          onClick={() => handleMonthSelect(index)}
          className={`
            py-3 px-4 rounded-lg text-sm font-medium transition-all
            ${currentMonth.getMonth() === index
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-100 text-gray-700'
            }
          `}
        >
          {month}
        </button>
      ))}
    </div>
  );

  const renderYearsView = () => (
    <div className="grid grid-cols-3 gap-3">
      {generateYears().map((year) => (
        <button
          key={year}
          onClick={() => handleYearSelect(year)}
          className={`
            py-3 px-4 rounded-lg text-sm font-medium transition-all
            ${currentMonth.getFullYear() === year
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-100 text-gray-700'
            }
          `}
        >
          {year}
        </button>
      ))}
    </div>
  );

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 w-full max-w-md ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'months' ? 'days' : 'months')}
            className="text-lg font-semibold hover:bg-gray-100 px-3 py-1 rounded transition-colors"
          >
            {monthNames[currentMonth.getMonth()]}
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'years' ? 'days' : 'years')}
            className="text-lg font-semibold hover:bg-gray-100 px-3 py-1 rounded transition-colors"
          >
            {currentMonth.getFullYear()}
          </button>
        </div>

        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {viewMode === 'days' && renderDaysView()}
      {viewMode === 'months' && renderMonthsView()}
      {viewMode === 'years' && renderYearsView()}


    </div>
  );
};

export default Calendar;