import React, { useState, useEffect } from "react";

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const HorarioAtencion = () => {
  const [horarios, setHorarios] = useState(
    diasSemana.map((dia) => ({
      dia,
      activo: true,
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

  const guardarHorario = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3001/api/horario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ horarios }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Horario guardado correctamente ✅");
      } else {
        alert(data.error || "Error al guardar horario");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión con el servidor");
    }
  };

  useEffect(() => {
    const cargarHorario = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:3001/api/horario", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          const horariosCompletos = diasSemana.map((dia) => {
            const encontrado = data.find((h) => h.diaSemana === dia);
            return {
              dia,
              activo: !!encontrado,
              inicio: encontrado?.hora || "10:00",
              fin: encontrado?.horaFin || "12:00",
            };
          });

          setHorarios(horariosCompletos);
        } else {
          alert("Error al cargar horarios");
        }
      } catch (err) {
        console.error("Error al cargar horarios:", err);
        alert("Error de conexión");
      }
    };

    cargarHorario();
  }, []);

  return (
    <section className="border border-red-700 rounded-lg p-6 w-full bg-white">
      <h2 className="text-xl font-bold text-red-700 mb-1">Horario de Atención</h2>
      <p className="text-sm text-gray-600 mb-6">Configure su horario de atención semanal.</p>

      <div className="space-y-4">
        {horarios.map((h, i) => (
          <div
            key={i}
            className="flex items-center bg-gray-50 border border-gray-200 rounded-md px-4 py-3 shadow-sm gap-4"
          >
            <span className="w-24 font-medium text-gray-700">{h.dia}</span>

            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Inicio</label>
              <input
                type="time"
                value={h.inicio}
                onChange={(e) => cambiarHora(i, "inicio", e.target.value)}
                disabled={!h.activo}
                className={`px-3 py-1 rounded border text-sm w-28 ${
                  h.activo ? "bg-white text-black" : "bg-gray-100 text-gray-400"
                }`}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Fin</label>
              <input
                type="time"
                value={h.fin}
                onChange={(e) => cambiarHora(i, "fin", e.target.value)}
                disabled={!h.activo}
                className={`px-3 py-1 rounded border text-sm w-28 ${
                  h.activo ? "bg-white text-black" : "bg-gray-100 text-gray-400"
                }`}
              />
            </div>

            <div className="ml-auto flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={h.activo}
                  onChange={() => toggleDia(i)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-red-600 peer-focus:ring-2 peer-focus:ring-red-300 transition-all"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={guardarHorario}
        className="mt-6 bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
      >
        Guardar Horario
      </button>
    </section>
  );
};

export default HorarioAtencion;
