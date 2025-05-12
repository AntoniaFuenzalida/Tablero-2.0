import React, { useState } from "react";
import SidebarAdmin from "../components/SidebarAdmin";
import PanelGestionDocentes from "../components/PanelGestionDocentes";
import PanelGestionDispositivos from "../components/PanelGestionDispositivos";
import { useNavigate } from "react-router-dom";

const MainAdmin = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("docentes");

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <SidebarAdmin selected={selected} onSelect={setSelected} />

      {/* Contenido principal */}
      <div className="flex-1 p-6">
        {/* Botón de cerrar sesión */}
        <div className="flex justify-end mb-4">
          <button
            onClick={cerrarSesion}
            className="text-sm text-red-600 hover:underline"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Paneles dinámicos */}
        {selected === "docentes" && <PanelGestionDocentes />}
        {selected === "dispositivos" && <PanelGestionDispositivos />}
        {selected === "ayuda" && <p>Sección de ayuda</p>}
      </div>
    </div>
  );
};

export default MainAdmin;
