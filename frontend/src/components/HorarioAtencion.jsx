import React, { useState } from "react";

const diasSemana = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const HorarioAtencion = () => {
  const [horarios, setHorarios] = useState(
    diasSemana.map((dia) => ({
      dia,
      activo: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].includes(dia),
      inicio: "10:00",
      fin: "12:00",
    }))
  );

  const toggleDia = (index) => {
    const actualizados = [...horarios];
    actualizados[index].activo = !actualizados[index].activo;
    setHorarios(actualizados);
  };

  const cambiarHora = (index, tipo, valor) => {
    const actualizados = [...horarios];
    actualizados[index][tipo] = valor;
    setHorarios(actualizados);
  };

  const guardarHorario = () => {
    console.log("Horario guardado:", horarios);
    alert("Horario guardado correctamente ✅");
  };

  return (
    <section className="border border-red-700 rounded-lg p-6 w-full bg-gray-50">
      <h2 className="text-xl font-bold text-red-700 mb-1">Horario de Atención</h2>
      <p className="text-sm text-gray-600 mb-5">
        Configure tu horario de atención semanal
      </p>

      <div className="space-y-4">
        {horarios.map((h, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border border-gray-200 bg-white px-4 py-2 rounded-md shadow-sm"
          >
            {/* Día */}
            <span className="w-24 font-medium text-gray-700">{h.dia}</span>

            {/* Hora inicio */}
            <input
              type="time"
              value={h.inicio}
              onChange={(e) => cambiarHora(i, "inicio", e.target.value)}
              className={`border px-2 py-1 rounded-md text-sm ${
                h.activo ? "text-black" : "text-gray-400 bg-gray-100"
              }`}
              disabled={!h.activo}
            />

            {/* Separador */}
            <span className="text-gray-500 text-sm">a</span>

            {/* Hora fin */}
            <input
              type="time"
              value={h.fin}
              onChange={(e) => cambiarHora(i, "fin", e.target.value)}
              className={`border px-2 py-1 rounded-md text-sm ${
                h.activo ? "text-black" : "text-gray-400 bg-gray-100"
              }`}
              disabled={!h.activo}
            />

            {/* Checkbox */}
            <input
              type="checkbox"
              checked={h.activo}
              onChange={() => toggleDia(i)}
              title="Activar este día"
              className="ml-auto h-5 w-5 accent-red-600"
            />
          </div>
        ))}
      </div>

      <button
        onClick={guardarHorario}
        className="mt-6 bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition"
      >
        Guardar Horario
      </button>
    </section>
  );
};

export default HorarioAtencion;
