import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link } from "react-router-dom";

const Registro = () => {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    tipo: "Docente",
    password: "",
    confirmar: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmar) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    console.log("Registro:", form);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10">
      <h1 className="text-2xl font-bold text-red-700 mb-6 text-center">
        SistemaLED
      </h1>

      <div className="bg-white border border-red-700 rounded-lg p-6 w-full max-w-md shadow-sm">
        <h2 className="text-xl font-semibold text-red-700 mb-1">Crear Cuenta</h2>
        <p className="text-sm text-gray-500 mb-4">
          Complete el formulario para registrarse en el sistema
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre Completo"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre Apellido"
          />
          <Input
            label="Correo Electrónico"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Tipo de Usuario
            </label>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="Docente">Docente</option>
              <option value="Administrador">Administrador</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Nota: Las cuentas de administrador requieren aprobación
            </p>
          </div>

          <Input
            label="Contraseña"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="********"
          />
          <Input
            label="Confirmar Contraseña"
            name="confirmar"
            type="password"
            value={form.confirmar}
            onChange={handleChange}
            placeholder="********"
          />

          <Button type="submit" className="bg-red-600 text-white hover:bg-red-700">
            Registrarse
          </Button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          ¿Ya tiene una cuenta?{" "}
          <Link to="/login" className="text-red-600 underline">
            Iniciar Sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registro;