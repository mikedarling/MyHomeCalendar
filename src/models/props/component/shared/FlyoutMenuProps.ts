interface FlyoutMenuProps {
  loggedIn: boolean;
  selectedCalendars: string[];
  setSelectedCalendars: (ids: string[]) => void;
}

export default FlyoutMenuProps;