import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

const SidebarDocente = ({ onDisponibilidadCambiada, onTableroSeleccionado }) => {
  const { usuario, fetchUserData } = useUser();
  const [disponible, setDisponible] = useState(false);
  const [dispositivoId, setDispositivoId] = useState("");
  const [dispositivos, setDispositivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModalManual, setMostrarModalManual] = useState(false);
  const [tableroManualId, setTableroManualId] = useState("");

  const usuario_id = usuario?.id;

  useEffect(() => {
    if (usuario?.disponible !== undefined) {
      setDisponible(usuario.disponible);
    }
  }, [usuario]);  useEffect(() => {
    const fetchTableros = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/api/tableros?usuario_id=${usuario_id}`);
        if (!response.ok) throw new Error(`Error al obtener tableros: ${response.status}`);
        const data = await response.json();
        const tablerosFormateados = data.map(tablero => ({ id: `${tablero.id}` }));
        setDispositivos(tablerosFormateados);
        
        // Siempre seleccionar el primer tablero primero si existe
        if (tablerosFormateados.length > 0) {
          const primerTableroId = tablerosFormateados[0].id;
          setDispositivoId(primerTableroId);
          if (onTableroSeleccionado) onTableroSeleccionado(primerTableroId);
        }
      } catch (error) {
        console.error("Error al cargar los tableros:", error);
        setDispositivoId("TB-001");
      } finally {
        setLoading(false);
      }
    };

    if (usuario_id) fetchTableros();
  }, [usuario_id, onTableroSeleccionado]);

  const handleDisponibilidadChange = async () => {
    const nuevoEstado = !disponible;
    setDisponible(nuevoEstado);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/api/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ disponible: nuevoEstado }),
      });

      if (res.ok) {
        fetchUserData();
        if (onDisponibilidadCambiada) onDisponibilidadCambiada();
      } else {
        alert("Error al actualizar disponibilidad");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error de conexión con el servidor");
    }
  };
  const handleCambioDispositivo = (e) => {
    const nuevoTableroId = e.target.value;
    if (nuevoTableroId === "manual") {
      setMostrarModalManual(true);
      // No cambiamos el ID actual hasta que se confirme el tablero manual
    } else {
      setDispositivoId(nuevoTableroId);
      
      // Si estamos cambiando a un tablero normal, eliminamos cualquier tablero manual guardado
      localStorage.removeItem('tableroManualId');
      setTableroManualId("");
      
      if (onTableroSeleccionado) onTableroSeleccionado(nuevoTableroId);
    }
  };
  const handleConfirmarTableroManual = () => {
    if (tableroManualId.trim()) {
      const tableroId = tableroManualId.trim();
      setDispositivoId(tableroId);
      // Guardar en localStorage para mantener la selección entre sesiones
      localStorage.setItem('tableroManualId', tableroId);
      if (onTableroSeleccionado) onTableroSeleccionado(tableroId);
      setMostrarModalManual(false);
    }
  };

  return (
    <aside className="w-full md:w-72 flex flex-col gap-6">
      {/* Perfil */}
      <div className="border border-red-700 rounded-lg p-4 flex flex-col items-center gap-2">
        <div className="w-16 h-16 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-2xl font-bold">
          👤
        </div>
        <h2 className="text-sm font-semibold text-gray-800">
          {usuario?.nombre || "Profesor"}
        </h2>
        <p className="text-xs text-gray-500 text-center -mt-1">
          Departamento de {usuario?.departamento || "N/D"} <br />
          Oficina {usuario?.oficina || "N/D"}
        </p>

        <div className="mt-3 w-full">
          <label className="flex items-center justify-between text-sm font-medium text-gray-700">
            Disponibilidad
            <input
              type="checkbox"
              checked={disponible}
              onChange={handleDisponibilidadChange}
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
        <label className="block text-sm mb-1">Seleccionar Tablero:</label>

        {loading ? (
          <p className="text-gray-500 text-sm italic">Cargando tableros...</p>
        ) : (          <select
            value={dispositivos.some(d => d.id === dispositivoId) ? dispositivoId : "manual"}
            onChange={handleCambioDispositivo}
            className="w-full border border-gray-300 rounded p-1"
          >
            {dispositivos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.id}
              </option>
            ))}
            <option value="manual">Tablero manual</option>
          </select>
        )}

        <p>
          Panel Tablero:{" "}
          <span className="text-green-600 font-semibold">● Conectado</span>
        </p>
        <p>
          Última sincronización:{" "}
          <span className="text-gray-600">Hace 5 minutos</span>
        </p>        <p>
          ID del dispositivo:{" "}
          <span className="font-mono text-gray-800">{dispositivoId || "TB-001"}</span>
          {!dispositivos.some(d => d.id === dispositivoId) && dispositivoId && (
            <span className="text-xs ml-1 bg-blue-100 text-blue-800 px-1 rounded">manual</span>
          )}
        </p>
      </div>

      {/* Modal para ingresar ID de tablero manual */}
      {mostrarModalManual && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-medium mb-4">Ingresar ID de Tablero Manual</h3>
            <input
              type="text"
              value={tableroManualId}
              onChange={(e) => setTableroManualId(e.target.value)}
              placeholder="Ingrese ID del tablero"
              className="w-full border border-gray-300 rounded p-2 mb-4"
            />            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setMostrarModalManual(false);
                  setTableroManualId(""); // Limpiar el input al cancelar
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarTableroManual}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default SidebarDocente;
