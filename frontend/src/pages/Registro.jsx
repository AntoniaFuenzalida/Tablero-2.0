import React, { useState } from "react";
import AuthLayout from "../components/AuthLayout";
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
    <AuthLayout title="Crear Cuenta">
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

        <Button type="submit">Registrarse</Button>
      </form>

      <p className="text-sm text-center text-gray-600">
        ¿Ya tiene una cuenta?{" "}
        <Link to="/login" className="text-black underline">
          Iniciar Sesión
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Registro;