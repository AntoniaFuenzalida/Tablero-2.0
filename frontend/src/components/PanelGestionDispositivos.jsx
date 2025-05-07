import React, { useState } from "react";

const docentesEjemplo = [
  "María Rodríguez",
  "Juan Pérez",
  "Ana Gómez",
  "Carlos Sánchez",
  "Laura Martínez",
];

const PanelGestionDispositivos = () => {
  const [dispositivos, setDispositivos] = useState([
    {
      id: "TB-001",
      ubicacion: "Edificio A - Oficina 101",
      estado: "En línea",
      docente: "María Rodríguez",
      ultimaConexion: "Hace 5 minutos",
    },
    {
      id: "TB-002",
      ubicacion: "Edificio B - Laboratorio Física",
      estado: "Desconectado",
      docente: "Juan Pérez",
      ultimaConexion: "Hace 2 horas",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [dispositivoAEliminar, setDispositivoAEliminar] = useState(null);
  const [nuevoDispositivo, setNuevoDispositivo] = useState({
    id: "",
    ubicacion: "",
    docente: "",
  });

  const agregarDispositivo = () => {
    if (!nuevoDispositivo.id || !nuevoDispositivo.ubicacion || !nuevoDispositivo.docente) return;
    setDispositivos([
      ...dispositivos,
      {
        ...nuevoDispositivo,
        estado: "En línea",
        ultimaConexion: "Ahora",
      },
    ]);
    setNuevoDispositivo({ id: "", ubicacion: "", docente: "" });
    setShowModal(false);
  };

  const eliminarDispositivo = () => {
    setDispositivos(dispositivos.filter((d) => d.id !== dispositivoAEliminar));
    setDispositivoAEliminar(null);
    setShowEliminarModal(false);
  };

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-red-600">Gestión de Dispositivos</h2>
          <p className="text-sm text-gray-600">Administra dispositivos LED vinculados al sistema</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Asignar Dispositivo
        </button>
      </div>

      {/* Tabla */}
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Ubicación</th>
            <th className="px-4 py-2 text-left">Estado</th>
            <th className="px-4 py-2 text-left">Docente Asignado</th>
            <th className="px-4 py-2 text-left">Última Conexión</th>
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {dispositivos.map((d, i) => (
            <tr key={i} className="border-t">
              <td className="px-4 py-2">{d.id}</td>
              <td className="px-4 py-2">{d.ubicacion}</td>
              <td className="px-4 py-2">
                <span
                  className={`inline-flex items-center ${
                    d.estado === "En línea" ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  ● {d.estado}
                </span>
              </td>
              <td className="px-4 py-2">{d.docente}</td>
              <td className="px-4 py-2">{d.ultimaConexion}</td>
              <td
                className="px-4 py-2 text-red-600 hover:underline cursor-pointer"
                onClick={() => {
                  setDispositivoAEliminar(d.id);
                  setShowEliminarModal(true);
                }}
              >
                Eliminar Conexión
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de asignar dispositivo */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Asignar nuevo dispositivo</h3>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium">ID del dispositivo</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={nuevoDispositivo.id}
                  onChange={(e) => setNuevoDispositivo({ ...nuevoDispositivo, id: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Ubicación</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={nuevoDispositivo.ubicacion}
                  onChange={(e) =>
                    setNuevoDispositivo({ ...nuevoDispositivo, ubicacion: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Docente Asignado</label>
                <select
                  className="w-full border px-3 py-2 rounded"
                  value={nuevoDispositivo.docente}
                  onChange={(e) =>
                    setNuevoDispositivo({ ...nuevoDispositivo, docente: e.target.value })
                  }
                >
                  <option value="">Selecciona un docente</option>
                  {docentesEjemplo.map((docente, idx) => (
                    <option key={idx} value={docente}>
                      {docente}
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

      {/* Modal de confirmación de eliminación */}
      {showEliminarModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Confirmar eliminación</h3>
            <p className="mb-6">¿Está seguro que desea eliminar la conexión del dispositivo <strong>{dispositivoAEliminar}</strong>?</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowEliminarModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={eliminarDispositivo}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelGestionDispositivos;
