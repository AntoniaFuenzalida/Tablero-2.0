import React, { useState } from "react";
import SidebarDocente from "../components/SidebarDocente";
import PanelMensajes from "../components/PanelMensajes";
import HorarioAtencion from "../components/HorarioAtencion";
import ConfiguracionCuenta from "../components/ConfiguracionCuenta";
import logoUtalca from "../assets/logo-utalca.png";
import { useNavigate } from "react-router-dom";


const MainDocente = () => {
  const [pestanaActiva, setPestanaActiva] = useState("mensajes");

  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem("token"); // elimina token
    navigate("/login");               // redirige a login
  };


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <img src={logoUtalca} alt="Logo" className="h-8" />
          <h1 className="text-lg font-semibold text-red-700">Sistema Tablero 2.0 Utalca</h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative hover:text-red-700 transition">
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1 rounded-full">
              13
            </span>
            <span role="img" aria-label="bell">🔔</span>
          </button>
          <div className="flex items-center gap-2">
            <img
              src="https://ui-avatars.com/api/?name=Profesor+Ejemplo&background=be123c&color=fff"
              alt="Avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">Profesor Ejemplo</span>
          </div>
          <button
            onClick={cerrarSesion}
            className="text-sm text-red-600 hover:underline ml-4"
          >
            Cerrar sesión
          </button>

        </div>
      </header>

      {/* Body */}
      <div className="flex flex-col md:flex-row gap-6 px-6 py-6">
        {/* Sidebar */}
        <SidebarDocente />

        {/* Panel central */}
        <div className="flex-1 space-y-4">
          {/* Tabs */}
          <div className="flex gap-2 border-b pb-2">
            {[
              { key: "mensajes", label: "Mensajes" },
              { key: "horario", label: "Horario" },
              { key: "notificaciones", label: "Notificaciones" },
              { key: "configuracion", label: "Configuración" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setPestanaActiva(key)}
                className={`px-4 py-1 rounded-t-md text-sm font-medium transition ${
                  pestanaActiva === key
                    ? "bg-red-700 text-white shadow"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Contenido según pestaña */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {pestanaActiva === "mensajes" && <PanelMensajes />}
            {pestanaActiva === "horario" && <HorarioAtencion />}
            {pestanaActiva === "configuracion" && <ConfiguracionCuenta />}
            {pestanaActiva === "notificaciones" && (
              <p className="text-gray-600">Aquí irán las notificaciones.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDocente;