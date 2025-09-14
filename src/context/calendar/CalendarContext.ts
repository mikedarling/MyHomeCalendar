import { createContext, useContext } from "react";
import CalendarContextType from "@/models/props/context/calendar/CalendarContextType";

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error(
      "useCalendar must be used within a CalendarProvider",
    );
  }
  return context;
};

export default CalendarContext;