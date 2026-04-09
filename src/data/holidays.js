const holidays = {
  '1-1': { name: "New Year's Day", emoji: '🎉' },
  '1-14': { name: 'Makar Sankranti', emoji: '🪁' },
  '1-26': { name: 'Republic Day', emoji: '🇮🇳' },
  '2-14': { name: "Valentine's Day", emoji: '❤️' },
  '3-8': { name: "Women's Day", emoji: '💐' },
  '3-25': { name: 'Holi', emoji: '🎨' },
  '4-14': { name: 'Ambedkar Jayanti', emoji: '📘' },
  '5-1': { name: 'Labour Day', emoji: '✊' },
  '5-11': { name: "Mother's Day", emoji: '🌸' },
  '6-15': { name: "Father's Day", emoji: '👔' },
  '7-4': { name: 'Independence Day (US)', emoji: '🇺🇸' },
  '8-15': { name: 'Independence Day', emoji: '🇮🇳' },
  '9-5': { name: "Teacher's Day", emoji: '📚' },
  '10-2': { name: 'Gandhi Jayanti', emoji: '🕊️' },
  '10-31': { name: 'Halloween', emoji: '🎃' },
  '11-1': { name: 'Diwali', emoji: '🪔' },
  '11-14': { name: "Children's Day", emoji: '🧒' },
  '12-25': { name: 'Christmas', emoji: '🎄' },
  '12-31': { name: "New Year's Eve", emoji: '🥂' },
};

export const getHoliday = (month, day) => {
  const key = `${month + 1}-${day}`;
  return holidays[key] || null;
};

export default holidays;
