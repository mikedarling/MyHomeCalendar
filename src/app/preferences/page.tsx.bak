"use client";

import React, { useEffect, useState } from "react";
import prefUtils from "../../utils/prefUtils";
import FlyoutMenu from "../../components/menu/FlyoutMenu";
import { useAuth } from "../../components/oauth/AuthContext";

interface CalendarItem {
  id: string;
  summary: string;
}

const PreferencesPage: React.FC = () => {
  const { loggedIn } = useAuth();
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]);
  const [calendars, setCalendars] = useState<CalendarItem[]>([]);
  const [prefs, setPrefs] = useState<{ [calendarSummary: string]: { color: string; textMode?: 'light' | 'dark' } }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // const handleColorChange = (summary: string, color: string) => {
  //   prefUtils.setCalendarColor(summary, color);
  //   setPrefs(prefUtils.getAllCalendarColors());
  // };

  return (
    <>
      <header className="sticky top-0 z-50 p-10 pb-5 bg-sky-600 text-white text-center">
        <div className="flex flex-row relative items-center justify-between w-full">
          <div className="absolute left-0">
            <FlyoutMenu
              loggedIn={loggedIn}
              selectedCalendars={selectedCalendars}
              setSelectedCalendars={setSelectedCalendars}
            />
          </div>
          <h1 className="text-4xl flex-1 text-center">Preferences</h1>
        </div>
      </header>
      <main className="max-w-xl mx-auto p-8">
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
      </main>
    </>
  );
};

export default PreferencesPage;