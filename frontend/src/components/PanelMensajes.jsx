import React, { useState, useEffect } from "react";
import { Trash2, CheckCircle, Plus } from "lucide-react";
import mqtt from "mqtt";
import TableroCadenasTexto from "../classes/TableroCadenasTexto";

const PanelMensajes = () => {
  const [mensajeActual, setMensajeActual] = useState(null); // Referencia al mensaje seleccionado
  const [mensajes, setMensajes] = useState([]); // Lista de TableroCadenasTexto
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [editandoMensaje, setEditandoMensaje] = useState(false);

  // Estado de conexión MQTT
  const [client, setClient] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Desconectado");



  const mqttTopic = "tablero/001";

  // Obtener los mensajes del servidor
  const fetchMensajes = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/mensajes/2"); // modificar el 1 donde realmente deberia de ir el id del tablero
      const data = await response.json();
      setMensajes(data.map((msg) => TableroCadenasTexto.fromJSON(msg))); // Convertir JSON a instancias de TableroCadenasTexto
    } catch (error) {
      console.error("Error al obtener los mensajes:", error);
      console.log(
        "Error al obtener los mensajes: No se pudo conectar con el servidor."
      );
    }
  };

  // Enviar un nuevo mensaje al servidor
  const enviarMensaje = async (texto) => {
    try {
      const response = await fetch("http://localhost:3001/api/mensajes/2", {// modificar el 1 donde realmente deberia de ir el id del tablero
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ texto }),
      });
      if (!response.ok) {
        throw new Error("Error al enviar el mensaje");
      }
      fetchMensajes(); // Actualizar la lista de mensajes después de enviar uno nuevo
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      console.log(
        "Error al enviar el mensaje: No se pudo conectar con el servidor."
      );
    }
  };

  // Editar un mensaje en el servidor
  const editarMensaje = async (mensajeId, nuevoTexto) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/mensajes/${mensajeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ texto: nuevoTexto }),
        }
      );
      if (!response.ok) {
        throw new Error("Error al editar el mensaje");
      }
      fetchMensajes(); // Actualizar la lista de mensajes después de editar uno
    } catch (error) {
      console.error("Error al editar el mensaje:", error);
      console.log(
        "Error al editar el mensaje: No se pudo conectar con el servidor."
      );
    }
  };

  // Eliminar un mensaje del servidor
  const eliminarMensaje = async (mensajeId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/mensajes/1/${mensajeId}`,//corregir el 1 ya que deberi ade ir la id del tablero
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Error al eliminar el mensaje");
      }
      setMensajes((prevMensajes) =>
        prevMensajes.filter((msg) => msg.id !== mensajeId)
      );
    } catch (error) {
      console.error("Error al eliminar el mensaje:", error);
      console.log(
        "Error al eliminar el mensaje: No se pudo conectar con el servidor."
      );
    }
  };

  // Conexión con MQTT
  useEffect(() => {
    const brokerUrl = "ws://172.27.208.1:9001"; // Reemplaza con la URL de tu broker MQTT/reemplazar por la ip que corresponde al servidor GCP
    const mqttClient = mqtt.connect(brokerUrl);

    mqttClient.on("connect", () => {
      console.log("[MQTT] Conectado al broker");
      setConnectionStatus("Conectado");
    });

    mqttClient.on("error", (err) => {
      console.error("[MQTT] Error:", err);
      setConnectionStatus("Error");
    });

    mqttClient.on("offline", () => {
      console.warn("[MQTT] Desconectado");
      setConnectionStatus("Desconectado");
    });

    setClient(mqttClient);

    return () => {
      if (mqttClient) mqttClient.end();
    };
  }, []);

  const publicarMensaje = (msg) => {
    if (client && client.connected) {
      client.publish(mqttTopic, msg.texto, { qos: 0 }, (err) => {
        if (err) {
          console.error("[MQTT] Error al publicar:", err);
        } else {
          console.log("[MQTT] Mensaje publicado:", msg);
        }
      });
    }
  };

  
  // Agregar un nuevo mensaje
  const agregarMensaje = () => {
    if (nuevoMensaje.trim() === "") return;
    enviarMensaje(nuevoMensaje);
    setNuevoMensaje("");
  };

  // Seleccionar un mensaje como el actual (ligado directamente)
  const seleccionarMensaje = (msg) => {
    setMensajeActual(msg); // Referencia directa al mensaje en la lista
    publicarMensaje(msg);
  };

  useEffect(() => {
    fetchMensajes();
  }, []);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* MENSAJE ACTUAL */}
      <div className="bg-white border-l-4 border-red-500 p-4 rounded shadow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-red-600 font-bold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Mensaje Actual
          </h3>
          {!editandoMensaje && mensajeActual && (
            <button
              onClick={() => setEditandoMensaje(true)}
              className="text-sm text-blue-600 hover:underline"
            >
              Editar
            </button>
          )}
        </div>

        {editandoMensaje ? (
          <div className="space-y-2">
            <textarea
              className="w-full border rounded p-2 text-sm"
              rows={2}
              value={mensajeActual.texto}
              onChange={(e) => {
                const nuevoTexto = e.target.value;
                setMensajeActual((prev) => ({
                  ...prev,
                  texto: nuevoTexto,
                }));
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  editarMensaje(mensajeActual.id, mensajeActual.texto);
                  publicarMensaje(mensajeActual); // Publicar el mensaje actualizado
                  setEditandoMensaje(false);
                }}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 text-sm"
              >
                Guardar
              </button>
              <button
                onClick={() => setEditandoMensaje(false)}
                className="text-gray-600 hover:text-black text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700">
            {mensajeActual ? mensajeActual.texto : "No hay mensaje seleccionado"}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Estado MQTT: <span className="font-semibold">{connectionStatus}</span>
        </p>
      </div>

      {/* MENSAJES PERSONALIZADOS */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Mensajes</h3>
        <ul className="space-y-2">
          {mensajes.map((msg) => (
            <li
              key={msg.id}
              onClick={() => seleccionarMensaje(msg)}
              className={`flex justify-between items-center px-4 py-2 rounded border ${
                mensajeActual && msg.id === mensajeActual.id
                  ? "bg-red-100 border-red-300"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => seleccionarMensaje(msg)}
                  className="text-green-600 hover:text-green-800"
                  title="Seleccionar como mensaje actual"
                >
                  <CheckCircle size={20} />
                </button>
                <span className="text-sm text-gray-800">{msg.texto}</span>
              </div>
              <button
                onClick={() => eliminarMensaje(msg.id)}
                className="text-red-600 hover:text-red-800"
                title="Eliminar"
              >
                <Trash2 size={20} />
              </button>
            </li>
          ))}
        </ul>

        {/* NUEVO MENSAJE */}
        <div className="flex items-center gap-2 mt-4">
          <input
            type="text"
            placeholder="Nuevo mensaje..."
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            className="w-full border px-3 py-2 rounded text-sm"
          />
          <button
            onClick={agregarMensaje}
            className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PanelMensajes;
