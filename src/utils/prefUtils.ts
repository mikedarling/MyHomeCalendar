const CALENDAR_COLOR_LOCAL_KEY = "calendarColors";

type CalendarColorPrefs = {
  [calendarSummary: string]: string; // hex color
};

const getAllCalendarColors = (): CalendarColorPrefs => {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const raw = window.localStorage.getItem(CALENDAR_COLOR_LOCAL_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const getCalendarColor = (summary: string): string => {
  const prefs = getAllCalendarColors();
  const color = prefs[summary];
  if (typeof color === "string" && /^#[0-9a-fA-F]{6}$/.test(color)) {
    return color;
  } else {
    return "#888888";
  }
}

const setCalendarColor = (summary: string, color: string) => {
  if (typeof window === "undefined") {
    return;
  }
  const prefs = getAllCalendarColors();
  prefs[summary] = color;
  window.localStorage.setItem(CALENDAR_COLOR_LOCAL_KEY, JSON.stringify(prefs));
}

export default {
  getAllCalendarColors,
  getCalendarColor,
  setCalendarColor
}
