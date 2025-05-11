import React, { useState, useEffect } from "react";
import { Trash2, CheckCircle, Plus } from "lucide-react";
import mqtt from "mqtt";

const PanelMensajes = () => {
  const [mensajeActual, setMensajeActual] = useState(
    "No me encuentro disponible, por favor vuelva más tarde."
  );

  const [mensajes, setMensajes] = useState([
    "En reunión, regreso a las 12:00.",
    "Estoy en clase, disponible después de las 16:00.",
    "Fuera de oficina, respondo correos mañana.",
  ]);

  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [editandoMensaje, setEditandoMensaje] = useState(false);
  const [mensajeTemp, setMensajeTemp] = useState(mensajeActual);

  //Estado de conexión MQTT
  const [client, setClient] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Desconectado");
  const mqttTopic = "tablero/001";

  //Conexion con MQTT
  useEffect(() => {
    const brokerUrl = "ws://192.168.1.10:9001"; // Reemplaza con la URL de tu broker MQTT o mejor dicho por la ip de tu pc
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

  
  //Publicar mensaje actual al topico cuando se cambia
  /*
  useEffect(() => {
      if (client && client.connected) {
        client.publish(mqttTopic, mensajeActual, {qos: 0}, (err) => {
          if (err) {
            console.error("[MQTT] Error al publicar:", err);
          } else {
            console.log("[MQTT] Mensaje publicado:", mensajeActual);
          }
        });
      }
    }, [mensajeActual, client]);
*/

  // Funcion para publicar manualmente un mensaje
  const publicarMensaje = (msg) => {
    if (client && client.connected) {
      client.publish(mqttTopic, msg, { qos: 0 }, (err) => {
        if (err) {
          console.error("[MQTT] Error al publicar:", err);
        } else {
          console.log("[MQTT] Mensaje publicado:", msg);
        }
      });
    }
  };

  const agregarMensaje = () => {
    if (nuevoMensaje.trim() === "") return;
    setMensajes([...mensajes, nuevoMensaje]);
    setNuevoMensaje("");
  };

  const eliminarMensaje = (index) => {
    const nuevosMensajes = mensajes.filter((_, i) => i !== index);
    setMensajes(nuevosMensajes);
  };

  const seleccionarMensaje = (msg) => {
    setMensajeActual(msg);
    publicarMensaje(msg);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* MENSAJE ACTUAL */}
      <div className="bg-white border-l-4 border-red-500 p-4 rounded shadow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-red-600 font-bold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Mensaje Actual
          </h3>
          {!editandoMensaje && (
            <button
              onClick={() => {
                setMensajeTemp(mensajeActual);
                setEditandoMensaje(true);
              }}
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
              value={mensajeTemp}
              onChange={(e) => setMensajeTemp(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setMensajeActual(mensajeTemp);
                  publicarMensaje(mensajeTemp); // <-- Agregamos esto
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
          <p className="text-gray-700">{mensajeActual}</p>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Estado MQTT: <span className="font-semibold">{connectionStatus}</span>
        </p>
      </div>

      {/* MENSAJES PERSONALIZADOS */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Mensajes Personalizados</h3>
        <ul className="space-y-2">
          {mensajes.map((msg, index) => (
            <li
              key={index}
              className={`flex justify-between items-center px-4 py-2 rounded border ${
                msg === mensajeActual
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
                <span className="text-sm text-gray-800">{msg}</span>
              </div>
              <button
                onClick={() => eliminarMensaje(index)}
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
