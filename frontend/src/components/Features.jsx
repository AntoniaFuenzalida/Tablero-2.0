import React from "react";

const Features = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-16 bg-gray-50 text-left text-base">
      <div>
        <h3 className="font-semibold mb-4 text-lg">Para Docentes</h3>
        <ul className="list-disc ml-5 space-y-2 text-gray-700">
          <li>Administre su horario de atención</li>
          <li>Active o desactive su disponibilidad con un clic</li>
          <li>Configure mensajes personalizados</li>
          <li>Reciba notificaciones de cambios</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold mb-4 text-lg">Para Administradores</h3>
        <ul className="list-disc ml-5 space-y-2 text-gray-700">
          <li>Gestione registros de docentes</li>
          <li>Verifique dispositivos LED vinculados</li>
          <li>Monitoree el estado de conexión</li>
          <li>Resuelva problemas técnicos</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold mb-4 text-lg">Beneficios</h3>
        <ul className="list-disc ml-5 space-y-2 text-gray-700">
          <li>Comunicación en tiempo real</li>
          <li>Facilidad de uso</li>
          <li>Mejora la experiencia de estudiantes</li>
          <li>Optimiza la gestión del tiempo</li>
        </ul>
      </div>
    </section>
  );
};

export default Features;
