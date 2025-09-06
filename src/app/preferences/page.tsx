'use client'

import prefUtils from "@/utils/prefUtils";
import { FC, useEffect, useState } from "react";

interface CalendarItem {
  id: string;
  summary: string;
}

const Preferences: FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [calendars, setCalendars] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [prefs, setPrefs] = useState<{ [calendarSummary: string]: { color: string; textMode?: 'light' | 'dark' } }>({});

  // Load calendars
  useEffect(() => {
    const fetchCalendars = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/calendar/list");
        if (!res.ok) throw new Error("Failed to fetch calendars");
        const data = await res.json();
        setCalendars(data.calendars || []);
      } catch (e: any) {
        setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchCalendars();
  }, []);

  // Load prefs from localStorage
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    setPrefs(prefUtils.getAllCalendarColors(window));
  }, []);

  return (
    <>
      <h2 className="text-lg font-semibold mb-2">Calendar Colors</h2>
      {loading ? (
        <div>Loading calendars...</div>
      ) : error ? (
        <div className="text-red-600">Error: {error}</div>
      ) : calendars.length === 0 ? (
        <div>No calendars found.</div>
      ) : (
        <ul>
          {calendars.map((cal) => {
            const textMode = typeof window !== 'undefined' ? prefUtils.getCalendarTextMode(window, cal.summary) : 'light';
            return (
              <li className="flex items-center" key={cal.id}>
                <input
                  type="color"
                  value={prefUtils.getCalendarColor(window, cal.summary) || "#4fb9af"}
                  onChange={(e) => {
                    prefUtils.setCalendarColor(window, cal.summary, e.target.value);
                    setPrefs({
                      ...prefs,
                      [cal.summary]: {
                        ...(prefs[cal.summary] || {}),
                        color: e.target.value,
                      },
                    });
                  }}
                  className="w-6 rounded-full bg-transparent cursor-pointer"
                />
                <span
                  className={`ml-1 transition-colors duration-150 ${textMode === 'light' ? 'text-gray-900' : 'text-gray-100 bg-gray-800 px-2 rounded'}`}
                >
                  {cal.summary}
                </span>
                <button
                  className="ml-2 px-2 py-1 text-xs rounded border border-gray-400 bg-gray-50 hover:bg-gray-200"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      const newMode = textMode === 'light' ? 'dark' : 'light';
                      prefUtils.setCalendarTextMode(window, cal.summary, newMode);
                      setPrefs({ ...prefs }); // force re-render
                    }
                  }}
                >
                  {textMode === 'light' ? 'Light' : 'Dark'}
                </button>
              </li>
            );
          })}
        </ul>
      )}
   </>
  );
};

export default Preferences;