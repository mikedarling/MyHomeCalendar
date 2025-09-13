import IconProps from "@/models/props/component/media/IconProps";

const MonthIcon = ({ height, width }: IconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Calendar with number 7"
    >
      {/* <!-- Calendar outline --> */}
      <rect x="3" y="4" width="18" height="18" rx="1" stroke="currentColor" strokeWidth="2" />
        {/* <!-- Binding rings --> */}
        <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        {/* <!-- Header separator --> */}
        <path d="M3 9h18" stroke="currentColor" strokeWidth="2" />
        {/* <!-- Day number --> */}
        <text
          x="12"
          y="15.5"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
          fontSize="11"
          fontWeight="700"
          fill="currentColor"
        >31</text>
    </svg> 
  )
}

export default MonthIcon;