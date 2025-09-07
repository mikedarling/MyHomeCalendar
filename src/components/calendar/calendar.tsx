"use client";

import React, { useState, FC } from "react";
import CalendarMonth from "./Month";
import CalendarWeek from "./Week";
import AuthProvider from "@/context/oauth/AuthProivder";
import CalendarProps from "@/models/props/component/calendar/CalendarProps";
import CalendarProvider from "@/context/calendar/CalendarProvider";
import Button from "../navigation/Button";

const Calendar: FC<CalendarProps> = ({ selectedCalendars }) => {
  const now = new Date();
  const [view, setView] = useState<"month" | "week">("week");
  const [selectedDate, setSelectedDate] = useState<Date>(now);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <AuthProvider>
      <CalendarProvider>
        <div style={{ position: "relative" }}>
          <div style={{ marginBottom: "1em", marginLeft: 0 }}>
            <Button onClick={() => setView("month")} disabled={view === "month"} ariaLabel="Month View">
              Month View
            </Button>
            <Button onClick={() => setView("week")} disabled={view === "week"} ariaLabel="Week View">
              Week View
            </Button>
          </div>
          {view === "month" ? (
            <CalendarMonth selectedDate={selectedDate} calendarIds={selectedCalendars} />
          ) : (
            <CalendarWeek selectedDate={selectedDate} calendarIds={selectedCalendars} onDateSelected={handleDayClick} />
          )}
        </div>
      </CalendarProvider>
  </AuthProvider>
  );
};

export default Calendar;