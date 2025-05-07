import React from "react";

const Button = ({ children, onClick, type = "button", className = "" }) => (
  <button
    type={type}
    onClick={onClick}
    className={`w-full py-2 rounded-md transition ${className}`}
  >
    {children}
  </button>
);

export default Button;