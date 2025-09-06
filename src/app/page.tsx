"use client";

import { FC, useEffect, useState } from "react";
import Calendar from "@/components/calendar/Calendar";
import { useAuth } from "@/context/oauth/AuthContext";

const Home: FC = () => {
  const { loggedIn } = useAuth();
  const [ selectedCalendars, setSelectedCalendars ] = useState<string[]>([]);

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

  return (
    <Calendar selectedCalendars={selectedCalendars} />
  );
};

export default Home;