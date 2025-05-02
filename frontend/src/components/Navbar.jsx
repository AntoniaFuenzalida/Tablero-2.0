import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b">
      <div className="flex items-center space-x-2 text-xl font-semibold">
        <span className="text-2xl">🏠</span>
        <span>SistemaLED</span>
      </div>
      <div className="space-x-2">
        <Link to="/login">
          <button className="px-4 py-2 border rounded-md hover:bg-gray-100">
            Iniciar Sesión
          </button>
        </Link>
        <Link to="/registro">
          <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
            Registrarse
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;