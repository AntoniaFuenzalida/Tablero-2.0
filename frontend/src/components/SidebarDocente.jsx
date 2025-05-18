import React, { useState, useEffect } from "react";

const SidebarDocente = ({ onTableroSeleccionado }) => {
  const [disponible, setDisponible] = useState(false);
  const [dispositivoId, setDispositivoId] = useState("");
  const [dispositivos, setDispositivos] = useState([]);
  const [loading, setLoading] = useState(true);
  // !!!! es importente tener que cambiar esto
  // ID del usuario, Estatica pero la id que se sea reactiva
  const usuario_id = 2; 

  useEffect(() => {
    // Función para obtener todos los tableros de la API dependiendo del usuario
    const fetchTableros = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/api/tableros?usuario_id=${usuario_id}`);
        
        if (!response.ok) {
          throw new Error(`Error al obtener tableros: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Formatear los datos para mostrarlos en el select
        const tablerosFormateados = data.map(tablero => ({
          id: `${tablero.id}`
        }));
        
        setDispositivos(tablerosFormateados);
          // Seleccionar el primer tablero por defecto si hay alguno
        if (tablerosFormateados.length > 0) {
          const primerTableroId = tablerosFormateados[0].id;
          setDispositivoId(primerTableroId);
          // Notificar al componente padre sobre el tablero seleccionado por defecto
          if (onTableroSeleccionado) {
            onTableroSeleccionado(primerTableroId);
          }
        }
      } catch (error) {
        console.error("Error al cargar los tableros:", error);
        setDispositivoId("TB-001");
      } finally {
        setLoading(false);
      }
    };    fetchTableros();
  }, [onTableroSeleccionado]);
  const handleCambioDispositivo = (e) => {
    const nuevoTableroId = e.target.value;
    setDispositivoId(nuevoTableroId);
    // Notificar al componente padre sobre el cambio
    if (onTableroSeleccionado) {
      onTableroSeleccionado(nuevoTableroId);
    }
  }

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
          <span className="text-green-600 font-semibold">
            {loading ? "● Conectando..." : "● Conectado"}
          </span>
        </p>
        <div className="flex flex-col mt-1">
          <label htmlFor="dispositivoId" className="text-sm text-gray-700 mb-1">
            Seleccionar tablero:
          </label>
          {loading ? (
            <p className="text-xs text-gray-500">Cargando tableros...</p>
          ) : (
            <>
              <select
                id="dispositivoId"
                value={dispositivoId}
                onChange={handleCambioDispositivo}
                className="font-mono text-gray-800 text-sm border border-gray-300 rounded p-1 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
              >
                {dispositivos.map((dispositivo) => (
                  <option key={dispositivo.id} value={dispositivo.id}>
                    {dispositivo.id}
                  </option>
                ))}
              </select>
              <p className="text-xs mt-1 text-gray-500">
                Tópico actual: <span className="font-mono font-medium">{dispositivoId}</span>
              </p>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SidebarDocente;