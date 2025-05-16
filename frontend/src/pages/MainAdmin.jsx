import React, { useEffect, useState } from "react";
import SidebarAdmin from "../components/SidebarAdmin";
import PanelGestionDocentes from "../components/PanelGestionDocentes";
import PanelGestionDispositivos from "../components/PanelGestionDispositivos";
import { useNavigate } from "react-router-dom";
import DocenteService from "../services/DocenteService"; // importa tu servicio

const MainAdmin = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("docentes");
  const [docentes, setDocentes] = useState([]);

  const cargarDocentes = async () => {
    try {
      const data = await DocenteService.obtenerDocentes();
      setDocentes(data);
    } catch (error) {
      console.error("Error al cargar docentes:", error);
    }
  };

  useEffect(() => {
    cargarDocentes(); // carga inicial

    const interval = setInterval(cargarDocentes, 5000); // respaldo

    const handleStorageEvent = (event) => {
      if (event.key === "logout-event" || event.key === "login-event") {
        cargarDocentes(); // recarga inmediata
      }
    };

    window.addEventListener("storage", handleStorageEvent);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, []);

  const cerrarSesion = async () => {
    const token = localStorage.getItem("token");

    try {
      await fetch("http://localhost:3001/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }

    localStorage.setItem("logout-event", Date.now()); // 🔔 notificar otras pestañas

    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex">
      <SidebarAdmin selected={selected} onSelect={setSelected} />
      <div className="flex-1 p-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={cerrarSesion}
            className="text-sm text-red-600 hover:underline"
          >
            Cerrar sesión
          </button>
        </div>

        {selected === "docentes" && (
          <PanelGestionDocentes
            docentes={docentes}
            recargarDocentes={cargarDocentes}
          />
        )}

        {selected === "dispositivos" && (
          <PanelGestionDispositivos docentes={docentes} />
        )}

        {selected === "ayuda" && <p>Sección de ayuda</p>}
      </div>
    </div>
  );
};

export default MainAdmin;
