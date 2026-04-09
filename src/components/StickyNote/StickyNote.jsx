import { useRef, useEffect } from 'react';

const StickyNote = ({ note, onUpdate, onDelete }) => {
  const textRef = useRef(null);

  const rotation = useRef(
    note.rotation ?? (Math.random() * 4 - 2)
  ).current;

  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.height = 'auto';
      textRef.current.style.height = textRef.current.scrollHeight + 'px';
    }
  }, [note.text]);

  const dateLabel = note.dateLabel || 'General note';

  return (
    <div
      className="sticky-note"
      style={{
        '--rotation': `${rotation}deg`,
        '--sticky-shadow': note.color?.shadow || 'rgba(0,0,0,0.1)',
        '--sticky-border': note.color?.border || '#F9E547',
        backgroundColor: note.color?.bg || '#FFF9C4',
      }}
    >
      <div className="sticky-note-date">{dateLabel}</div>

      <textarea
        ref={textRef}
        className="sticky-note-text"
        value={note.text}
        onChange={(e) => onUpdate(note.id, e.target.value)}
        placeholder="Write something..."
        aria-label={`Note: ${dateLabel}`}
      />

      <div className="sticky-note-actions">
        <button
          className="sticky-action-btn"
          onClick={() => onDelete(note.id)}
          aria-label="Delete note"
          title="Delete note"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default StickyNote;
