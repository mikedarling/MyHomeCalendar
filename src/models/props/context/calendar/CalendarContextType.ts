export default interface CalendarContextType {
  selectedCalendars: string[];
  setSelectedCalendars: (ids: string[]) => void;
}