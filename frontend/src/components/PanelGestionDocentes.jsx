import React from "react";

const PanelGestionDocentes = ({ docentes, recargarDocentes }) => {
  return (
    <div className="bg-white shadow border border-red-500 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-red-600 mb-1">
        Gestión de Docentes
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Administra los registros de docentes y sus dispositivos vinculados.
      </p>

      {/* Botón opcional para recargar lista */}
      {/* <button onClick={recargarDocentes} className="mb-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
        Refrescar lista
      </button> */}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-t">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Departamento</th>
              <th className="px-4 py-2">Estado usuario</th>
              <th className="px-4 py-2">Oficina</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {docentes.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                  No hay docentes registrados.
                </td>
              </tr>
            ) : (
              docentes.map((docente, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-4 py-2">
                    <div className="font-medium text-gray-800">
                      {docente.nombre}
                    </div>
                    <div className="text-xs text-gray-500">
                      {docente.correo}
                    </div>
                  </td>
                  <td className="px-4 py-2">{docente.departamento}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          docente.disponible
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      />
                      <span>
                        {docente.disponible ? "En línea" : "Desconectado"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2">{docente.oficina || "—"}</td>
                  <td className="px-4 py-2">
                    <button className="text-red-600 hover:underline">
                      Detalles
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PanelGestionDocentes;
