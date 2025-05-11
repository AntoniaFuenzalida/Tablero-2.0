import React, { useState, useEffect } from "react";
import ModalCambiarContrasena from "./ModalCambiarContrasena";
import { User, Bell, Lock } from "lucide-react";

const ConfiguracionCuenta = () => {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    departamento: "",
    oficina: "",
    notificarCorreo: false,
    notificarEstado: false,
  });


  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:3001/api/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setForm({
            nombre: data.nombre || "",
            email: data.correo || "",
            departamento: data.departamento || "",
            oficina: data.oficina || "",
            notificarCorreo: false,
            notificarEstado: false,
          });
        } else {
          alert(data.error || "No se pudieron cargar los datos");
        }
      } catch (err) {
        alert("Error al cargar datos del usuario");
      }
    };

    fetchUserData();
  }, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleSwitch = (key) => {
    setForm({ ...form, [key]: !form[key] });
  };

  const guardarCambios = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch("http://localhost:3001/api/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: form.nombre,
          correo: form.email,
          departamento: form.departamento,
          oficina: form.oficina,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Cambios guardados correctamente ✅");
      } else {
        alert(data.error || "Error al guardar cambios");
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    }
  };


  return (
    <section className="space-y-6">
      {/* Datos personales */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
          <User size={20} className="text-red-600" />
          Información Personal
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Nombre Completo</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Departamento</label>
            <input
              type="text"
              name="departamento"
              value={form.departamento}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Oficina</label>
            <input
              type="text"
              name="oficina"
              value={form.oficina}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md text-sm"
            />
          </div>
        </div>
      </div>

      {/* Notificaciones */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
          <Bell size={20} className="text-red-600" />
          Configuración de Notificaciones
        </h2>

        <div className="flex flex-col gap-2 text-sm text-gray-700">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.notificarCorreo}
              onChange={() => toggleSwitch("notificarCorreo")}
              className="h-5 w-5 accent-red-600"
            />
            Recibir notificaciones por correo electrónico
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.notificarEstado}
              onChange={() => toggleSwitch("notificarEstado")}
              className="h-5 w-5 accent-red-600"
            />
            Notificar cambios de estado
          </label>
        </div>
      </div>

      {/* Seguridad */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
          <Lock size={20} className="text-red-600" />
          Seguridad
        </h2>

        <button
          onClick={() => setMostrarModal(true)}
          className="border px-4 py-2 rounded-md text-sm hover:bg-gray-100"
        >
          Cambiar Contraseña
        </button>

        <ModalCambiarContrasena
          isOpen={mostrarModal}
          onClose={() => setMostrarModal(false)}
        />
      </div>

      {/* Guardar */}
      <div className="text-right">
        <button
          onClick={guardarCambios}
          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
        >
          Guardar Cambios
        </button>
      </div>
    </section>
  );
};

export default ConfiguracionCuenta;