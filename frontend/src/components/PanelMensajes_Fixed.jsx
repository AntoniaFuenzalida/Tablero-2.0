import React, { useState, useEffect, useCallback } from "react";
import { Trash2, CheckCircle, Plus } from "lucide-react";
import { RgbColorPicker } from "react-colorful";
import TableroCadenasTexto from "../classes/TableroCadenasTexto";
import mqtt from "mqtt";
import { useUser } from "../context/UserContext";

const PanelMensajes = ({ tableroId }) => {  
  const { usuario } = useUser();
  const [mensajeActual, setMensajeActual] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [editandoMensaje, setEditandoMensaje] = useState(false);
  const [velocidad, setVelocidad] = useState(100);
  const [color, setColor] = useState({ r: 255, g: 255, b: 255 });
  const [formatoJson, setFormatoJson] = useState(true); // Controla si se envía en formato JSON o texto plano
  const [mensajeAnterior, setMensajeAnterior] = useState(null); // Almacena el mensaje previo antes de mostrar el horario
  const [horarios, setHorarios] = useState([]);
  const [modoHorarioActivo, setModoHorarioActivo] = useState(false);

  const [client, setClient] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Desconectado");
  const mqttTopic = `${tableroId}`;
  const mqttServer = "ws://35.184.184.109:9001"; // Cambia esto a tu servidor MQTT

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

  // Publicar mensaje al tablero mediante MQTT
  const publicarMensaje = useCallback((msg) => {
    if (client && client.connected) {
      if (formatoJson) {
        // Publicar en formato JSON - usar los valores actuales del estado
        const mensajeJson = {
          texto1: msg.texto,
          texto2: msg.texto,
          velocidad: "x"+velocidad,
          animacion: "PA_SCROLL_LEFT"
        };

        client.publish(mqttTopic, JSON.stringify(mensajeJson), { qos: 0 }, (err) => {
          if (err) console.error(`[MQTT] Error al publicar en ${mqttTopic}:`, err);
          else console.log(`[MQTT] Mensaje JSON publicado en ${mqttTopic}:`, mensajeJson);
        });
      } else {
        // Publicar en formato texto plano (tradicional)
        client.publish(mqttTopic, msg.texto, { qos: 0 }, (err) => {
          if (err) console.error(`[MQTT] Error al publicar en ${mqttTopic}:`, err);
          else console.log(`[MQTT] Mensaje texto plano publicado en ${mqttTopic}:`, msg.texto);
        });
      }
    } else {
      console.warn("[MQTT] Cliente no conectado");
    }
  }, [client, formatoJson, mqttTopic, velocidad]);

  const enviarMensaje = async (texto) => {
    // Si es un tablero manual, guardar en localStorage
    if (esTableroManual()) {
      const nuevoMensajes = [...mensajes];
      const nuevoId = Date.now().toString(); // Generamos un ID único basado en el tiempo
      nuevoMensajes.push(new TableroCadenasTexto(nuevoId, tableroId, texto));
      setMensajes(nuevoMensajes);
      saveLocalStorageMensajes(nuevoMensajes);
      
      // Publicar mensaje según formato seleccionado
      if (client && client.connected) {
        if (formatoJson) {
          // Formato JSON
          const mensajeJson = {
            texto1: texto,
            texto2: texto,
            velocidad: velocidad,
            animacion: "PA_SCROLL_LEFT"
          };
          
          client.publish(mqttTopic, JSON.stringify(mensajeJson), { qos: 0 }, (err) => {
            if (err) console.error(`[MQTT] Error al publicar en ${mqttTopic}:`, err);
            else console.log(`[MQTT] Mensaje JSON publicado en ${mqttTopic}:`, mensajeJson);
          });
        } else {
          // Formato texto plano
          client.publish(mqttTopic, texto, { qos: 0 }, (err) => {
            if (err) console.error(`[MQTT] Error al publicar en ${mqttTopic}:`, err);
            else console.log(`[MQTT] Mensaje texto plano publicado en ${mqttTopic}:`, texto);
          });
        }
      }
      
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
      
      // Publicar mensaje según formato seleccionado
      if (client && client.connected) {
        if (formatoJson) {
          // Formato JSON
          const mensajeJson = {
            texto1: texto,
            texto2: texto,
            velocidad: velocidad,
            animacion: "PA_SCROLL_LEFT"
          };
          
          client.publish(mqttTopic, JSON.stringify(mensajeJson), { qos: 0 }, (err) => {
            if (err) console.error(`[MQTT] Error al publicar en ${mqttTopic}:`, err);
            else console.log(`[MQTT] Mensaje JSON publicado en ${mqttTopic}:`, mensajeJson);
          });
        } else {
          // Formato texto plano
          client.publish(mqttTopic, texto, { qos: 0 }, (err) => {
            if (err) console.error(`[MQTT] Error al publicar en ${mqttTopic}:`, err);
            else console.log(`[MQTT] Mensaje texto plano publicado en ${mqttTopic}:`, texto);
          });
        }
      }
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
    }
  };

  // Función para cargar los horarios de atención del usuario
  const cargarHorarios = useCallback(async () => {
    if (!usuario || !usuario.id) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/horario`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Filtrar solo los horarios activos
        const horariosActivos = data.filter(h => h.activo);
        setHorarios(horariosActivos);
        console.log("✅ Horarios cargados:", horariosActivos);
      } else {
        console.error("❌ Error al cargar horarios");
        setHorarios([]);
      }
    } catch (error) {
      console.error("❌ Error en la solicitud de horarios:", error);
      setHorarios([]);
    }
  }, [usuario]);

  // Función para verificar si estamos dentro de un horario de atención
  const verificarHorarioActivo = useCallback(() => {
    if (!horarios.length) return false;
    
    const ahora = new Date();
    const diaSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][ahora.getDay()];
    const horaActual = ahora.getHours().toString().padStart(2, '0') + ':' + 
                      ahora.getMinutes().toString().padStart(2, '0');
    
    // Verificar si hay algún horario activo para el día actual
    const horarioHoy = horarios.find(h => h.diaSemana === diaSemana);
    
    if (horarioHoy) {
      const horaInicio = horarioHoy.hora;
      const horaFin = horarioHoy.horaFin;
      
      // Verificar si la hora actual está dentro del rango
      if (horaActual >= horaInicio && horaActual <= horaFin) {
        return { activo: true, horario: horarioHoy };
      }
    }
    
    return { activo: false, horario: null };
  }, [horarios]);

  // Función para gestionar el mensaje de horario de atención
  const gestionarMensajeHorario = useCallback(() => {
    const estadoHorario = verificarHorarioActivo();
    
    // Si estamos en horario de atención y no estaba activo antes
    if (estadoHorario.activo && !modoHorarioActivo) {
      // Guardar el mensaje actual antes de cambiarlo
      if (mensajeActual) {
        setMensajeAnterior(mensajeActual);
      }
      
      // Crear el mensaje de horario de atención
      const textoHorario = `HORARIO ATENCIÓN ${estadoHorario.horario.hora} - ${estadoHorario.horario.horaFin}`;
      
      // Crear un mensaje temporal (no se guarda en la base de datos)
      const mensajeHorario = new TableroCadenasTexto(
        'horario-temp', 
        tableroId, 
        textoHorario
      );
      
      // Actualizar el mensaje actual y publicarlo
      setMensajeActual(mensajeHorario);
      setTimeout(() => publicarMensaje(mensajeHorario), 0);
      setModoHorarioActivo(true);
      
      console.log("🕒 Activado mensaje de horario:", textoHorario);
    } 
    // Si salimos del horario de atención y estaba activo antes
    else if (!estadoHorario.activo && modoHorarioActivo) {
      // Restaurar el mensaje anterior
      if (mensajeAnterior) {
        setMensajeActual(mensajeAnterior);
        setTimeout(() => publicarMensaje(mensajeAnterior), 0);
        console.log("🔄 Restaurado mensaje anterior");
      }
      setModoHorarioActivo(false);
    }
  }, [modoHorarioActivo, mensajeActual, mensajeAnterior, publicarMensaje, tableroId, verificarHorarioActivo]);

  // Actualiza velocidad y publica el mensaje
  const actualizarVelocidad = (nuevoValor) => {
    setVelocidad(nuevoValor);
    if (mensajeActual) {
      // Crear una copia actualizada del mensaje con la nueva velocidad
      const mensajeActualizado = { ...mensajeActual };
      setTimeout(() => publicarMensaje(mensajeActualizado), 0);
    }
  };

  // Actualiza color y publica el mensaje
  const actualizarColor = (nuevoColor) => {
    setColor(nuevoColor);
    if (mensajeActual) {
      // Crear una copia actualizada del mensaje con el nuevo color
      const mensajeActualizado = { ...mensajeActual };
      setTimeout(() => publicarMensaje(mensajeActualizado), 0);
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
  }, [mqttTopic, tableroId, esTableroManual, getLocalStorageMensajes, mqttServer]);

  useEffect(() => {
    if (tableroId) {
      fetchMensajes();
    }
  }, [fetchMensajes, tableroId]);

  // Cargar horarios cuando cambie el usuario
  useEffect(() => {
    if (usuario && usuario.id) {
      cargarHorarios();
    }
  }, [usuario, cargarHorarios]);

  // Verificar horarios cada minuto
  useEffect(() => {
    // Verificar al iniciar
    gestionarMensajeHorario();
    
    // Configurar intervalo para verificar cada minuto
    const intervalo = setInterval(() => {
      gestionarMensajeHorario();
    }, 60000); // 60 segundos
    
    return () => clearInterval(intervalo);
  }, [gestionarMensajeHorario]);

  if (!tableroId) {
    return (
      <div className="p-6 text-center text-gray-600">
        Selecciona un tablero para comenzar...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Panel de estado y visualización */}
      <div className="bg-white border-l-4 border-red-500 p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-red-600 font-bold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" /> Mensaje Actual
          </h3>
          <div className="flex items-center gap-2">
            <div className="text-xs bg-gray-100 rounded px-2 py-1">
              Estado MQTT: <span className={`font-semibold ${connectionStatus === 'Conectado' ? 'text-green-600' : 'text-red-600'}`}>{connectionStatus}</span>
            </div>
            {!editandoMensaje && mensajeActual && (
              <button 
                onClick={() => setEditandoMensaje(true)} 
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 border border-blue-200 rounded px-2 py-1 hover:bg-blue-50"
              >
                Editar
              </button>
            )}
          </div>
        </div>

        {editandoMensaje ? (
          <div className="space-y-4">
            <textarea
              className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-300 focus:outline-none"
              rows={2}
              value={mensajeActual.texto}
              onChange={(e) => {
                const nuevoTexto = e.target.value;
                setMensajeActual((prev) => ({ ...prev, texto: nuevoTexto }));
              }}
            />
            
            {/* Panel de configuración en modo edición */}              
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex justify-between items-center">
                <h4 className="text-sm font-medium text-gray-700">Configuración del mensaje</h4>
                <div className="flex items-center gap-2">
                  <div 
                    className="h-5 w-14 rounded border flex items-center justify-center text-xs"
                    style={{ 
                      backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`, 
                      color: (color.r + color.g + color.b) < 380 ? 'white' : 'black' 
                    }}
                  >
                    Vista
                  </div>
                </div>
              </div>
                {formatoJson ? (
                <div className="p-4 grid md:grid-cols-2 gap-4">
                  {/* Panel de control de velocidad */}
                  <div className="border border-gray-100 rounded-lg bg-white p-3 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Velocidad
                      </h5>
                      <div className="flex items-center gap-2">                      
                      <button 
                          onClick={() => actualizarVelocidad(Math.max(1, velocidad - 10))}
                          className="text-xs bg-gray-200 hover:bg-gray-300 h-6 w-6 rounded-full flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium w-10 text-center bg-gray-50 border border-gray-200 rounded px-1">{velocidad}</span>
                        <button 
                          onClick={() => actualizarVelocidad(Math.min(255, velocidad + 10))}
                          className="text-xs bg-gray-200 hover:bg-gray-300 h-6 w-6 rounded-full flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>                  
                    <div className="mt-2">
                      <input
                        type="range"
                        value={velocidad}
                        onChange={(e) => actualizarVelocidad(parseInt(e.target.value))}
                        className="w-full h-2 accent-red-600"
                        min="1"
                        max="255"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Lento</span>
                        <span>Rápido</span>
                      </div>
                    </div>
                  </div>                  
                  {/* Panel de control de color */}
                  <div className="border border-gray-100 rounded-lg bg-white p-3 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                        </svg>
                        Color
                      </h5>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-0.5">RGB({color.r}, {color.g}, {color.b})</span>
                        <div 
                          className="h-5 w-5 rounded-full border shadow-sm"
                          style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">                   
                        <RgbColorPicker 
                        color={color} 
                        onChange={actualizarColor} 
                        style={{ width: '100%', height: '80px' }}
                      />
                    </div>
                  </div>
                </div>
              ) : (                
              <div className="p-4">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                    <p className="text-gray-600 text-sm">
                      Modo texto: envía solo el mensaje sin datos adicionales.
                    </p>
                  </div>
                </div>
              )}
                {/* Selector de formato de mensaje */}
              <div className="px-4 py-3 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <h5 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    Formato de mensaje
                  </h5>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-md ${!formatoJson ? 'bg-blue-100 text-blue-800 font-medium' : 'text-gray-500'}`}>Texto</span>
                    <div 
                      onClick={() => {
                        setFormatoJson(!formatoJson);
                        if (mensajeActual) {
                          setTimeout(() => publicarMensaje(mensajeActual), 0);
                        }
                      }}
                      className="relative inline-flex h-5 w-10 items-center rounded-md bg-gray-200 cursor-pointer"
                    >
                      <span 
                        className={`absolute transition-transform duration-200 ease-in-out transform h-4 w-4 rounded-sm bg-white shadow-sm ${formatoJson ? 'translate-x-5 bg-red-500' : 'translate-x-1'}`} 
                      />
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-md ${formatoJson ? 'bg-red-100 text-red-800 font-medium' : 'text-gray-500'}`}>JSON</span>
                  </div>
                </div>
              </div>
              
              {/* Eliminado el selector de color avanzado que era condicional */}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  editarMensaje(mensajeActual.id, mensajeActual.texto);
                  publicarMensaje(mensajeActual);
                  setEditandoMensaje(false);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-medium flex items-center gap-1 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Guardar
              </button>
              <button 
                onClick={() => setEditandoMensaje(false)} 
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 text-sm font-medium shadow-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div>            
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-3">
              {mensajeActual ? (
                <p className="text-gray-800 font-medium" style={ 
                  formatoJson ? { color: `rgb(${color.r}, ${color.g}, ${color.b})` } : {}
                }>
                  {mensajeActual.texto}
                </p>
              ) : (
                <p className="text-gray-500 italic">No hay mensaje seleccionado</p>
              )}
            </div>
              {mensajeActual && (              
              <div className="flex flex-wrap gap-4">
                {formatoJson && (
                  <>
                    <div className="flex items-center gap-2 bg-gray-50 p-1.5 px-3 rounded-full text-xs border border-gray-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 font-medium">Velocidad:</span> {velocidad}
                    </div>
                    
                    <div className="flex items-center gap-2 bg-gray-50 p-1.5 px-3 rounded-full text-xs border border-gray-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 font-medium">Color:</span> 
                      <div className="flex items-center gap-1">
                        <span>RGB({color.r}, {color.g}, {color.b})</span>
                        <div className="h-4 w-4 rounded-full border" style={{ 
                          backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` 
                        }}></div>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="flex items-center gap-2 bg-gray-50 p-1.5 px-3 rounded-full text-xs border border-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  <span className="text-gray-700 font-medium">Formato:</span> 
                  <span className={`px-1.5 py-0.5 rounded-sm ${formatoJson ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                    {formatoJson ? 'JSON' : 'Texto'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Panel de lista de mensajes */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
            Mensajes
          </h3>
          <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200">
            {mensajes.length} mensajes guardados
          </div>
        </div>
        
        {mensajes.length > 0 ? (
          <ul className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-1">
            {mensajes.map((msg) => (
              <li
                onClick={() => seleccionarMensaje(msg)}
                title="Seleccionar como mensaje actual"
                key={msg.id}
                className={`flex justify-between items-center px-4 py-2 rounded-lg border transition-all ${
                  mensajeActual && msg.id === mensajeActual.id
                    ? "bg-red-50 border-red-300 shadow-sm"
                    : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      seleccionarMensaje(msg);
                    }}
                    className={`${mensajeActual && msg.id === mensajeActual.id ? 'text-green-600' : 'text-gray-400'} hover:text-green-800`}
                  >
                    <CheckCircle size={20} />
                  </button>
                  <span className="text-sm text-gray-800">{msg.texto}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    eliminarMensaje(msg.id);
                  }}
                  className="text-gray-400 hover:text-red-600"
                  title="Eliminar"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200 mb-4">
            <p className="text-gray-500">No hay mensajes guardados</p>
          </div>
        )}
        
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Agregar nuevo mensaje
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Escribe un nuevo mensaje..."
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-red-100 focus:border-red-300 focus:outline-none"
              />
              <button
                onClick={agregarMensaje}
                disabled={nuevoMensaje.trim() === ""}
                className={`p-2 rounded-lg shadow-sm flex items-center justify-center ${
                  nuevoMensaje.trim() === "" 
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                <Plus size={20} />
              </button>
            </div>
            
            {/* Panel de configuración para nuevo mensaje */}           
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 shadow-sm">              
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  Configuración
                </h4>
                {formatoJson && (
                  <div 
                    className="h-6 w-8 rounded border shadow-sm"
                    style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
                    title="Color actual"
                  ></div>
                )}
              </div>
              
              {formatoJson ? (
                <div className="grid md:grid-cols-2 gap-3">
                  {/* Control de velocidad */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-medium text-gray-700">Velocidad</label>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => setVelocidad(Math.max(1, velocidad - 10))}
                          className="text-xs bg-white hover:bg-gray-100 border border-gray-300 h-5 w-5 rounded flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="text-xs font-medium w-7 text-center">{velocidad}</span>
                        <button 
                          onClick={() => setVelocidad(Math.min(255, velocidad + 10))}
                          className="text-xs bg-white hover:bg-gray-100 border border-gray-300 h-5 w-5 rounded flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="mt-1">
                      <input
                        type="range"
                        value={velocidad}
                        onChange={(e) => setVelocidad(parseInt(e.target.value))}
                        className="w-full h-2 accent-red-600"
                        min="1"
                        max="255"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                        <span>Lento</span>
                        <span>Rápido</span>
                      </div>
                    </div>
                  </div>                
                  {/* Selector de color integrado */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-medium text-gray-700">Color</label>
                      <span className="text-xs text-gray-500">RGB({color.r}, {color.g}, {color.b})</span>
                    </div>
                    <div className="mt-1">
                      <RgbColorPicker 
                        color={color} 
                        onChange={setColor} 
                        style={{ width: '100%', height: '100px' }}
                      />
                    </div>
                  </div>
                </div>
              ) : (                
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center mb-3">
                  <p className="text-gray-600 text-sm">
                    Modo texto: envía solo el mensaje sin datos adicionales.
                  </p>
                </div>
              )}
                {/* Selector de formato de mensaje */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-medium text-gray-700 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    Formato de mensaje
                  </label>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-md ${!formatoJson ? 'bg-blue-100 text-blue-800 font-medium' : 'text-gray-500'}`}>Texto</span>
                    <div 
                      onClick={() => setFormatoJson(!formatoJson)}
                      className="relative inline-flex h-5 w-10 items-center rounded-md bg-gray-200 cursor-pointer"
                    >
                      <span 
                        className={`absolute transition-transform duration-200 ease-in-out transform h-4 w-4 rounded-sm bg-white shadow-sm ${formatoJson ? 'translate-x-5 bg-red-500' : 'translate-x-1'}`} 
                      />
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-md ${formatoJson ? 'bg-red-100 text-red-800 font-medium' : 'text-gray-500'}`}>JSON</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelMensajes;
