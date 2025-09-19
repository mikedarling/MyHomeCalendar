export default interface CalendarContextType {
  selectedCalendars: string[];
  setSelectedCalendars: (ids: string[]) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}