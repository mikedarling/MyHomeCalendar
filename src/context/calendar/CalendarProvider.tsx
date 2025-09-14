'use client';

import { ReactNode, useEffect, useRef, useState } from "react";
import CalendarContext from "./CalendarContext";

const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const prevSelectedCalendars = useRef<string[] | null>(null);
  const didMount = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const saved = window.localStorage.getItem("selectedCalendars");
    if (!saved) {
      return;
    }
    setSelectedCalendars(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (prevSelectedCalendars.current !== null) {
      console.log("Prev selectedCalendars:", prevSelectedCalendars.current);
      console.log("Updated selectedCalendars:", selectedCalendars);
    }
    prevSelectedCalendars.current = selectedCalendars;
  }, [selectedCalendars]);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return; // Skip effect on initial mount
    }
    // This code runs only when selectedCalendars changes after mount
    window.localStorage.setItem("selectedCalendars", JSON.stringify(selectedCalendars));
  }, [selectedCalendars]);

  return (
    <CalendarContext.Provider value={{ selectedCalendars, setSelectedCalendars, selectedDate, setSelectedDate }}>
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarProvider;