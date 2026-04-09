import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import themes from './data/themes';
import { MONTH_NAMES, formatDate, daysBetween, isSameDay } from './utils/calendarUtils';
import { loadNotes, saveNotes, generateNoteId, getRandomStickyColor } from './utils/storageUtils';

import SpiralBinding from './components/SpiralBinding/SpiralBinding';
import HeroImage from './components/HeroImage/HeroImage';
import MonthNavigator from './components/MonthNavigator/MonthNavigator';
import CalendarGrid from './components/CalendarGrid/CalendarGrid';
import NotesPanel from './components/NotesPanel/NotesPanel';
import ThemeParticles from './components/ThemeParticles/ThemeParticles';

function App() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const [displayMonth, setDisplayMonth] = useState(today.getMonth());
  const [displayYear, setDisplayYear] = useState(today.getFullYear());
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState(null);
  const [showNewPage, setShowNewPage] = useState(false);
  const flipTimeoutRef = useRef(null);

  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [selectionStep, setSelectionStep] = useState(0);

  const [selectedDate, setSelectedDate] = useState(null);

  const [notes, setNotes] = useState(() => loadNotes());
  const [mobileNotesVisible, setMobileNotesVisible] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const hour = new Date().getHours();
    return hour < 6 || hour >= 18;
  });
  const [isWiping, setIsWiping] = useState(false);
  const [wipeStyle, setWipeStyle] = useState({});
  const toggleBtnRef = useRef(null);

  const [notesPanelKey, setNotesPanelKey] = useState(`${today.getMonth()}-${today.getFullYear()}`);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const theme = themes[displayMonth];
  const nextTheme = themes[currentMonth];

  useEffect(() => {
    if (!isFlipping) {
      const root = document.documentElement;
      root.style.setProperty('--accent', theme.accent);
      root.style.setProperty('--accent-light', theme.accentLight);
      root.style.setProperty('--accent-dark', theme.accentDark);
      root.style.setProperty('--gradient', theme.gradient);
      root.style.setProperty('--hero-gradient', theme.heroGradient);

      if (isDarkMode) {
        root.style.setProperty('--bg-tint', theme.bgTintDark);
        document.body.style.backgroundColor = theme.bgTintDark;
      } else {
        root.style.setProperty('--bg-tint', theme.bgTint);
        document.body.style.backgroundColor = theme.bgTint;
      }
    }
  }, [theme, isFlipping, isDarkMode]);

  useEffect(() => {
    return () => {
      if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);
    };
  }, []);

  const getNextMonthYear = (month, year, direction) => {
    let newMonth = month + direction;
    let newYear = year;
    if (newMonth > 11) { newMonth = 0; newYear++; }
    if (newMonth < 0) { newMonth = 11; newYear--; }
    return { month: newMonth, year: newYear };
  };

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    root.style.setProperty('--accent', newTheme.accent);
    root.style.setProperty('--accent-light', newTheme.accentLight);
    root.style.setProperty('--accent-dark', newTheme.accentDark);
    root.style.setProperty('--gradient', newTheme.gradient);
    root.style.setProperty('--hero-gradient', newTheme.heroGradient);

    if (isDarkMode) {
      root.style.setProperty('--bg-tint', newTheme.bgTintDark);
      document.body.style.backgroundColor = newTheme.bgTintDark;
    } else {
      root.style.setProperty('--bg-tint', newTheme.bgTint);
      document.body.style.backgroundColor = newTheme.bgTint;
    }
  };

  const navigateMonth = useCallback((direction) => {
    if (isFlipping) return;

    const next = getNextMonthYear(displayMonth, displayYear, direction);

    setCurrentMonth(next.month);
    setCurrentYear(next.year);
    setFlipDirection(direction > 0 ? 'forward' : 'backward');
    setIsFlipping(true);
    setShowNewPage(false);
    setSelectedDate(null);

    flipTimeoutRef.current = setTimeout(() => {
      setShowNewPage(true);
    }, 300);

    flipTimeoutRef.current = setTimeout(() => {
      setDisplayMonth(next.month);
      setDisplayYear(next.year);
      setIsFlipping(false);
      setFlipDirection(null);
      setShowNewPage(false);
      setNotesPanelKey(`${next.month}-${next.year}`);

      applyTheme(themes[next.month]);
    }, 800);
  }, [isFlipping, displayMonth, displayYear, isDarkMode]);

  const goToToday = useCallback(() => {
    const now = new Date();
    if (now.getMonth() === displayMonth && now.getFullYear() === displayYear) return;

    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
    setDisplayMonth(now.getMonth());
    setDisplayYear(now.getFullYear());
    setSelectedDate(null);
    setNotesPanelKey(`${now.getMonth()}-${now.getFullYear()}`);

    applyTheme(themes[now.getMonth()]);
  }, [displayMonth, displayYear, isDarkMode]);

  const handleDarkModeToggle = useCallback(() => {
    const btn = toggleBtnRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      const maxDist = Math.sqrt(
        Math.max(x, window.innerWidth - x) ** 2 +
        Math.max(y, window.innerHeight - y) ** 2
      );

      setWipeStyle({
        '--wipe-x': `${x}px`,
        '--wipe-y': `${y}px`,
        '--wipe-size': `${maxDist}px`,
      });
    }

    setIsWiping(true);
    setTimeout(() => {
      setIsDarkMode((prev) => !prev);
    }, 150);
    setTimeout(() => {
      setIsWiping(false);
    }, 1100);
  }, []);

  const handleDayClick = useCallback((date) => {
    if (selectedDate && isSameDay(date, selectedDate)) {
      const dateLabel = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

      const newNote = {
        id: generateNoteId(),
        text: '',
        type: 'date',
        month: date.getMonth(),
        year: date.getFullYear(),
        dateLabel,
        dateKey,
        color: getRandomStickyColor(),
        rotation: Math.random() * 4 - 2,
        createdAt: Date.now(),
      };

      setNotes((prev) => [newNote, ...prev]);
      return;
    }

    setSelectedDate(date);

    if (selectionStep === 0) {
      setRangeStart(date);
      setRangeEnd(null);
      setSelectionStep(1);
    } else if (selectionStep === 1) {
      if (isSameDay(date, rangeStart)) {
        setRangeStart(null);
        setSelectionStep(0);
      } else {
        if (date < rangeStart) {
          setRangeEnd(rangeStart);
          setRangeStart(date);
        } else {
          setRangeEnd(date);
        }
        setSelectionStep(2);
      }
    } else {
      setRangeStart(date);
      setRangeEnd(null);
      setSelectionStep(1);
    }
  }, [selectionStep, rangeStart, selectedDate]);

  const clearRange = useCallback(() => {
    setRangeStart(null);
    setRangeEnd(null);
    setSelectionStep(0);
  }, []);

  const clearSelectedDate = useCallback(() => {
    setSelectedDate(null);
  }, []);

  const handleAddNote = useCallback((newNote) => {
    setNotes((prev) => [newNote, ...prev]);
  }, []);

  const handleUpdateNote = useCallback((id, text) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, text } : n))
    );
  }, []);

  const handleDeleteNote = useCallback((id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const noteDates = useMemo(() => {
    const set = new Set();
    notes.forEach((n) => {
      if (n.dateKey) set.add(n.dateKey);
    });
    return set;
  }, [notes]);

  const showRange = rangeStart && rangeEnd;
  const rangeDays = showRange ? daysBetween(rangeStart, rangeEnd) : 0;

  const renderMonth = displayMonth;
  const renderYear = displayYear;
  const renderTheme = themes[renderMonth];

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : 'light'}`}>
      {isWiping && (
        <div
          className={`clip-wipe-overlay ${isDarkMode ? 'wipe-to-light' : 'wipe-to-dark'}`}
          style={wipeStyle}
        />
      )}

      <ThemeParticles type={renderTheme.particleType} />

      <header className="app-header">
        <div className="header-top-row">
          <h1>Interactive Wall Calendar</h1>
          <button
            ref={toggleBtnRef}
            className="dark-mode-toggle"
            onClick={handleDarkModeToggle}
            aria-label={isDarkMode ? 'Switch to day mode' : 'Switch to night mode'}
            id="dark-mode-toggle"
          >
            <span className={`toggle-icon ${isDarkMode ? 'night' : 'day'}`}>
              {isDarkMode ? '🌙' : '☀️'}
            </span>
          </button>
        </div>
        <p>Select dates · Add notes · Explore months</p>
      </header>

      <div className="wall-calendar" id="wall-calendar">
        <div className="calendar-main">
          <SpiralBinding />

          <div className="page-flip-container">
            {isFlipping && (
              <div className={`calendar-page new-page ${showNewPage ? 'new-page-visible' : ''}`}>
                <HeroImage
                  theme={nextTheme}
                  month={MONTH_NAMES[currentMonth]}
                  year={currentYear}
                  isDarkMode={isDarkMode}
                  monthIndex={currentMonth}
                />
                <MonthNavigator
                  onPrev={() => {}}
                  onNext={() => {}}
                  onToday={() => {}}
                />
                <CalendarGrid
                  year={currentYear}
                  month={currentMonth}
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  onDayClick={() => {}}
                  noteDates={noteDates}
                  notes={notes}
                  selectedDate={selectedDate}
                />
              </div>
            )}

            <div
              className={`calendar-page current-page ${
                isFlipping
                  ? flipDirection === 'forward'
                    ? 'page-lift-up'
                    : 'page-lift-down'
                  : ''
              }`}
            >
              <HeroImage
                theme={renderTheme}
                month={MONTH_NAMES[renderMonth]}
                year={renderYear}
                isDarkMode={isDarkMode}
                monthIndex={renderMonth}
              />
              <MonthNavigator
                onPrev={() => navigateMonth(-1)}
                onNext={() => navigateMonth(1)}
                onToday={goToToday}
              />
              <CalendarGrid
                year={renderYear}
                month={renderMonth}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                onDayClick={handleDayClick}
                noteDates={noteDates}
                notes={notes}
                selectedDate={selectedDate}
              />
            </div>
          </div>
        </div>

        <NotesPanel
          notes={notes}
          onAddNote={handleAddNote}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
          currentMonth={displayMonth}
          currentYear={displayYear}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          selectedDate={selectedDate}
          onClearSelection={clearSelectedDate}
          isMobileVisible={mobileNotesVisible ? true : undefined}
          onClose={() => setMobileNotesVisible(false)}
          animationKey={notesPanelKey}
        />
      </div>

      <button
        className="notes-toggle-mobile"
        onClick={() => setMobileNotesVisible((v) => !v)}
        aria-label="Toggle notes panel"
        id="notes-toggle-mobile"
      >
        📝
      </button>

      <div className={`range-indicator ${showRange ? 'visible' : ''}`} id="range-indicator">
        <div className="range-info">
          <span>{formatDate(rangeStart)}</span>
          <span style={{ opacity: 0.4 }}>→</span>
          <span>{formatDate(rangeEnd)}</span>
        </div>
        <span className="range-days">{rangeDays} day{rangeDays !== 1 ? 's' : ''}</span>
        <button className="clear-btn" onClick={clearRange}>Clear</button>
      </div>
    </div>
  );
}

export default App;
