import { ReactNode, useState } from "react";
import CalendarContext from "./CalendarContext";

const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]);

  return (
    <CalendarContext.Provider value={{ selectedCalendars, setSelectedCalendars }}>
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarProvider;