// Twelve-hour clock parts, for the birth time in the "For You" form.
//
// A birth time is nearly always remembered on a 12-hour clock — "just after four
// in the morning" — while the reading in lib/jyotish.ts works in 24-hour "HH:MM".
// <input type="time"> would render as a 24-hour field on some browsers and
// locales, so the clock is spelled out instead and converted here.
//
// The two cases worth being careful about are the ones people get wrong by hand:
// 12 AM is midnight (00), and 12 PM is midday (12).

export const HOURS_12 = [...Array(12)].map((_, i) => String(i + 1));
export const MINUTES = [...Array(60)].map((_, i) => String(i).padStart(2, '0'));

/** 12-hour parts to the "HH:MM" 24-hour string the reading works in. */
export const to24Hour = (hour, minute, meridiem) => {
  const hours = Number(hour) % 12;
  const adjusted = meridiem === 'PM' ? hours + 12 : hours;
  return `${String(adjusted).padStart(2, '0')}:${minute}`;
};

/** The reverse, so reopening the form shows back what the visitor entered. */
export const from24Hour = (value) => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value || '');
  if (!match) return { birthHour: '', birthMinute: '', birthMeridiem: '' };
  const hours = Number(match[1]);
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return {
    birthHour: String(hour12),
    birthMinute: match[2],
    birthMeridiem: hours < 12 ? 'AM' : 'PM',
  };
};
