import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login con:", form);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10">
      {/* Título principal */}
      <h1 className="text-2xl font-bold text-red-700 mb-6 text-center">
        Sistema Tablero 2.0 Utalca
      </h1>

      {/* Formulario */}
      <div className="bg-white border border-red-700 rounded-lg p-6 w-full max-w-md shadow-sm mb-6">
        <h2 className="text-xl font-semibold text-red-700 mb-1">Iniciar Sesión</h2>
        <p className="text-sm text-gray-500 mb-4">
          Ingrese sus credenciales para acceder al sistema
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Correo Electrónico"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
          />
          <div className="relative">
            <Input
              label="Contraseña"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
            />
            <span className="absolute right-0 top-6 text-xs text-red-600 cursor-pointer">
              ¿Olvidó su contraseña?
            </span>
          </div>

          <Button type="submit" className="bg-red-600 text-white hover:bg-red-700">
            Iniciar Sesión
          </Button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          ¿No tiene una cuenta?{" "}
          <Link to="/registro" className="text-red-600 underline">
            Registrarse
          </Link>
        </p>
      </div>

      {/* Credenciales demo */}
      <div className="bg-white rounded-lg shadow-sm p-4 w-full max-w-md text-sm text-gray-800 text-center">
        <h3 className="font-semibold mb-3">Credenciales de demostración:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border rounded-md p-2">
            <p className="font-semibold text-red-700">Docente</p>
            <p>Email: docente@ejemplo.com</p>
            <p>Contraseña: password</p>
          </div>
          <div className="border rounded-md p-2">
            <p className="font-semibold text-gray-800">Administrador</p>
            <p>Email: admin@ejemplo.com</p>
            <p>Contraseña: password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;