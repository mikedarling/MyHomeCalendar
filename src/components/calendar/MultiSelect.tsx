"use client";

import React, { FC, useEffect, useState } from "react";
import CalendarItem from "@/models/data/calendar/CalendarItem";
import MultiSelectProps from "@/models/props/component/calendar/MultiSelectProps";

const MultiSelect: FC<MultiSelectProps> = ({ loggedIn, selected, setSelected }) => {
  const [calendars, setCalendars] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localSelected, setLocalSelected] = useState<string[]>(selected);

  const fetchCalendars = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/calendar/list");
      if (!res.ok) {
        throw new Error("Failed to fetch calendars");
      }
      const data = await res.json();
      setCalendars(data.calendars || []);
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loggedIn) {
      setLoading(false);
      setCalendars([]);
      return;
    }
    fetchCalendars();
  }, [loggedIn]);

  // Keep localSelected in sync with selected from props
  useEffect(() => {
    setLocalSelected(selected);
  }, [selected]);

  const handleCheckbox = (id: string) => {
    if (localSelected.includes(id)) {
      setLocalSelected(localSelected.filter((cid) => cid !== id));
    } else {
      setLocalSelected([...localSelected, id]);
    }
  };

  const handleSave = () => {
    setSelected(localSelected);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "selectedCalendars",
        JSON.stringify(localSelected),
      );
    }
  };

  // Show prompt if not logged in
  if (!loggedIn) {
    return <div>Please sign in with Google to view calendars.</div>;
  }

  // Only consider calendars that are currently displayed
  const displayedIds = calendars.map((c) => c.id);
  const filteredLocal = localSelected
    .filter((id) => displayedIds.includes(id))
    .sort();
  const filteredSelected = selected
    .filter((id) => displayedIds.includes(id))
    .sort();
  const isSaveDisabled =
    filteredLocal.length === filteredSelected.length &&
    filteredLocal.every((id, i) => id === filteredSelected[i]);

  return (
    <div className="p-4 text-white">
      {loading ? (
        <div>Loading calendars...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div>
          <h2 className="text-xl text-left underline pb-2">CALENDARS</h2>
          {calendars.length === 0 && <div>No calendars found.</div>}
          <ul className="list-none p-0">
            {calendars.map((cal) => (
              <li key={cal.id}>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={localSelected.includes(cal.id)}
                    onChange={() => handleCheckbox(cal.id)}
                    className="accent-sky-600 text-white w-4 h-4"
                  />
                  {cal.summary}
                </label>
              </li>
            ))}
          </ul>
          <button
            onClick={handleSave}
            className={`mt-3 px-5 py-1.5 rounded border-none ${isSaveDisabled ? "bg-blue-200 text-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"}`}
            disabled={isSaveDisabled}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;