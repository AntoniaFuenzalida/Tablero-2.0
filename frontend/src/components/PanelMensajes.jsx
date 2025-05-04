import React, { useState } from "react";
import { CheckCircle, Edit2, Trash2, Plus } from "lucide-react";

const PanelMensajes = () => {
  const [mensajeDefault, setMensajeDefault] = useState("No me encuentro disponible, por favor vuelva más tarde.");
  const [editandoDefault, setEditandoDefault] = useState(false);

  const [mensajesPersonalizados, setMensajesPersonalizados] = useState([
    "En reunión, regreso a las 12:00.",
    "Estoy en clase, disponible después de las 16:00.",
    "Fuera de oficina, respondo correos mañana.",
  ]);

  const [nuevoMensaje, setNuevoMensaje] = useState("");

  const handleEditarMensaje = (index, nuevoTexto) => {
    const actualizados = [...mensajesPersonalizados];
    actualizados[index] = nuevoTexto;
    setMensajesPersonalizados(actualizados);
  };

  const handleEliminar = (index) => {
    const actualizados = [...mensajesPersonalizados];
    actualizados.splice(index, 1);
    setMensajesPersonalizados(actualizados);
  };

  const agregarMensaje = () => {
    if (nuevoMensaje.trim() === "") return;
    setMensajesPersonalizados([...mensajesPersonalizados, nuevoMensaje.trim()]);
    setNuevoMensaje("");
  };

  return (
    <div className="space-y-8">
      {/* Mensaje por defecto */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-red-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-red-700 flex items-center gap-2">
            <CheckCircle size={20} className="text-green-600" />
            Mensaje Actual
          </h3>
          <button
            onClick={() => setEditandoDefault(!editandoDefault)}
            className="flex items-center text-sm text-gray-600 hover:text-red-700"
          >
            <Edit2 size={16} className="mr-1" />
            {editandoDefault ? "Guardar" : "Editar"}
          </button>
        </div>
        {editandoDefault ? (
          <textarea
            value={mensajeDefault}
            onChange={(e) => setMensajeDefault(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md text-sm resize-none"
            rows={3}
          />
        ) : (
          <p className="text-gray-700 text-sm">{mensajeDefault}</p>
        )}
      </div>

      {/* Mensajes Personalizados */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Mensajes Personalizados</h3>
        <ul className="space-y-3">
          {mensajesPersonalizados.map((mensaje, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-50 border border-gray-200 px-4 py-2 rounded-md text-sm"
            >
              <input
                type="text"
                value={mensaje}
                onChange={(e) => handleEditarMensaje(index, e.target.value)}
                className="flex-1 bg-transparent border-none focus:outline-none text-gray-700"
              />
              <button
                onClick={() => handleEliminar(index)}
                className="text-red-600 hover:text-red-800 ml-3"
                title="Eliminar mensaje"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>

        {/* Agregar nuevo mensaje */}
        <div className="flex mt-4 gap-2">
          <input
            type="text"
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            placeholder="Nuevo mensaje..."
            className="flex-1 px-3 py-2 border rounded-md text-sm"
          />
          <button
            onClick={agregarMensaje}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PanelMensajes;
