'use client';

import { FC } from "react";
import CalendarSelector from "@/components/calendar/CalendarSelector";
import { useAuth } from "@/context/oauth/AuthContext";

const HomeFlyoutMenu: FC = () => {
  const { loggedIn } = useAuth();

  return (
    <>
      {loggedIn && (
        <CalendarSelector />
      )}
    </>
  );
}

export default HomeFlyoutMenu;