// TODO :: Refactor.
"use client";

import { MouseEvent, FC, useEffect, useState } from "react";
import dateUtils from "@/utils/dateUtils";
import locationUtils from "@/utils/locationUtils";
import prefUtils from "@/utils/prefUtils";
import EventBoxProps from "@/models/props/component/calendar/EventBoxProps";

const EventBox: FC<EventBoxProps> = ({
  event,
  style,
  classes,
  overlappingEvents
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState<{ x: number; y: number; width: number } | null>(null);

  const MODAL_WIDTH = 260;
  const eventTimes = dateUtils.parseGoogleEvent(event);
  const location = locationUtils.parseGoogleEventLocation(event);
  const getBackground = (organizer: string) => {
    if (typeof window === "undefined") {
      return "#888888";
    }
    return prefUtils.getCalendarColor(window, organizer);
  };

  let boxClasses = "cursor-pointer overflow-hidden whitespace-nowrap text-ellipsis py-1 px-2 ml-[2px] text-xs rounded";
  if (classes) {
    boxClasses += " " + classes.join(" ");
  }
  let textClass = 'text-white';
  if (typeof window !== 'undefined' && event.organizer?.displayName) {
    const textMode = prefUtils.getCalendarTextMode(window, event.organizer.displayName);
    if (textMode === 'dark') {
      textClass = 'text-gray-800';
    }
  }
  boxClasses += ` ${textClass}`;

  const boxStyles = (style || {});
  boxStyles['background'] = getBackground(event.organizer.displayName);

  if (overlappingEvents && overlappingEvents.length > 1) {
    const width = 100.0 / (overlappingEvents.length) - 2.0;
    boxStyles['width'] = `${width}%`;

    const offset = overlappingEvents.findIndex((e) => e.id === event.id);
    boxStyles['left'] = (offset * width) + "%";
  } else {
    boxStyles['width'] = "98%";
  }

  useEffect(() => {
    const closeListener = () => setShowModal(false);
    window.addEventListener("calendar-eventbox-close", closeListener);
    return () => {
      window.removeEventListener("calendar-eventbox-close", closeListener);
    };
  }, []);

  useEffect(() => {
    if (!showModal) {
      return;
    }

    const handleResize = () => {
      setShowModal(false);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [showModal]);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    // Close all other modals
    window.dispatchEvent(new Event("calendar-eventbox-close"));
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    let x = rect.right;
    const y = rect.top;
    // If modal would overflow right, anchor to left
    if (x + MODAL_WIDTH > window.innerWidth) {
      x = rect.left - MODAL_WIDTH;
    }
    setModalPosition({ x, y, width: MODAL_WIDTH });
    setShowModal(true);
  };

  const eventStartTime = eventTimes.start?.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).replace(/ [AP]M/, "");

  return (
    <>
      <div
        key={event.id}
        className={boxClasses}
        style={boxStyles}
        title={event.title}
        onClick={handleClick}
      >
        <span className="font-bold">{eventStartTime}</span> {event.summary}
      </div>
      {showModal && modalPosition && (
        <div
          className="fixed bg-gray-100 p-4 text-gray-800 border border-gray-300 rounded shadow-md z-100"
          style={{
            top: modalPosition.y + 10,
            left: modalPosition.x - 40,
            minWidth: MODAL_WIDTH,
            maxWidth: MODAL_WIDTH,
            pointerEvents: "auto",
            transition: "opacity 0.1s",
          }}
        >
          <button
            className="absolute top-2 right-3 bg-transparent border-none text-size-md color-gray-600 cursor-pointer"
            aria-label="Close"
            onClick={() => setShowModal(false)}
          >
            ×
          </button>
          <div className="font-semibold text-md mb-1">{event.summary}</div>
          <div className="text-sm mb-1">
            {dateUtils.getTimeDisplay(eventTimes)}
          </div>
          {location && (
            <div className="text-sm">
              {location.name && <div>{location.name}</div>}
              {location.address && <div>{location.address}</div>}
              {(location.city || location.state || location.zip) && (
                <div>
                  {[location.city, location.state, location.zip]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default EventBox;
