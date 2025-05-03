import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

const PanelMensajes = () => {
  const [mensajeDefecto, setMensajeDefecto] = useState(
    "No disponible en este momento. Horario de atención: Lunes a Viernes de 10:00 a 12:00"
  );

  const [mensajes, setMensajes] = useState([
    "Disponible para consultas",
    "En reunión, vuelvo pronto",
    "Vuelvo en 5 minutos",
  ]);

  const [nuevoMensaje, setNuevoMensaje] = useState("");

  const añadirMensaje = () => {
    if (nuevoMensaje.trim()) {
      setMensajes([...mensajes, nuevoMensaje]);
      setNuevoMensaje("");
    }
  };

  const eliminarMensaje = (index) => {
    const copia = [...mensajes];
    copia.splice(index, 1);
    setMensajes(copia);
  };

  return (
    <section className="flex-1 space-y-6">
      {/* Mensaje por defecto */}
      <div className="border border-red-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-red-700">Mensaje por Defecto</h3>
        <p className="text-sm text-gray-500 mb-3">
          Este mensaje se mostrará cuando no estés disponible
        </p>
        <textarea
          className="w-full border rounded-md p-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-red-600"
          rows={3}
          value={mensajeDefecto}
          onChange={(e) => setMensajeDefecto(e.target.value)}
        />
        <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
          Guardar Mensaje
        </button>
      </div>

      {/* Mensajes personalizados */}
      <div className="border border-red-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-red-700">Mensajes Personalizados</h3>
        <p className="text-sm text-gray-500 mb-4">
          Configure mensajes predefinidos para diferentes situaciones
        </p>

        <div className="space-y-2 mb-4">
          {mensajes.map((msg, index) => (
            <div
              key={index}
              className="flex items-center justify-between border rounded-md px-3 py-2 text-sm"
            >
              <span>{msg}</span>
              <div className="flex gap-2">
                <button className="text-sm text-white bg-gray-800 px-2 py-1 rounded hover:bg-black">
                  Activar
                </button>
                <Pencil size={16} className="cursor-pointer text-gray-600 hover:text-black" />
                <Trash2
                  size={16}
                  className="cursor-pointer text-gray-600 hover:text-red-600"
                  onClick={() => eliminarMensaje(index)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Escriba un nuevo mensaje personalizado"
            className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
          />
          <button
            onClick={añadirMensaje}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Añadir
          </button>
        </div>
      </div>
    </section>
  );
};

export default PanelMensajes;
