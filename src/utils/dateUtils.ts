export type CalendarDate = {
  monthDay: Date | null;
  dayOfWeek: number;
};

export type TimeRange = {
  start: Date | null;
  end: Date | null;
};

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const daysInMonth = [
  31, // January
  28, // February (29 in leap years, handled separately)
  31, // March
  30, // April
  31, // May
  30, // June
  31, // July
  31, // August
  30, // September
  31, // October
  30, // November
  31, // December
];

const getWeekdays = (): string[] => {
  return weekDays;
};

const getMonthName = (date: Date): string => {
  return months[date.getMonth()];
};

const getFirstWeekDay = (date: Date): number => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return firstDay.getDay();
};

const getDaysInMonth = (date: Date): number => {
  const month = date.getMonth();

  if (month === 1) {
    const year = date.getFullYear();
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
  }

  return daysInMonth[month];
};

const getMonthDays = (date: Date): CalendarDate[] => {
  const days: CalendarDate[] = [];
  for (let i = 1; i <= getDaysInMonth(date); i++) {
    const thisDay = new Date(date.getFullYear(), date.getMonth(), i);
    const calendarDate: CalendarDate = {
      monthDay: thisDay,
      dayOfWeek: thisDay.getDay(),
    };
    days.push(calendarDate);
  }
  return days;
};

const parseGoogleEvent = (event: any): TimeRange => {
  return {
    start: new Date(event.start.dateTime || null),
    end: new Date(event.end.dateTime || null),
  };
};

const getLocalTime = (date: Date | null): string => {
  if (!date) {
    return "";
  }
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

const getTimeDisplay = (eventTimes: TimeRange) => {
  if (eventTimes.start === null) {
    return "";
  }

  const display = getLocalTime(eventTimes.start);
  if (eventTimes.end === null) {
    return display;
  }

  return `${display} - ${getLocalTime(eventTimes.end)}`;
};

const getEventDuration = (event: any): number => {
  if (!event.start || !event.start.dateTime || !event.end || !event.end.dateTime) {
    return 0;
  }

  const start = new Date(event.start.dateTime);
  const end = new Date(event.end.dateTime);
  return (end.getTime() - start.getTime()) / (1000 * 60);
}

const getOverlappingEvents = (event: any, events: any[]): any[] | null => {
  const overlaps = events.filter((e) => { return doesOverlap(event, e); });
  if (event.summary == "Liv - Hip-Hop") {
    console.log(`[dateUtils.getOverlappingEvents] ${event.summary} overlaps with ${overlaps.length} events.`);
  }

  if (overlaps.length === 0) {
    return null;
  }

  return overlaps// events
    //.filter((e) => { return doesOverlap(event, e); })
    .sort((a, b) => { return a.id.localeCompare(b.id, undefined, { numeric: true }); });
};

const doesOverlap = (thisEvent: any, otherEvent: any): boolean =>{
  if (thisEvent.id == otherEvent.id) {
    // For the sake of displaying them in sorted order, consider an event to overlap with itself.
    return true;
  }

  const thisEventTimes = parseGoogleEvent(thisEvent);
  if (!thisEventTimes.start || !thisEventTimes.end) {
    return false;
  }

  const otherEventTimes = parseGoogleEvent(otherEvent);
  if (!otherEventTimes.start || !otherEventTimes.end) {
    return false;
  }

  if (thisEventTimes.start >= otherEventTimes.end) {
    return false;
  }

  if (thisEventTimes.end <= otherEventTimes.start) {
    return false;
  }

  return true;
}

export default {
  getMonthName,
  getFirstWeekDay,
  getDaysInMonth,
  getMonthDays,
  getWeekdays,
  parseGoogleEvent,
  getLocalTime,
  getTimeDisplay,
  getEventDuration,
  getOverlappingEvents,
};