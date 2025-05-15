import React, { useState, useEffect } from "react";

const PanelGestionDispositivos = ({ usuarioId }) => {
  const [dispositivos, setDispositivos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [nuevoDispositivo, setNuevoDispositivo] = useState({
    id: "",
    docente_id: "",
  });
  // Función para obtener los tableros desde la API
  const obtenerDispositivos = async () => {
    setCargando(true);
    try {
      const response = await fetch("http://localhost:3001/api/tableros", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Error al obtener los tableros");
      }

      const data = await response.json();
      
      const dispositivosFormateados = data.map(tablero => ({
        id: tablero.id,
        id_formato: `TB-${tablero.id.toString().padStart(3, '0')}`,
        usuario_id: tablero.usuario_id,
        nombre_usuario: tablero.nombre_usuario || "Sin asignar",
        estado: tablero.estado || "Desconectado",
        ultima_conexion: tablero.ultima_conexion || "Nunca"
      }));
      
      setDispositivos(dispositivosFormateados);
      setError(null);
    } catch (err) {
      console.error("Error:", err);
      setError("No se pudieron cargar los dispositivos. " + err.message);
    } finally {
      setCargando(false);
    }
  };

  // Función para obtener la lista de docentes
  const obtenerDocentes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los docentes");
      }

      const data = await response.json();
      // Filtramos solo los usuarios con rol "docente" si existe ese campo
      const docentesList = data.filter(user => user.rol === "docente" || !user.rol);
      setDocentes(docentesList);
    } catch (err) {
      console.error("Error al obtener docentes:", err);
    }
  };

  useEffect(() => {
    obtenerDispositivos();
    obtenerDocentes();
  }, []);
  const agregarDispositivo = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/tableros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_id: nuevoDispositivo.docente_id || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear el tablero");
      }

      // Actualiza la lista después de agregar
      obtenerDispositivos();
      setShowModal(false);
      setNuevoDispositivo({ id: "", docente_id: "" });
    } catch (err) {
      console.error("Error:", err);
      setError("No se pudo agregar el dispositivo. " + err.message);
    }
  };
  const eliminarDispositivo = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este tablero?")) {
      try {
        const response = await fetch(`http://localhost:3001/api/tableros/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Error al eliminar el tablero");
        }

        // Actualiza la lista después de eliminar
        obtenerDispositivos();
      } catch (err) {
        console.error("Error:", err);
        setError("No se pudo eliminar el dispositivo. " + err.message);
      }
    }
  };
  const actualizarAsignacion = async (id, docente_id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/tableros/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_id: docente_id || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el tablero");
      }

      // Actualiza la lista después de actualizar
      obtenerDispositivos();
    } catch (err) {
      console.error("Error:", err);
      setError("No se pudo actualizar el dispositivo. " + err.message);
    }
  };
  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-red-600">Gestión de Dispositivos</h2>
          <p className="text-sm text-gray-600">Administra tableros LED vinculados al sistema</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Nuevo Tablero
        </button>
      </div>

      {/* Estado de carga y error */}
      {cargando && <p className="text-center py-4">Cargando dispositivos...</p>}
      {error && <p className="text-center py-4 text-red-500">{error}</p>}

      {/* Tabla */}
      {!cargando && !error && (
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Docente Asignado</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Última Conexión</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dispositivos.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                  No hay dispositivos registrados
                </td>
              </tr>
            ) : (
              dispositivos.map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="px-4 py-2 font-mono">{d.id_formato}</td>
                  <td className="px-4 py-2">
                    <select 
                      className="border rounded p-1"
                      value={d.usuario_id || ""}
                      onChange={(e) => actualizarAsignacion(d.id, e.target.value)}
                    >
                      <option value="">Sin asignar</option>
                      {docentes.map((docente) => (
                        <option key={docente.id} value={docente.id}>
                          {docente.nombre}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center ${
                        d.estado === "Conectado" ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      ● {d.estado}
                    </span>
                  </td>
                  <td className="px-4 py-2">{d.ultima_conexion}</td>
                  <td className="px-4 py-2 flex justify-center space-x-2">
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      title="Detalles"
                    >
                      📋
                    </button>
                    <button
                      onClick={() => eliminarDispositivo(d.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Modal para nuevo dispositivo */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Crear nuevo tablero</h3>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium">Docente Asignado</label>
                <select
                  className="w-full border px-3 py-2 rounded"
                  value={nuevoDispositivo.docente_id}
                  onChange={(e) =>
                    setNuevoDispositivo({ ...nuevoDispositivo, docente_id: e.target.value })
                  }
                >
                  <option value="">Sin asignar</option>
                  {docentes.map((docente) => (
                    <option key={docente.id} value={docente.id}>
                      {docente.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={agregarDispositivo}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelGestionDispositivos;