"use client";

import React, { useState, useEffect } from "react";
import CalendarMonth from "./month";
import CalendarWeek from "./week";
import { AuthProvider, useAuth } from "../oauth/AuthContext";
import {
  CalendarSelectionProvider,
  useCalendarSelection,
} from "./CalendarSelectionContext";

interface CalendarProps {
  selectedCalendars: string[];
  setSelectedCalendars: (ids: string[]) => void;
}

const CalendarInner: React.FC<CalendarProps> = ({
  selectedCalendars,
  setSelectedCalendars,
}) => {
  const now = new Date();
  const [view, setView] = useState<"month" | "week">("week");
  const [selectedDate, setSelectedDate] = useState<Date>(now);
  const { loggedIn } = useAuth();

  // Helper to get week index of a date
  const getWeekOfDate = (date: Date) => {
    const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayOfWeek = firstOfMonth.getDay();
    const dayOfMonth = date.getDate();
    return Math.floor((firstDayOfWeek + dayOfMonth - 1) / 7);
  };

  // Helper to get total weeks in a month
  const getWeeksInMonth = (year: number, month: number) => {
    const firstOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = firstOfMonth.getDay();
    return Math.ceil((daysInMonth + firstDayOfWeek) / 7);
  };

  // State for week selection in week view
  const [week, setWeek] = useState(getWeekOfDate(selectedDate));
  const weeksInMonth = getWeeksInMonth(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
  );

  // Update week when selectedDate changes in week view
  useEffect(() => {
    if (view === "week") {
      setWeek(getWeekOfDate(selectedDate));
    }
  }, [selectedDate, view]);

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
          onDateSelected={handleDayClick}
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
