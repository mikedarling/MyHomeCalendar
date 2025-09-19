"use client";

import React, { useState, FC } from "react";
import CalendarMonth from "@/components/calendar/Month";
import CalendarWeek from "@/components/calendar/Week";
import AuthProvider from "@/context/oauth/AuthProivder";
import CalendarProvider from "@/context/calendar/CalendarProvider";
import CalButton from "@/components/navigation/Button";
import MonthIcon from "@/components/media/MonthIcon";
import WeekIcon from "@/components/media/WeekIcon";
import StyleMap from "@/models/data/theme/StyleMap";

const Calendar: FC = () => {
  const [view, setView] = useState<"month" | "week">("week");

  const viewButtonClasses: StyleMap[] = [
    { key: "p",
      styles: [ {name: "default", value: "1"}]
    },
    { key: "w",
      styles: [ {name: "default", value: "12"}]
    },
  
  ];

  return (
    <AuthProvider>
      <CalendarProvider>
        <div className="grid grid-cols-12">
          <div className="col-span-1 flex flex-col items-end pr-5 gap-2">
            <CalButton classNames={viewButtonClasses} onClick={() => setView("month")} disabled={view === "month"} ariaLabel="Month View">
              <MonthIcon height={40} width={40} />
            </CalButton>
            <CalButton classNames={viewButtonClasses} onClick={() => setView("week")} disabled={view === "week"} ariaLabel="Week View">
              <WeekIcon height={40} width={40} />
            </CalButton>
          </div>
          <div className="col-span-11">
            {view === "month" ? (
              <CalendarMonth />
            ) : (
              <CalendarWeek />
            )}
          </div>
        </div>
      </CalendarProvider>
  </AuthProvider>
  );
};

export default Calendar;