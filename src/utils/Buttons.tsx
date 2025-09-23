import React from "react";

type ButtonsProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // <-- optional
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>; // allow all button props

const Buttons: React.FC<ButtonsProps> = ({
  children,
  type = "button",
  className = "",
  onClick,
  disabled = false,
  ...props
}) => {
  return (
    <button
      type={type}
      className={`px-4 py-2 rounded ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Buttons;
