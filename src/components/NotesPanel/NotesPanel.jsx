import { useState, useMemo } from 'react';
import StickyNote from '../StickyNote/StickyNote';
import { MONTH_NAMES } from '../../utils/calendarUtils';
import { generateNoteId, getRandomStickyColor } from '../../utils/storageUtils';
import { getHoliday } from '../../data/holidays';

const NotesPanel = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  currentMonth,
  currentYear,
  rangeStart,
  rangeEnd,
  selectedDate,
  onClearSelection,
  isMobileVisible,
  onClose,
  animationKey,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [newNoteType, setNewNoteType] = useState('month');
  const [newNoteText, setNewNoteText] = useState('');

  const selectedHoliday = useMemo(() => {
    if (!selectedDate) return null;
    return getHoliday(selectedDate.getMonth(), selectedDate.getDate());
  }, [selectedDate]);

  const selectedDateLabel = useMemo(() => {
    if (!selectedDate) return null;
    return selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }, [selectedDate]);

  const filteredNotes = useMemo(() => {
    if (selectedDate) {
      const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
      return notes.filter((n) => n.dateKey === dateKey);
    }
    return notes.filter((n) => n.month === currentMonth && n.year === currentYear);
  }, [notes, selectedDate, currentMonth, currentYear]);

  const handleQuickAdd = () => {
    if (!selectedDate) {
      setShowForm(true);
      return;
    }

    const dateLabel = selectedDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;

    const newNote = {
      id: generateNoteId(),
      text: '',
      type: 'date',
      month: selectedDate.getMonth(),
      year: selectedDate.getFullYear(),
      dateLabel,
      dateKey,
      color: getRandomStickyColor(),
      rotation: Math.random() * 4 - 2,
      createdAt: Date.now(),
    };

    onAddNote(newNote);
  };

  const handleSave = () => {
    if (!newNoteText.trim()) return;

    let dateLabel = `${MONTH_NAMES[currentMonth]} ${currentYear}`;
    let noteDate = null;

    if (newNoteType === 'range' && rangeStart && rangeEnd) {
      const startStr = rangeStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const endStr = rangeEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dateLabel = `${startStr} — ${endStr}`;
      noteDate = `${rangeStart.getFullYear()}-${rangeStart.getMonth()}-${rangeStart.getDate()}`;
    } else if (newNoteType === 'today') {
      const today = new Date();
      dateLabel = today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      noteDate = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    } else if (newNoteType === 'selected' && selectedDate) {
      dateLabel = selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      noteDate = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
    }

    const newNote = {
      id: generateNoteId(),
      text: newNoteText.trim(),
      type: newNoteType,
      month: currentMonth,
      year: currentYear,
      dateLabel,
      dateKey: noteDate,
      color: getRandomStickyColor(),
      rotation: Math.random() * 4 - 2,
      createdAt: Date.now(),
    };

    onAddNote(newNote);
    setNewNoteText('');
    setShowForm(false);
  };

  const panelClasses = [
    'notes-panel',
    isMobileVisible === true ? 'mobile-visible' : '',
    isMobileVisible === false ? 'mobile-hidden' : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      <div className={panelClasses} id="notes-panel">
        <div className="notes-panel-animated" key={animationKey || `${currentMonth}-${currentYear}`}>
          <div className="notes-header">
            <div className="notes-header-left">
              <h3>📝 {selectedDate ? 'Notes' : `${MONTH_NAMES[currentMonth]} Notes`}</h3>
              {selectedDate && (
                <span className="notes-date-label">{selectedDateLabel}</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {selectedDate && (
                <button
                  className="notes-back-btn"
                  onClick={onClearSelection}
                  aria-label="Show all notes"
                  title="Show all notes"
                >
                  ←
                </button>
              )}
              <button
                className="add-note-btn"
                onClick={handleQuickAdd}
                aria-label="Add a new note"
                id="add-note-btn"
              >
                +
              </button>
              {isMobileVisible && (
                <button
                  className="add-note-btn"
                  onClick={onClose}
                  aria-label="Close notes"
                  style={{ fontSize: '0.9rem' }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {selectedHoliday && (
            <div className="holiday-banner">
              <span className="holiday-banner-emoji">{selectedHoliday.emoji}</span>
              <span className="holiday-banner-name">{selectedHoliday.name}</span>
            </div>
          )}

          <div className="notes-list">
            {filteredNotes.length === 0 ? (
              <div className="notes-empty">
                <span className="notes-empty-icon">
                  {selectedDate ? '📌' : '📋'}
                </span>
                <span>
                  {selectedDate
                    ? 'No notes for this date'
                    : 'No notes for this month'}
                </span>
                <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                  {selectedDate
                    ? 'Click + to pin a note here'
                    : 'Click a date or + to add one'}
                </span>
              </div>
            ) : (
              filteredNotes.map((note) => (
                <StickyNote
                  key={note.id}
                  note={note}
                  onUpdate={onUpdateNote}
                  onDelete={onDeleteNote}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="note-form-overlay" onClick={() => setShowForm(false)}>
          <div className="note-form" onClick={(e) => e.stopPropagation()}>
            <h4>✨ New Note</h4>

            <div className="note-form-group">
              <label htmlFor="note-type-select">Attach to</label>
              <select
                id="note-type-select"
                value={newNoteType}
                onChange={(e) => setNewNoteType(e.target.value)}
              >
                <option value="month">
                  This month ({MONTH_NAMES[currentMonth]})
                </option>
                <option value="today">Today</option>
                {selectedDate && (
                  <option value="selected">
                    Selected date ({selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
                  </option>
                )}
                {rangeStart && rangeEnd && (
                  <option value="range">Selected range</option>
                )}
              </select>
            </div>

            <div className="note-form-group">
              <label htmlFor="note-text-input">Note</label>
              <textarea
                id="note-text-input"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Write your note here..."
                autoFocus
              />
            </div>

            <div className="note-form-actions">
              <button
                className="note-form-btn cancel"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                className="note-form-btn save"
                onClick={handleSave}
                disabled={!newNoteText.trim()}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotesPanel;
