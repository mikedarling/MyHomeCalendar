"use client"

import React, { useEffect, useState } from "react";
import dateUtils, { CalendarDate } from "@/utils/dateUtils"
import CalendarEventBox from "./CalendarEventBox";
import themeUtils from "@/utils/themeUtils";

interface CalendarMonthProps {
    selectedDate: Date,
    onDateSelected: Function,
    calendarIds: string[];
}

const CalendarMonth: React.FC<CalendarMonthProps> = ({
    selectedDate,
    onDateSelected,
    calendarIds
}) => {
    const [events, setEvents] = useState<any[]>([]);

    // Helper functions
    const updateDays = (date: Date): CalendarDate[] => {
        let monthDays = dateUtils.getMonthDays(date);
        let firstWeekday = monthDays[0].dayOfWeek;
        for (let i = firstWeekday; i > 0; i--) {
            let emptyNode: CalendarDate = {
                monthDay: null,
                dayOfWeek: -1
            };
            monthDays.unshift(emptyNode);
        }
        return monthDays;
    }

    const initializeDays = (): CalendarDate[] => {
        return updateDays(selectedDate);
    }

    const getMonthLabel = (date: Date): string => {
        return `${dateUtils.getMonthName(date)} ${date.getFullYear()}`
    }

    const initializeMonthLabel = (): string => {
        return getMonthLabel(selectedDate)
    }

    // State declarations (only once)
    const [displayedMonth, setDisplayedMonth] = useState(selectedDate.getMonth());
    const [displayedYear, setDisplayedYear] = useState(selectedDate.getFullYear());
    const [days, setDays] = useState(initializeDays);
    const [monthLabel, setMonthLabel] = useState(initializeMonthLabel);

    // Fetch events for the displayed month and selected calendars
    useEffect(() => {
        if (!calendarIds || calendarIds.length === 0) {
            setEvents([]);
            return;
        }
        const year = displayedYear;
        const month = displayedMonth;
        const fetchEvents = async () => {
            const start = new Date(year, month, 1);
            const end = new Date(year, month + 1, 0, 23, 59, 59);
            const params = new URLSearchParams({
                calendarIds: calendarIds.join(","),
                timeMin: start.toISOString(),
                timeMax: end.toISOString(),
            });
            const res = await fetch(`/api/calendar/events?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setEvents(data.events || []);
            } else {
                setEvents([]);
            }
        };
        fetchEvents();
    }, [calendarIds, displayedMonth, displayedYear]);

    const handlePrev = () => {
        if (displayedMonth != 0) {
            setDisplayedMonth(displayedMonth - 1);
            return;
        }
        setDisplayedYear(displayedYear - 1);
        setDisplayedMonth(11);
    }

    const handleNext = () => {
        if (displayedMonth != 11) {
            setDisplayedMonth(displayedMonth + 1);
            return;
        }
        setDisplayedYear(displayedYear + 1);
        setDisplayedMonth(0)
    }

    useEffect(() => {
        setDays(updateDays(new Date(displayedYear, displayedMonth, 1)))
        setMonthLabel(getMonthLabel(new Date(displayedYear, displayedMonth, 1)))
    }, [displayedMonth, displayedYear])

    return (
        <>
            <div className="text-center">
                <h3>
                   {monthLabel}
                </h3>
            </div>
            <div className="flex justify-between py-2">
                <button className="px-3 py-2 rounded
                    bg-blue-600 text-gray-100 border-transparent border-2
                    hover:bg-transparent hover:text-blue-600 hover:border-blue-600" onClick={handlePrev}>Prev</button>
                <button className="px-3 py-2 rounded
                    bg-blue-600 text-gray-100 border-transparent border-2
                    hover:bg-transparent hover:text-blue-600 hover:border-blue-600" onClick={handleNext}>Next</button>
            </div>
            {/* Calendar Wrapper */}
            <div className="w-full">
                {/* Weekday Header Row */}
                <div className="grid grid-cols-7 gap-[2px]">
                    {dateUtils.getWeekdays().map((day, idx) => (
                        <div key={idx} className={themeUtils.WEEKDAY_HEADER}>{day}</div>
                    ))}
                </div>
                {/* Date Cell Wrapper */}
                <div className="grid grid-cols-7 gap-[2px] mt-1">
                    {days.map((date, idx) => ( date.dayOfWeek < 0
                        ? <div key={idx}></div>
                        : <div key={idx} className="h-30 p-1 border box-border overflow-hidden" data-date={date.monthDay}>
                            <div className="text-right">
                                {date.monthDay?.getDate()}
                            </div>
                            <div>
                                {date.monthDay && events.filter(event => {
                                    if (!date.monthDay) {
                                        return false;
                                    }
                                    const eventStart = dateUtils.parseGoogleEvent(event).start;
                                    return (
                                        eventStart && eventStart.getDate() === date.monthDay.getDate()
                                    );
                                }).map(event => (
                                    <CalendarEventBox
                                        key={event.id}
                                        event={event}
                                        overlappingEvents={null}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default CalendarMonth;