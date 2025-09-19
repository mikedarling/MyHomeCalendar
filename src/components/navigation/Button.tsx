import { FC, PropsWithChildren } from "react";
import ButtonProps from "@/models/props/component/navigation/ButtonProps";
import themeUtils from "@/utils/themeUtils";

const Button: FC<PropsWithChildren<ButtonProps>> = ({ children, onClick, classNames, disabled }) => {
  const buttonClasses = themeUtils.compileButtonStyles(classNames || [], []);

  return (
    <button onClick={onClick} className={buttonClasses} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
