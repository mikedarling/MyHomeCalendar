'use client';

import { FC } from "react";
import { usePathname } from "next/navigation"; 
import CalendarSelector from "@/components/calendar/CalendarSelector";
import { useAuth } from "@/context/oauth/AuthContext";
import next from "next";

const HomeFlyoutMenu: FC = () => {
  const { loggedIn } = useAuth();
  const path = usePathname();
  return (
    <>
      {path == "/" && loggedIn && (
        <CalendarSelector />
      )}
    </>
  );
}

export default HomeFlyoutMenu;