// TODO :: Refactor.

"use client";

import React, { FC, useEffect, useState } from "react";
import CalendarItem from "@/models/data/calendar/CalendarItem";
import CalButton from "@/components/navigation/Button";
import { useCalendar } from "@/context/calendar/CalendarContext";
import StyleMap from "@/models/data/theme/StyleMap";

const CalendarSelector: FC = () => {
  const calendarContext = useCalendar();
  if (!calendarContext) {
    throw new Error("CalendarSelector must be used within a CalendarProvider");
  }
  const { selectedCalendars, setSelectedCalendars } = calendarContext;

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [calendarList, setCalendarList] = useState<CalendarItem[]>([]);
  const [localSelected, setLocalSelected] = useState<string[]>(selectedCalendars);

  const CALENDAR_NAV_BUTTON_CLASSES: StyleMap[] = [
    { key: "px",
      styles: [ {name: "default", value: "2"}]
    },
    { key: "py",
      styles: [ {name: "default", value: "1"}]
    },
  ];

  const fetchCalendars = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/calendar/list");
      if (!res.ok) {
        throw new Error("Failed to fetch calendars");
      }

      const data = await res.json();
      if (!data || !data.calendars) {
        setCalendarList([]);
        setLoading(false);
        return;
      }

      setCalendarList(data.calendars.map((cal: CalendarItem) => ({
        id: cal.id,
        summary: cal.summary,
      })));
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLocalSelected(selectedCalendars);
    fetchCalendars();
  }, [selectedCalendars]);


  const handleCheckbox = (id: string) => {
    if (localSelected.includes(id)) {
      setLocalSelected(localSelected.filter((cid) => cid !== id));
    } else {
      setLocalSelected([...localSelected, id]);
    }
  };

  const handleSave = () => {
    setSelectedCalendars(localSelected);
  };

  const isSaveDisabled = (): boolean | undefined => {
    if (localSelected.length !== selectedCalendars.length) {
      return false;
    }
    for (const id of localSelected) {
      if (!selectedCalendars.includes(id)) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="p-4 text-white">
      {loading ? (
        <div>Loading calendars...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div>
          <h2 className="text-xl text-left underline pb-2">CALENDARS</h2>
          {calendarList.length === 0 ? (
            <div>No calendars found.</div>
          ) : (
            <>
              <ul className="list-none p-0">
                {calendarList.map((calendar) => (
                  <li key={calendar.id}>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={localSelected.includes(calendar.id)}
                        onChange={() => handleCheckbox(calendar.id)}
                        className="accent-sky-600 text-white w-4 h-4"
                      />
                      {calendar.summary}
                    </label>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 mt-3">
                <CalButton onClick={() => setLocalSelected(selectedCalendars)} disabled={isSaveDisabled()} classNames={CALENDAR_NAV_BUTTON_CLASSES}>
                  Reset
                </CalButton>
                <CalButton onClick={handleSave} disabled={isSaveDisabled()} classNames={CALENDAR_NAV_BUTTON_CLASSES}>
                  Save
                </CalButton>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarSelector;