'use client';

import { FC } from "react";
import CalendarMultiSelect from "@/components/calendar/MultiSelect";
import { useAuth } from "@/context/oauth/AuthContext";

const HomeFlyoutMenu: FC = () => {
  const { loggedIn } = useAuth();

  return (
    <>
      {loggedIn && (
        <CalendarMultiSelect
          loggedIn={loggedIn}
          selected={selectedCalendars}
          setSelected={setSelectedCalendars}
        />
      )}
    </>
  );
}

export default HomeFlyoutMenu;