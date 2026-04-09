import { useMemo } from 'react';
import { buildCalendarGrid, DAYS_OF_WEEK, isSameDay } from '../../utils/calendarUtils';
import DayCell from '../DayCell/DayCell';

const CalendarGrid = ({
  year,
  month,
  rangeStart,
  rangeEnd,
  onDayClick,
  noteDates,
  notes = [],
  selectedDate,
}) => {
  const weeks = buildCalendarGrid(year, month);

  const dateNotesMap = useMemo(() => {
    const map = {};
    notes.forEach((n) => {
      if (n.dateKey) {
        if (!map[n.dateKey]) map[n.dateKey] = [];
        map[n.dateKey].push(n);
      }
    });
    return map;
  }, [notes]);

  return (
    <div className="calendar-grid-wrapper">
      <div className="weekday-headers">
        {DAYS_OF_WEEK.map((day, idx) => (
          <div
            key={day}
            className={`weekday-header ${idx >= 5 ? 'weekend' : ''}`}
          >
            {day}
          </div>
        ))}
      </div>

      {weeks.map((week, weekIdx) => (
        <div key={weekIdx} className="week-row">
          {week.map((dayObj, dayIdx) => {
            const dateKey = `${dayObj.date.getFullYear()}-${dayObj.date.getMonth()}-${dayObj.date.getDate()}`;
            return (
              <DayCell
                key={`${weekIdx}-${dayIdx}`}
                dayObj={dayObj}
                monthIndex={month}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                onDayClick={onDayClick}
                hasNote={noteDates.has(dateKey)}
                stickyNotes={dateNotesMap[dateKey] || []}
                isSelected={selectedDate && isSameDay(dayObj.date, selectedDate)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default CalendarGrid;
