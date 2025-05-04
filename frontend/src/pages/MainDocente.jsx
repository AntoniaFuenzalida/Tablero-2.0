import React, { useState } from "react";
import SidebarDocente from "../components/SidebarDocente";
import PanelMensajes from "../components/PanelMensajes";
import HorarioAtencion from "../components/HorarioAtencion";
import ConfiguracionCuenta from "../components/ConfiguracionCuenta";
import logoUtalca from "../assets/logo-utalca.png";

const MainDocente = () => {
  const [pestanaActiva, setPestanaActiva] = useState("mensajes");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <img src={logoUtalca} alt="Logo Universidad de Talca" className="h-6" />
          <h1 className="text-lg font-semibold text-red-700">Sistema Tablero 2.0 Utalca</h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative">
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1 rounded-full">
              13
            </span>
            <span role="img" aria-label="bell">🔔</span>
          </button>
          <span className="text-sm font-medium text-gray-700">Profesor Ejemplo</span>
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
            {["mensajes", "horario", "notificaciones", "configuracion"].map((p) => (
              <button
                key={p}
                onClick={() => setPestanaActiva(p)}
                className={`px-4 py-1 rounded-t-md text-sm capitalize ${
                  pestanaActiva === p
                    ? "bg-red-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Contenido según pestaña */}
          {pestanaActiva === "mensajes" && <PanelMensajes />}
          {pestanaActiva === "horario" && <HorarioAtencion />}
          {pestanaActiva === "notificaciones" && (
            <div className="p-6 border rounded-md text-gray-600">
              (Aquí irían las notificaciones)
            </div>
          )}
          {pestanaActiva === "configuracion" && <ConfiguracionCuenta />}
        </div>
      </div>
    </div>
  );
};

export default MainDocente;
