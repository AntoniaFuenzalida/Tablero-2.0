// src/components/AuthLayout.jsx
import React from "react";

const AuthLayout = ({ title, children }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center">{title}</h2>
      {children}
    </div>
  </div>
);

export default AuthLayout;