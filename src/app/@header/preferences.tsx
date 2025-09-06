'use client'

import FlyoutMenu from "@/components/menu/FlyoutMenu";
import { useAuth } from "@/context/oauth/AuthContext";
import { env } from "process";
import { FC, useEffect, useState } from "react"

const PrefsHeader: FC = () => {
  const title = process.env.NEXT_PUBLIC_APPLICATION_TITLE;
  const { loggedIn } = useAuth()
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
    <header className="sticky top-0 z-50 p-10 pb-5 bg-sky-600 text-white text-center">
      <div className="flex flex-row relative items-center justify-between w-full">
        <div className="absolute left-0">
          <FlyoutMenu
            loggedIn={loggedIn}
            selectedCalendars={selectedCalendars}
            setSelectedCalendars={setSelectedCalendars}
          />
        </div>
        <h1 className="text-4xl flex-1 text-center">{title} - Preferences</h1>
      </div>
    </header>
  );
};

export default PrefsHeader;
