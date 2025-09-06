'use client'

import FlyoutMenu from "@/components/menu/FlyoutMenu";
import { useAuth } from "@/context/oauth/AuthContext";
import { FC, useEffect, useState } from "react"

const HomeHeader: FC = () => {
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
    <div className="flex flex-row relative items-center justify-between w-full">
      <div className="absolute left-0">
        <FlyoutMenu
          loggedIn={loggedIn}
          selectedCalendars={selectedCalendars}
          setSelectedCalendars={setSelectedCalendars}
        >
          
        </FlyoutMenu>
      </div>
      <h1 id="main-header-title" className="text-4xl flex-1 text-center">
        {title}
      </h1>
    </div>
  )
}

export default HomeHeader;