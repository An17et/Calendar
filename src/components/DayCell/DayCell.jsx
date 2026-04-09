import { getHoliday } from '../../data/holidays';
import { isSameDay, isDateInRange, isToday } from '../../utils/calendarUtils';

const DayCell = ({
  dayObj,
  monthIndex,
  rangeStart,
  rangeEnd,
  onDayClick,
  hasNote,
  stickyNotes = [],
  isSelected,
}) => {
  const { day, currentMonth, date } = dayObj;

  const isCurrentDay = isToday(date);
  const isStart = isSameDay(date, rangeStart);
  const isEnd = isSameDay(date, rangeEnd);
  const inRange = rangeStart && rangeEnd && isDateInRange(date, rangeStart, rangeEnd);
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  const holiday = currentMonth ? getHoliday(monthIndex, day) : null;

  const classes = [
    'day-cell',
    !currentMonth && 'other-month',
    isCurrentDay && 'today',
    isWeekend && 'weekend',
    isStart && 'range-start',
    isEnd && 'range-end',
    inRange && !isStart && !isEnd && 'in-range',
    holiday && 'has-holiday',
    isSelected && 'selected-date',
    stickyNotes.length > 0 && 'has-stickies',
  ]
    .filter(Boolean)
    .join(' ');

  const maxStickies = Math.min(stickyNotes.length, 3);

  return (
    <div
      className={classes}
      onClick={() => onDayClick(date)}
      role="button"
      tabIndex={0}
      aria-label={`${day} ${currentMonth ? '' : '(adjacent month)'}${holiday ? ` — ${holiday.name}` : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onDayClick(date);
        }
      }}
    >
      <div className="day-cell-inner">
        {day}
      </div>

      {holiday && (
        <span className="holiday-dot" />
      )}

      {holiday && (
        <span className="holiday-badge" title={holiday.name}>
          {holiday.emoji}
          <span className="holiday-tooltip">{holiday.name}</span>
        </span>
      )}

      {hasNote && !stickyNotes.length && <span className="note-indicator" />}

      {maxStickies > 0 && (
        <div className="day-cell-stickies">
          {stickyNotes.slice(0, 3).map((note, idx) => (
            <div
              key={note.id}
              className="mini-sticky"
              style={{
                '--mini-rotation': `${(idx - 1) * 8 + (note.rotation || 0)}deg`,
                '--mini-index': idx,
                backgroundColor: note.color?.bg || '#FFF9C4',
                borderTopColor: note.color?.border || '#F9E547',
              }}
            />
          ))}
          {stickyNotes.length > 3 && (
            <span className="mini-sticky-count">+{stickyNotes.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default DayCell;
