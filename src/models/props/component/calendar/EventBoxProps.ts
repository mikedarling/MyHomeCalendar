import { CSSProperties, MouseEvent } from "react";

interface EventBoxProps {
  event: any;
  style?: CSSProperties;
  classes?: string[];
  overlappingEvents: any[] | null;
  onMouseEnter?: (e: MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onClick?: (e: MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export default EventBoxProps;