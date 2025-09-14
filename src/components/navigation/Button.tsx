import { FC, PropsWithChildren } from "react";
import ButtonProps from "@/models/props/component/navigation/ButtonProps";
import themeUtils from "@/utils/themeUtils";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const menuOpen = "bg-white text-gray-800 border-none rounded shadow-md p-2 cursor-pointer flex items-center justify-center min-w-[40px] min-h-[40px]"

const Button: FC<PropsWithChildren<ButtonProps>> = ({ children, onClick, classNames, disabled }) => {
  const buttonClasses = themeUtils.compileButtonStyles(classNames || [], []);

  return (
    <button onClick={onClick} className={buttonClasses} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
