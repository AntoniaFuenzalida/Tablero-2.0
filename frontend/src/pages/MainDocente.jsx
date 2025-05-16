import { useEffect, useState } from "react";
import SidebarDocente from "../components/SidebarDocente";
import PanelMensajes from "../components/PanelMensajes";
import HorarioAtencion from "../components/HorarioAtencion";
import ConfiguracionCuenta from "../components/ConfiguracionCuenta";
import logoUtalca from "../assets/logo-utalca.png";
import { useNavigate } from "react-router-dom";

const MainDocente = () => {
  const [pestanaActiva, setPestanaActiva] = useState("mensajes");
  const [usuario, setUsuario] = useState({ nombre: "", departamento: "" });
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [historialNotificaciones, setHistorialNotificaciones] = useState([]);

  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchUsuario = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:3001/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUsuario(data);
      } else {
        console.warn("No autorizado al obtener usuario");
      }
    } catch (err) {
      console.error("Error al obtener usuario:", err);
    }
  };

  const fetchNotificaciones = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:3001/api/notificaciones", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setNotificaciones(data);
      } else {
        console.warn("Token inválido al obtener notificaciones");
      }
    } catch (err) {
      console.error("Error al obtener notificaciones:", err);
    }
  };

  const fetchHistorialNotificaciones = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:3001/api/notificaciones/historial", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setHistorialNotificaciones(data);
      } else {
        console.warn("Token inválido al obtener historial de notificaciones");
      }
    } catch (err) {
      console.error("Error al obtener historial de notificaciones:", err);
    }
  };

  useEffect(() => {
    fetchUsuario();
    fetchNotificaciones();
  }, []);

  useEffect(() => {
    if (pestanaActiva === "notificaciones") {
      fetchHistorialNotificaciones();
    }
  }, [pestanaActiva]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotificaciones();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const actualizarNotificaciones = () => {
    fetchNotificaciones();
    if (pestanaActiva === "notificaciones") {
      fetchHistorialNotificaciones();
    }
  };


  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <img src={logoUtalca} alt="Logo" className="h-8" />
          <h1 className="text-lg font-semibold text-red-700">
            Sistema Tablero 2.0 Utalca
          </h1>
        </div>

        <div className="flex items-center gap-4 relative">
          <div className="relative">
            <button
              onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}
              className="relative p-1 text-gray-700 hover:text-red-700 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.25 17.25h-4.5m4.5 0a2.25 2.25 0 01-4.5 0m4.5 0h1.125a2.25 2.25 0 002.25-2.25v-4.875a6.375 6.375 0 10-12.75 0v4.875A2.25 2.25 0 006.375 17.25H7.5m4.5 0V18"
                />
              </svg>
              {notificaciones.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {notificaciones.length}
                </span>
              )}
            </button>

            {mostrarNotificaciones && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded shadow-lg z-10">
                <div className="p-3 font-semibold text-gray-700 border-b">
                  Notificaciones
                </div>
                {notificaciones.length > 0 ? (
                  <ul className="max-h-60 overflow-y-auto text-sm text-gray-700">
                    {notificaciones.map((item) => (
                      <li
                        key={item.id}
                        onClick={async () => {
                          const token = localStorage.getItem("token");
                          try {
                            const res = await fetch(
                              `http://localhost:3001/api/notificaciones/${item.id}/leida`,
                              {
                                method: "PUT",
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                            );

                            if (res.ok) {
                              setNotificaciones((prev) =>
                                prev.filter((n) => n.id !== item.id)
                              );
                            }
                          } catch (err) {
                            console.error("Error al marcar notificación como leída:", err);
                          }
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b"
                      >
                        <p className="text-sm font-medium text-gray-800">{item.mensaje}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(item.fecha).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="p-4 text-sm text-gray-500">No hay notificaciones.</p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <img
              src="https://ui-avatars.com/api/?name=Profesor+Ejemplo&background=be123c&color=fff"
              alt="Avatar"
              className="w-8 h-8 rounded-full"
            />
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-medium text-gray-700">{usuario.nombre}</span>
            </div>
          </div>

          <button
            onClick={cerrarSesion}
            className="text-sm text-red-600 hover:underline ml-4"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-6 px-6 py-6">
        <SidebarDocente onDisponibilidadCambiada={actualizarNotificaciones} />
        <div className="flex-1 space-y-4">
          <div className="flex gap-2 border-b pb-2">
            {[
              { key: "mensajes", label: "Mensajes" },
              { key: "horario", label: "Horario" },
              { key: "notificaciones", label: "Notificaciones" },
              { key: "configuracion", label: "Configuración" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setPestanaActiva(key)}
                className={`px-4 py-1 rounded-t-md text-sm font-medium transition ${
                  pestanaActiva === key
                    ? "bg-red-700 text-white shadow"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            {pestanaActiva === "mensajes" && <PanelMensajes />}
            {pestanaActiva === "horario" && <HorarioAtencion />}
            {pestanaActiva === "configuracion" && <ConfiguracionCuenta />}
            {pestanaActiva === "notificaciones" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Historial de Notificaciones</h2>
                {historialNotificaciones.length === 0 ? (
                  <p className="text-gray-500 text-sm">No hay notificaciones registradas.</p>
                ) : (
                  <ul className="divide-y divide-gray-200 text-sm">
                    {historialNotificaciones.map((n) => (
                      <li key={n.id} className="py-2">
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-gray-700">{n.mensaje}</p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              n.leida ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {n.leida ? "Leída" : "No leída"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{new Date(n.fecha).toLocaleString("es-CL", {
                                    timeZone: "America/Santiago",
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDocente;
