"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../components/oauth/AuthContext";
import Calendar from "../components/calendar/calendar";
import FlyoutMenu from "../components/menu/FlyoutMenu";

const HomeContent = () => {
  const { loggedIn } = useAuth();
  const [ selectedCalendars, setSelectedCalendars ] = useState<string[]>([]);

  // On login, load saved calendar selection from localStorage
  useEffect(() => {
    if (!loggedIn || typeof window === "undefined") {
      return;
    }

    const saved = window.localStorage.getItem("selectedCalendars");
    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
      setSelectedCalendars(parsed);
      }
    } catch {}
  }, [loggedIn]);

  // Shrink header on scroll
  useEffect(() => {
    const header = document.getElementById("main-header");
    const title = document.getElementById("main-header-title");
    
    const onScroll = () => {
      const shrink = window.scrollY > 20;
      if (header) {
        header.style.paddingTop = shrink ? "0.5em" : "2.5em";
        header.style.paddingBottom = shrink ? "0.5em" : "1.25em";
        header.style.transition = "all 0.2s cubic-bezier(.4,0,.2,1)";
      }
      if (title) {
        title.style.fontSize = shrink ? "2rem" : "2.25rem";
        title.style.transition = "all 0.2s cubic-bezier(.4,0,.2,1)";
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const title = process.env.NEXT_PUBLIC_APPLICATION_TITLE;

  return (
    <>
      <header
        id="main-header"
        className="sticky top-0 z-50 p-10 pb-5 bg-sky-600 text-white text-center"
      >
        <div className="flex flex-row relative items-center justify-between w-full">
          <div className="absolute left-0">
            <FlyoutMenu
              loggedIn={loggedIn}
              selectedCalendars={selectedCalendars}
              setSelectedCalendars={setSelectedCalendars}
            />
          </div>
          <h1 id="main-header-title" className="text-4xl flex-1 text-center">
            {title}
          </h1>
        </div>
      </header>
      <main className="m-auto w-13/20 py-5">
        <Calendar
          selectedCalendars={selectedCalendars}
        />
      </main>
      <footer className="w-full bottom-0 bg-gray-200 text-gray-1000 text-center p-10"></footer>
    </>
  );
};

export default HomeContent;