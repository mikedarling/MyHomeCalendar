interface MultiSelectProps {
  loggedIn: boolean;
  selected: string[];
  setSelected: (ids: string[]) => void;
}

export default MultiSelectProps;
