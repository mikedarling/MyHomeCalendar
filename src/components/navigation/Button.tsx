import { FC, PropsWithChildren } from "react";
import ButtonProps from "@/models/props/component/navigation/ButtonProps";

const menuOpen = "bg-white text-gray-800 border-none rounded shadow-md p-2 cursor-pointer flex items-center justify-center min-w-[40px] min-h-[40px]"

const Button: FC<PropsWithChildren<ButtonProps>> = ({ children, onClick, classNames }) => {
  const buttonClasses = `bg-blue-500 text-white py-2 px-4 rounded ${classNames}`;

  return (
    <button onClick={onClick} className={buttonClasses}>
      {children}
    </button>
  );
};

export default Button;
