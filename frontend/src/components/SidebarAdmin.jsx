import React from "react";
import { FaChalkboardTeacher, FaDatabase, FaQuestionCircle } from "react-icons/fa";

const SidebarAdmin = ({ selected, onSelect }) => {
  const menuItems = [
    {
      label: "Gestión de Docentes",
      icon: <FaChalkboardTeacher className="mr-2" />,
      key: "docentes",
    },
    {
      label: "Gestión de Dispositivos",
      icon: <FaDatabase className="mr-2" />,
      key: "dispositivos",
    },
    {
      label: "Ayuda",
      icon: <FaQuestionCircle className="mr-2" />,
      key: "ayuda",
    },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r p-4">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-2xl">
          <FaDatabase />
        </div>
        <h2 className="text-lg font-bold mt-2">Administrador</h2>
        <p className="text-sm text-gray-500">Sistema Tablero 2.0</p>
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.key}
            className={`flex items-center w-full px-3 py-2 rounded-md text-left ${
              selected === item.key
                ? "bg-red-100 text-red-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => onSelect(item.key)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SidebarAdmin;
