import React from "react";

const docentes = [
  {
    nombre: "María Rodríguez",
    correo: "maria.rodriguez@universidad.edu",
    departamento: "Matemáticas",
    estado: "En línea",
    dispositivo: "TB-001",
    ultimoAcceso: "Hace 5 minutos",
  },
  {
    nombre: "Juan Pérez",
    correo: "juan.perez@universidad.edu",
    departamento: "Física",
    estado: "Desconectado",
    dispositivo: "TB-002",
    ultimoAcceso: "Hace 2 horas",
  },
  {
    nombre: "Ana Gómez",
    correo: "ana.gomez@universidad.edu",
    departamento: "Química",
    estado: "En línea",
    dispositivo: "TB-003",
    ultimoAcceso: "Hace 10 minutos",
  },
  {
    nombre: "Carlos Sánchez",
    correo: "carlos.sanchez@universidad.edu",
    departamento: "Ingeniería",
    estado: "Desconectado",
    dispositivo: "TB-004",
    ultimoAcceso: "Hace 1 día",
  },
  {
    nombre: "Laura Martínez",
    correo: "laura.martinez@universidad.edu",
    departamento: "Biología",
    estado: "En línea",
    dispositivo: "TB-005",
    ultimoAcceso: "Ahora",
  },
];

const PanelGestionDocentes = () => {
  return (
    <div className="bg-white shadow border border-red-500 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-red-600 mb-1">Gestión de Docentes</h2>
      <p className="text-sm text-gray-500 mb-6">Administra los registros de docentes y sus dispositivos vinculados</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-t">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Departamento</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Dispositivo</th>
              <th className="px-4 py-2">Último Acceso</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {docentes.map((docente, index) => (
              <tr
                key={index}
                className="border-t hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-4 py-2">
                  <div className="font-medium text-gray-800">{docente.nombre}</div>
                  <div className="text-xs text-gray-500">{docente.correo}</div>
                </td>
                <td className="px-4 py-2">{docente.departamento}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      docente.estado === "En línea" ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                  {docente.estado}
                </td>
                <td className="px-4 py-2">{docente.dispositivo}</td>
                <td className="px-4 py-2">{docente.ultimoAcceso}</td>
                <td className="px-4 py-2">
                  <button className="text-red-600 hover:underline">Detalles</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PanelGestionDocentes;
