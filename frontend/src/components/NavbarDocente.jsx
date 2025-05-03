import React from "react";
import { Bell } from "lucide-react"; // Usamos un ícono minimalista
import logo from "../assets/logo-utalca.png"; // reemplázalo si tu logo tiene otro nombre

const NavbarDocente = () => {
  return (
    <header className="w-full border-b">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Izquierda: logo y título */}
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo Universidad de Talca" className="h-6 md:h-8" />
          <h1 className="text-lg md:text-xl font-semibold text-red-700">
            Sistema Tablero 2.0 Utalca
          </h1>
        </div>

        {/* Menú de navegación */}
        <ul className="hidden md:flex gap-6 text-sm text-gray-800 font-medium">
          <li className="cursor-pointer text-red-700 font-semibold">Mensajes</li>
          <li className="cursor-pointer hover:text-red-700">Horario</li>
          <li className="cursor-pointer hover:text-red-700">Notificaciones</li>
          <li className="cursor-pointer hover:text-red-700">Configuración</li>
        </ul>

        {/* Notificación + perfil */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="h-5 w-5 text-gray-700" />
            <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-1">
              1
            </span>
          </div>
          <span className="text-sm text-gray-800 font-medium hidden sm:block">
            Profesor Ejemplo
          </span>
        </div>
      </nav>
    </header>
  );
};

export default NavbarDocente;