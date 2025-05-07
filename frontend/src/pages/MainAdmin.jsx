import React, { useState } from "react";
import SidebarAdmin from "../components/SidebarAdmin";
import PanelGestionDocentes from "../components/PanelGestionDocentes";
import PanelGestionDispositivos from "../components/PanelGestionDispositivos";

const MainAdmin = () => {
  const [selected, setSelected] = useState("docentes");

  return (
    <div className="flex">
      <SidebarAdmin selected={selected} onSelect={setSelected} />
      <div className="flex-1 p-6">
        {selected === "docentes" && <PanelGestionDocentes />}
        {selected === "dispositivos" && <PanelGestionDispositivos />}
        {selected === "ayuda" && <p>Sección de ayuda</p>}
      </div>
    </div>
  );
};

export default MainAdmin;
