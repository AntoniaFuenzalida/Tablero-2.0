import React from "react";
import NavbarDocente from "../components/NavbarDocente";
import SidebarDocente from "../components/SidebarDocente";
import PanelMensajes from "../components/PanelMensajes";

const MainDocente = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <NavbarDocente />
      <div className="flex flex-col md:flex-row gap-6 px-4 py-6">
        <SidebarDocente />
        <PanelMensajes />
      </div>
    </div>
  );
};

export default MainDocente;