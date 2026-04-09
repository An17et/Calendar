const STORAGE_KEY = 'wall-calendar-notes';

export const loadNotes = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveNotes = (notes) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.warn('Failed to save notes:', e);
  }
};

export const generateNoteId = () => {
  return `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const STICKY_COLORS = [
  { bg: '#FFF9C4', border: '#F9E547', shadow: 'rgba(249,229,71,0.3)' },
  { bg: '#F8BBD0', border: '#F06292', shadow: 'rgba(240,98,146,0.3)' },
  { bg: '#B3E5FC', border: '#4FC3F7', shadow: 'rgba(79,195,247,0.3)' },
  { bg: '#C8E6C9', border: '#81C784', shadow: 'rgba(129,199,132,0.3)' },
  { bg: '#E1BEE7', border: '#CE93D8', shadow: 'rgba(206,147,216,0.3)' },
  { bg: '#FFE0B2', border: '#FFB74D', shadow: 'rgba(255,183,77,0.3)' },
];

export const getRandomStickyColor = () => {
  return STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)];
};
