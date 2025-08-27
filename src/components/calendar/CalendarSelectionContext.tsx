import React, { createContext, useContext, useState, ReactNode } from "react";

interface CalendarSelectionContextType {
  selectedCalendars: string[];
  setSelectedCalendars: (ids: string[]) => void;
}

const CalendarSelectionContext = createContext<
  CalendarSelectionContextType | undefined
>(undefined);

export const CalendarSelectionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]);
  return (
    <CalendarSelectionContext.Provider
      value={{ selectedCalendars, setSelectedCalendars }}
    >
      {children}
    </CalendarSelectionContext.Provider>
  );
};

export const useCalendarSelection = () => {
  const context = useContext(CalendarSelectionContext);
  if (!context) {
    throw new Error(
      "useCalendarSelection must be used within a CalendarSelectionProvider",
    );
  }
  return context;
};
