import React from "react";

const Buttons = ({
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
      className={`px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Buttons;
