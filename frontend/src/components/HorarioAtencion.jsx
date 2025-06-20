import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "../context/UserContext";

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const HorarioAtencion = () => {
  const { user } = useUser();
  const [horarios, setHorarios] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Inicializar horarios vacíos
  const inicializarHorarios = () => {
    return diasSemana.map((dia) => ({
      diaSemana: dia,
      hora: "09:00",
      horaFin: "17:00",
      activo: false,
    }));
  };      
  const cargarHorarios = useCallback(async () => {
    console.log("🔄 Cargando horarios...");
    console.log("� Usuario actual:", user);
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      console.log("🔑 Token obtenido:", token ? "Existe" : "No existe");
      
      const response = await fetch(`http://localhost:3001/api/horario`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📡 Respuesta del servidor:", response.status);

      if (response.ok) {
        const data = await response.json();        
        // Crear un array completo con todos los días
        const horariosCompletos = diasSemana.map((dia) => {
          const encontrado = data.find((h) => h.diaSemana === dia);
          return encontrado ? {
            diaSemana: dia,
            hora: encontrado.hora.slice(0, 5), // Formato HH:MM
            horaFin: encontrado.horaFin.slice(0, 5), // Formato HH:MM
            activo: Boolean(encontrado.activo),
          } : {
            diaSemana: dia,
            hora: "09:00",
            horaFin: "17:00",
            activo: false,
          };
        });

        console.log("✅ Horarios procesados:", horariosCompletos);
        setHorarios(horariosCompletos);
      } else {
        const errorData = await response.json();
        console.error("❌ Error al cargar horarios:", errorData);
        setHorarios(inicializarHorarios());
      }
    } catch (error) {
      setHorarios(inicializarHorarios());
    } finally {
      setCargando(false);
    }
  }, [user]);  
  const guardarHorarios = async () => {
    setGuardando(true);
    try {
      const token = localStorage.getItem("token");
      
      // Formatear horarios para enviar al backend
      const horariosParaEnviar = horarios.map(horario => ({
        diaSemana: horario.diaSemana,
        hora: horario.hora,
        horaFin: horario.horaFin,
        activo: horario.activo
      }));


      const response = await fetch(`http://localhost:3001/api/horario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ horarios: horariosParaEnviar }),
      });

      console.log("📡 Respuesta del guardado:", response.status);

      if (response.ok) {
        const result = await response.json();
        alert("✅ Horarios guardados correctamente");
        setModalAbierto(false);
        cargarHorarios(); // Recargar horarios
      } else {
        const error = await response.json();
        alert(`❌ Error: ${error.error || "No se pudieron guardar los horarios"}`);
      }
    } catch (error) {
      alert("❌ Error de conexión con el servidor");
    } finally {
      setGuardando(false);
    }
  };

  const toggleDiaActivo = (index) => {
    const nuevosHorarios = [...horarios];
    nuevosHorarios[index].activo = !nuevosHorarios[index].activo;
    setHorarios(nuevosHorarios);
  };

  const cambiarHora = (index, campo, valor) => {
    const nuevosHorarios = [...horarios];
    nuevosHorarios[index][campo] = valor;
    setHorarios(nuevosHorarios);
  };    
  useEffect(() => {
    cargarHorarios();
  }, [cargarHorarios]);

  const horariosActivos = horarios.filter(h => h.activo);

  return (
    <>
      <section className="border border-red-700 rounded-lg p-6 w-full bg-white">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-red-700">Horario de Atención</h2>
            <p className="text-sm text-gray-600">Gestione su horario de atención semanal</p>
          </div>
          <button
            onClick={() => setModalAbierto(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Gestionar Horarios
          </button>
        </div>

        {cargando ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Cargando horarios...</p>
          </div>
        ) : horariosActivos.length > 0 ? (
          <div className="space-y-3">
            {horariosActivos.map((horario, index) => (
              <div key={index} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md px-4 py-3">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-green-800 w-20">{horario.diaSemana}</span>
                  <span className="text-green-700">
                    {horario.hora} - {horario.horaFin}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Activo
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>No hay horarios configurados</p>
            <p className="text-sm">Haga clic en "Gestionar Horarios" para configurar</p>
          </div>
        )}
      </section>

      {/* Modal de Gestión */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Gestionar Horarios de Atención</h3>
                <button
                  onClick={() => setModalAbierto(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {horarios.map((horario, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{horario.diaSemana}</h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={horario.activo}
                          onChange={() => toggleDiaActivo(index)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-red-600 peer-focus:ring-2 peer-focus:ring-red-300 transition-all"></div>
                        <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5"></div>
                      </label>
                    </div>
                    
                    {horario.activo && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hora de inicio
                          </label>
                          <input
                            type="time"
                            value={horario.hora}
                            onChange={(e) => cambiarHora(index, "hora", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hora de fin
                          </label>
                          <input
                            type="time"
                            value={horario.horaFin}
                            onChange={(e) => cambiarHora(index, "horaFin", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  disabled={guardando}
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarHorarios}
                  disabled={guardando}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {guardando ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Guardar Horarios
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HorarioAtencion;
