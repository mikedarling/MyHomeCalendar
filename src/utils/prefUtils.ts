const CALENDAR_COLOR_LOCAL_KEY = "calendarColors";


type CalendarColorPrefs = {
  [calendarSummary: string]: {
    color: string;
    textMode?: 'light' | 'dark';
  };
};

const getAllCalendarColors = (window: Window): CalendarColorPrefs => {
  try {
    const raw = window.localStorage.getItem(CALENDAR_COLOR_LOCAL_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const getCalendarColor = (window: Window, summary: string): string => {
  const prefs = getAllCalendarColors(window);
  const entry = prefs[summary];
  if (entry && typeof entry.color === "string" && /^#[0-9a-fA-F]{6}$/.test(entry.color)) {
    return entry.color;
  } else {
    return "#888888";
  }
}

const getCalendarTextMode = (window: Window, summary: string): 'light' | 'dark' => {
  const prefs = getAllCalendarColors(window);
  const entry = prefs[summary];
  return entry && entry.textMode === 'dark' ? 'dark' : 'light';
}

const setCalendarColor = (window: Window, summary: string, color: string) => {
  const prefs = getAllCalendarColors(window);
  if (!prefs[summary]) prefs[summary] = { color, textMode: 'light' };
  else prefs[summary].color = color;
  window.localStorage.setItem(CALENDAR_COLOR_LOCAL_KEY, JSON.stringify(prefs));
}

const setCalendarTextMode = (window: Window, summary: string, textMode: 'light' | 'dark') => {
  const prefs = getAllCalendarColors(window);
  if (!prefs[summary]) prefs[summary] = { color: '#888888', textMode };
  else prefs[summary].textMode = textMode;
  window.localStorage.setItem(CALENDAR_COLOR_LOCAL_KEY, JSON.stringify(prefs));
}

export default {
  getAllCalendarColors,
  getCalendarColor,
  setCalendarColor,
  getCalendarTextMode,
  setCalendarTextMode
}
