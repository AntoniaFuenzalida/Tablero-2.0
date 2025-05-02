// src/components/Input.jsx
import React from "react";

const Input = ({ label, type = "text", name, value, onChange, placeholder }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
    />
  </div>
);

export default Input;