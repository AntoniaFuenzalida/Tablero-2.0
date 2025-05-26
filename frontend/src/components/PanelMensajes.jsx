import React, { useState, useEffect, useCallback } from "react";
import { Trash2, CheckCircle, Plus } from "lucide-react";
import TableroCadenasTexto from "../classes/TableroCadenasTexto";
import mqtt from "mqtt";

const PanelMensajes = ({ tableroId }) => {
  const [mensajeActual, setMensajeActual] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [editandoMensaje, setEditandoMensaje] = useState(false);

  const [client, setClient] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Desconectado");
  const mqttTopic = `${tableroId}`;
  const mqttServer = "ws://34.57.190.164:9001"; // Cambia esto a tu servidor MQTT

  // Función para verificar si el tablero actual es manual
  const esTableroManual = useCallback(() => {
    // Si el ID no es numérico o es diferente a los IDs de tableros regulares
    const savedTableroManual = localStorage.getItem("tableroManualId");
    return savedTableroManual === tableroId;
  }, [tableroId]);

  // Función para manejar mensajes de tableros manuales usando localStorage
  const getLocalStorageMensajes = useCallback(() => {
    const key = `mensajes_${tableroId}`;
    const savedMensajes = localStorage.getItem(key);
    if (savedMensajes) {
      try {
        const parsedMensajes = JSON.parse(savedMensajes);
        return parsedMensajes.map(msg => new TableroCadenasTexto(
          msg.id, 
          msg.tableroId || msg.tablero_id, 
          msg.texto
        ));
      } catch (error) {
        console.error("Error al parsear mensajes guardados:", error);
        return [];
      }
    }
    return [];
  }, [tableroId]);

  const saveLocalStorageMensajes = useCallback((mensajesArray) => {
    const key = `mensajes_${tableroId}`;
    localStorage.setItem(key, JSON.stringify(mensajesArray.map(m => m.toJSON())));
  }, [tableroId]);
  const fetchMensajes = useCallback(async () => {
    if (!tableroId) return;
    
    // Si es un tablero manual, usar localStorage
    if (esTableroManual()) {
      const localMensajes = getLocalStorageMensajes();
      setMensajes(localMensajes);
      return;
    }
    
    // Para tableros normales, usar la API
    try {
      const response = await fetch(`http://localhost:3001/api/mensajes/${tableroId}`);
      const data = await response.json();
      setMensajes(data.map((msg) => TableroCadenasTexto.fromJSON(msg)));
    } catch (error) {
      console.error("Error al obtener los mensajes:", error);
    }
  }, [tableroId, esTableroManual, getLocalStorageMensajes]);
  const enviarMensaje = async (texto) => {
    // Si es un tablero manual, guardar en localStorage
    if (esTableroManual()) {
      const nuevoMensajes = [...mensajes];
      const nuevoId = Date.now().toString(); // Generamos un ID único basado en el tiempo
      nuevoMensajes.push(new TableroCadenasTexto(nuevoId, tableroId, texto));
      setMensajes(nuevoMensajes);
      saveLocalStorageMensajes(nuevoMensajes);
      return;
    }
    
    // Para tableros normales, usar la API
    try {
      const response = await fetch(`http://localhost:3001/api/mensajes/${tableroId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ texto }),
      });
      if (!response.ok) throw new Error("Error al enviar el mensaje");
      fetchMensajes();
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };
  const editarMensaje = async (mensajeId, nuevoTexto) => {
    // Si es un tablero manual, editar en localStorage
    if (esTableroManual()) {
      const mensajesActualizados = mensajes.map(msg => 
        msg.id === mensajeId 
          ? new TableroCadenasTexto(msg.id, msg.tableroId, nuevoTexto) 
          : msg
      );
      setMensajes(mensajesActualizados);
      saveLocalStorageMensajes(mensajesActualizados);
      return;
    }
    
    // Para tableros normales, usar la API
    try {
      const response = await fetch(
        `http://localhost:3001/api/mensajes/${tableroId}/${mensajeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ texto: nuevoTexto }),
        }
      );
      if (!response.ok) throw new Error("Error al editar el mensaje");
      fetchMensajes();
    } catch (error) {
      console.error("Error al editar el mensaje:", error);
    }
  };
  const eliminarMensaje = async (mensajeId) => {
    // Si es un tablero manual, eliminar de localStorage
    if (esTableroManual()) {
      const mensajesFiltrados = mensajes.filter(msg => msg.id !== mensajeId);
      setMensajes(mensajesFiltrados);
      saveLocalStorageMensajes(mensajesFiltrados);
      return;
    }
    
    // Para tableros normales, usar la API
    try {
      const response = await fetch(
        `http://localhost:3001/api/mensajes/${tableroId}/${mensajeId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Error al eliminar el mensaje");
      setMensajes((prev) => prev.filter((msg) => msg.id !== mensajeId));
    } catch (error) {
      console.error("Error al eliminar el mensaje:", error);
    }  };useEffect(() => {
    if (!tableroId) return;
    
    // Para tableros manuales, cargar desde localStorage inicialmente
    if (esTableroManual()) {
      const localMensajes = getLocalStorageMensajes();
      setMensajes(localMensajes);
    }
    
    // Verificar si hay una IP personalizada configurada
    const usarIpPersonalizada = localStorage.getItem("usarIpPersonalizada") === "true";
    const ipPersonalizada = localStorage.getItem("mqttIpPersonalizada");
    
    // IP por defecto o personalizada
    const brokerUrl = (usarIpPersonalizada && ipPersonalizada) 
      ? ipPersonalizada : mqttServer;
      
    console.log(`[MQTT] Usando broker: ${brokerUrl}`);
    const mqttClient = mqtt.connect(brokerUrl);

    mqttClient.on("connect", () => {
      console.log("[MQTT] Conectado al broker");
      setConnectionStatus("Conectado");
      mqttClient.subscribe(mqttTopic, { qos: 0 }, (err) => {
        if (err) console.error(`[MQTT] Error al suscribirse a ${mqttTopic}:`, err);
        else console.log(`[MQTT] Suscrito a ${mqttTopic}`);
      });
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

    // Limpiar el estado al cambiar de tablero o desconectar
    return () => {
      // Resetear el estado del panel de mensajes
      setMensajeActual(null);
      setMensajes([]);
      setNuevoMensaje("");
      setEditandoMensaje(false);
        if (mqttClient) {
        mqttClient.unsubscribe(mqttTopic);
        mqttClient.end();
      }
    };
  }, [mqttTopic, tableroId, esTableroManual, getLocalStorageMensajes]);

  const publicarMensaje = (msg) => {
    if (client && client.connected) {
      client.publish(mqttTopic, msg.texto, { qos: 0 }, (err) => {
        if (err) console.error(`[MQTT] Error al publicar en ${mqttTopic}:`, err);
        else console.log(`[MQTT] Mensaje publicado en ${mqttTopic}:`, msg.texto);
      });
    } else {
      console.warn("[MQTT] Cliente no conectado");
    }
  };

  const agregarMensaje = () => {
    if (nuevoMensaje.trim() === "") return;
    enviarMensaje(nuevoMensaje);
    setNuevoMensaje("");
  };

  const seleccionarMensaje = (msg) => {
    setMensajeActual(msg);
    publicarMensaje(msg);
  };

  useEffect(() => {
    if (tableroId) {
      fetchMensajes();
    }
  }, [fetchMensajes, tableroId]);

  if (!tableroId) {
    return (
      <div className="p-6 text-center text-gray-600">
        Selecciona un tablero para comenzar...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="bg-white border-l-4 border-red-500 p-4 rounded shadow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-red-600 font-bold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" /> Mensaje Actual
          </h3>
          {!editandoMensaje && mensajeActual && (
            <button onClick={() => setEditandoMensaje(true)} className="text-sm text-blue-600 hover:underline">
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
                setMensajeActual((prev) => ({ ...prev, texto: nuevoTexto }));
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  editarMensaje(mensajeActual.id, mensajeActual.texto);
                  publicarMensaje(mensajeActual);
                  setEditandoMensaje(false);
                }}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 text-sm"
              >
                Guardar
              </button>
              <button onClick={() => setEditandoMensaje(false)} className="text-gray-600 hover:text-black text-sm">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700">
            {mensajeActual ? mensajeActual.texto : "No hay mensaje seleccionado"}
          </p>
        )}
        <div className="mt-2 text-xs text-gray-500">
          <p>Estado MQTT: <span className="font-semibold">{connectionStatus}</span></p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Mensajes</h3>
        <ul className="space-y-2">
          {mensajes.map((msg) => (
            <li
              onClick={() => seleccionarMensaje(msg)}
              title="Seleccionar como mensaje actual"

              key={msg.id}
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
