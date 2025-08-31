import { FC, useEffect, useState, useMemo } from "react";
import CalendarEventBox from "./CalendarEventBox";
import dateUtils from "../../utils/dateUtils";
import themeUtils from "../../utils/themeUtils";

interface CalendarWeekProps {
  calendarIds: string[];
  selectedDate: Date;
  onDateSelected: (date: Date) => void;
}

// Only show 8:00 am (8) through 8:00 pm (20)
const START_HOUR = 8;
const END_HOUR = 20;
const HALF_HOUR_BLOCKS = (END_HOUR - START_HOUR) * 2 + 1; // inclusive of 8:00pm

function getStartOfWeek(date: Date) {
  const day = date.getDay(); // 0 (Sun) - 6 (Sat)
  const diff = date.getDate() - day;
  return new Date(date.getFullYear(), date.getMonth(), diff);
}

// Helper to format time in 12-hour format with am/pm
function formatTime(hour: number, minute: number) {
  const ampm = hour >= 12 ? "pm" : "am";
  let displayHour = hour % 12;
  if (displayHour === 0) {
    displayHour = 12;
  }
  return `${displayHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
}

const CalendarWeek: FC<CalendarWeekProps> = ({
  calendarIds,
  selectedDate,
  onDateSelected,
}) => {
  const [viewedDate, setViewedDate] = useState(selectedDate);
  const [events, setEvents] = useState<any[]>([]);
  const startOfWeek = useMemo(() => getStartOfWeek(viewedDate), [viewedDate]);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  // Create half-hour slots from 8:00 am to 8:00 pm
  const timeSlots = Array.from({ length: HALF_HOUR_BLOCKS }, (_, i) => {
    const hour = START_HOUR + Math.floor(i / 2);
    const minute = i % 2 === 0 ? 0 : 30;
    return { hour, minute, label: formatTime(hour, minute) };
  });

  // Fetch events for the displayed week and selected calendars
  useEffect(() => {
    if (!calendarIds || calendarIds.length === 0) {
      setEvents([]);
      return;
    }
    const start = new Date(startOfWeek);
    const end = new Date(startOfWeek);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    const params = new URLSearchParams({
      calendarIds: calendarIds.join(","),
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
    });
    const fetchEvents = async () => {
      const res = await fetch(`/api/calendar/events?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      } else {
        setEvents([]);
      }
    };
    fetchEvents();
  }, [calendarIds, startOfWeek]);

  // Helper to get events for a given day
  function getEventsForDay(day: Date) {
    return events.filter((event) => {
      const startDate = new Date(event.start.dateTime || event.start.date);
      return (
        startDate.getFullYear() === day.getFullYear() &&
        startDate.getMonth() === day.getMonth() &&
        startDate.getDate() === day.getDate()
      );
    });
  }

  // Handlers for Prev/Next week
  const handlePrevWeek = () => {
    const prev = new Date(startOfWeek);
    prev.setDate(prev.getDate() - 7);
    setViewedDate(prev);
    onDateSelected(prev);
  };
  const handleNextWeek = () => {
    const next = new Date(startOfWeek);
    next.setDate(next.getDate() + 7);
    setViewedDate(next);
    onDateSelected(next);
  };

  return (
    <div>
      <div className="mb-2 flex justify-between items-center">
        <button
          className="px-3 py-1 rounded bg-blue-500 text-white border-none font-medium cursor-pointer"
          onClick={handlePrevWeek}
        >
          Prev
        </button>
        <span className="font-medium">
          Week of {startOfWeek.toLocaleDateString()}
        </span>
        <button
          className="px-3 py-1 rounded bg-blue-500 text-white border-none font-medium cursor-pointer"
          onClick={handleNextWeek}
        >
          Next
        </button>
      </div>
      {/* Header Row for Dates */}
      <div className="flex ml-[70px] mb-0">
        {days.map((date, dateIdx) => (
          <div key={dateIdx} className={ themeUtils.WEEKDAY_HEADER + " flex-1 border-r border-white" } >
            {date.toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </div>
        ))}
      </div>
      {/* Time grid and day columns */}
      <div className="flex border border-gray-300 min-h-[600px]">
        {/* Time column */}
        <div className="w-[70px] border-r border-gray-200 bg-gray-50 flex flex-col">
          {timeSlots.map((slot, slotIdx) => (
            <div
              key={slotIdx}
              className="h-6 text-[11px] text-gray-500 flex items-center justify-center text-center pr-0"
            >
              {slot.label}
            </div>
          ))}
        </div>
        {/* Days columns */}
        {days.map((date, dateIdx) => {
          const events = getEventsForDay(date);
          // For each slot, find events that start in this slot
          return (
            <div
              key={dateIdx}
              className={
                "flex-1 flex flex-col relative " +
                (dateIdx < 6 ? "border-r border-gray-200" : "")
              }
            >
              {timeSlots.map((slot, slotIdx) => {
                // Find events that start in this slot
                const slotEvents = events.filter((event) => {
                  const start = new Date(
                    event.start.dateTime || event.start.date,
                  );
                  return (
                    start.getHours() === slot.hour &&
                    start.getMinutes() === slot.minute
                  );
                });
                return (
                  <div
                    key={slotIdx}
                    className={
                      "h-6 border-b border-gray-100 cursor-pointer relative overflow-visible " +
                      (date.toDateString() === viewedDate.toDateString() &&
                      slot.label === "9:00 am"
                        ? "bg-blue-50"
                        : "")
                    }
                    onClick={() => {
                      const slotDate = new Date(date);
                      slotDate.setHours(slot.hour, slot.minute, 0, 0);
                      setViewedDate(slotDate);
                      onDateSelected(slotDate);
                    }}
                  >
                    {slotEvents.map((event) => {
                      // Calculate how many slots this event should span (precise, including partial slots)
                      const eventDuration = dateUtils.getEventDuration(event);
                      const height = (eventDuration / 30) * 24; // 24px per half-hour
                      const evStyle = {
                        height: `${height}px`
                      };
                      const evClasses = ["absolute", "z-10"];
                      const overlaps = dateUtils.getOverlappingEvents(event, events);
                      return (
                        <CalendarEventBox
                          key={event.id}
                          event={event}
                          style={evStyle}
                          classes={evClasses}
                          overlappingEvents={overlaps}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarWeek;
