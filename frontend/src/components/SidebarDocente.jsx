import React, { useState } from "react";

const SidebarDocente = () => {
  const [disponible, setDisponible] = useState(false);

  return (
    <aside className="w-full md:w-72 flex flex-col gap-6">
      {/* Perfil */}
      <div className="border border-red-700 rounded-lg p-4 flex flex-col items-center gap-2">
        <div className="w-16 h-16 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-2xl font-bold">
          👤
        </div>
        <h2 className="text-sm font-semibold text-gray-800">Profesor Ejemplo</h2>
        <p className="text-xs text-gray-500 text-center -mt-1">
          Departamento de Matemáticas
        </p>

        <div className="mt-3 w-full">
          <label className="flex items-center justify-between text-sm font-medium text-gray-700">
            Disponibilidad
            <input
              type="checkbox"
              checked={disponible}
              onChange={() => setDisponible(!disponible)}
              className="ml-2 h-5 w-5 accent-red-600"
            />
          </label>
          <p className="text-xs mt-1 text-gray-600">
            Estado actual:{" "}
            <span className={disponible ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
              {disponible ? "Disponible" : "No disponible"}
            </span>
          </p>
        </div>
      </div>

      {/* Estado del dispositivo */}
      <div className="border rounded-lg p-4 text-sm text-gray-700 space-y-2">
        <h3 className="font-semibold text-sm">Estado del Dispositivo</h3>
        <p>
          Panel Tablero:{" "}
          <span className="text-green-600 font-semibold">● Conectado</span>
        </p>
        <p>
          Última sincronización:{" "}
          <span className="text-gray-600">Hace 5 minutos</span>
        </p>
        <p>
          ID del dispositivo:{" "}
          <span className="font-mono text-gray-800">TB-001</span>
        </p>
      </div>
    </aside>
  );
};

export default SidebarDocente;