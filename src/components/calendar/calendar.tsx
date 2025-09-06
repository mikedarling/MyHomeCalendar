"use client";

import React, { useState } from "react";
import CalendarMonth from "./Month";
import CalendarWeek from "./Week";
import { AuthProvider } from "../../context/oauth/AuthContext";
import { CalendarSelectionProvider } from "./CalendarSelectionContext";

interface CalendarProps {
  selectedCalendars: string[];
}

const CalendarInner: React.FC<CalendarProps> = ({ selectedCalendars }) => {
  const now = new Date();
  const [view, setView] = useState<"month" | "week">("week");
  const [selectedDate, setSelectedDate] = useState<Date>(now);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ marginBottom: "1em", marginLeft: 0 }}>
        <button
          onClick={() => setView("month")}
          disabled={view === "month"}
          aria-label="Month View"
          style={{ marginRight: "0.5em" }}
        >
          Month View
        </button>
        <button
          onClick={() => setView("week")}
          disabled={view === "week"}
          aria-label="Week View"
        >
          Week View
        </button>
      </div>
      {view === "month" ? (
        <CalendarMonth
          selectedDate={selectedDate}
          calendarIds={selectedCalendars}
        />
      ) : (
        <CalendarWeek
          selectedDate={selectedDate}
          onDateSelected={handleDayClick}
          calendarIds={selectedCalendars}
        />
      )}
    </div>
  );
};

const Calendar: React.FC<CalendarProps> = (props) => (
  <AuthProvider>
    <CalendarSelectionProvider>
      <CalendarInner {...props} />
    </CalendarSelectionProvider>
  </AuthProvider>
);

export default Calendar;