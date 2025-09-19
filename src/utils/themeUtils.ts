import StyleMap from "@/models/data/theme/StyleMap";

const WEEKDAY_HEADER = "bg-gray-600 text-white py-2 text-center font-bold";
const DISPLAY_TITLE = "text-lg font-bold";

// Button color classes
export const BUTTON_PRIMARY = "bg-blue-600 text-white hover:bg-blue-700";
export const BUTTON_SECONDARY = "bg-blue-500 text-white";
export const BUTTON_DISABLED = "bg-blue-200 text-gray-400 cursor-not-allowed";

const DEFAULT_BUTTON_STYLE_MAPS: StyleMap[] = [
  {
    key : "text",
    styles : [
      { name: "default", value: "gray-100" },
      { name: "disabled", value: "gray-200" }
    ]
  },
  {
    key : "bg",
    styles : [
      { name: "default", value: "sky-600" },
      { name: "hover", value: "blue-700" },
      { name: "disabled", value: "blue-200" }
    ]
  }
];

const DEFAULT_BUTTON_STYLES: string = "rounded border-none cursor-pointer disabled:cursor-not-allowed";

const compileButtonStyles = (styleMaps: StyleMap[], buttonStyles: string[] | undefined): string => {
  let result = DEFAULT_BUTTON_STYLES;
  if (buttonStyles && buttonStyles.length > 0) {
    result += ` ${buttonStyles.join(" ")}`;
  }

  DEFAULT_BUTTON_STYLE_MAPS.forEach(styleMap => {
    // Find the incoming style map with the same key
    const pairedMap = styleMaps.find(s => s.key === styleMap.key);
    if (!pairedMap) {
      // No incoming styles for this key, use defaults
      styleMaps.push(styleMap);
    } else {
      styleMap.styles.forEach(styleGroup => {
        const pairedStyle = pairedMap.styles.find(s => s.name === styleGroup.name);
        if (!pairedStyle) {
          // No incoming style for this style group, use default
          pairedMap.styles.push(styleGroup);
        }
      });
    }
  });

  styleMaps.forEach(styleMap => {
    styleMap.styles.forEach(styleGroup => {
      if (styleGroup.name === "default") {
        result += ` ${styleMap.key}-${styleGroup.value}`;
      } else {
        result += ` ${styleGroup.name}:${styleMap.key}-${styleGroup.value}`;
      }
    });
  });

  return result.trim();
}

export default {
    WEEKDAY_HEADER,
    DISPLAY_TITLE,
    compileButtonStyles
}