import React, { useState } from "react";
import ModalCambiarContrasena from "./ModalCambiarContrasena";

const ConfiguracionCuenta = () => {
  const [form, setForm] = useState({
    nombre: "Profesor Ejemplo",
    email: "docente@ejemplo.com",
    departamento: "Matemáticas",
    oficina: "Edificio A, Piso 2, Oficina 203",
    notificarCorreo: false,
    notificarEstado: false,
  });

  const [mostrarModal, setMostrarModal] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleSwitch = (key) => {
    setForm({ ...form, [key]: !form[key] });
  };

  const guardarCambios = () => {
    console.log("Datos guardados:", form);
    alert("Cambios guardados correctamente ✅");
  };

  return (
    <section className="border border-red-700 rounded-lg p-6 w-full bg-white">
      <h2 className="text-xl font-bold text-red-700 mb-1">Configuración de la Cuenta</h2>
      <p className="text-sm text-gray-600 mb-6">Administra la configuración de tu cuenta</p>

      {/* Información personal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
          <input
            type="text"
            name="departamento"
            value={form.departamento}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Oficina</label>
          <input
            type="text"
            name="oficina"
            value={form.oficina}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md text-sm"
          />
        </div>
      </div>

      <hr className="my-4" />

      {/* Configuración de notificaciones */}
      <div className="mb-6">
        <h3 className="text-md font-semibold text-gray-800 mb-2">Configuración de Notificaciones</h3>

        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={form.notificarCorreo}
            onChange={() => toggleSwitch("notificarCorreo")}
            className="h-5 w-5 accent-red-600"
          />
          <span className="text-sm text-gray-700">Recibir notificaciones por correo electrónico</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.notificarEstado}
            onChange={() => toggleSwitch("notificarEstado")}
            className="h-5 w-5 accent-red-600"
          />
          <span className="text-sm text-gray-700">Notificar cambios de estado</span>
        </div>
      </div>

      <hr className="my-4" />

      {/* Seguridad */}
      <div className="mb-6">
        <h3 className="text-md font-semibold text-gray-800 mb-2">Seguridad</h3>
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

      <button
        onClick={guardarCambios}
        className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition"
      >
        Guardar Cambios
      </button>
    </section>
  );
};

export default ConfiguracionCuenta;
