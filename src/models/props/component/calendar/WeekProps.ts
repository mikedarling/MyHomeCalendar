interface WeekProps {
  calendarIds: string[];
  selectedDate: Date;
  onDateSelected: (date: Date) => void;
}
