import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoUtalca from "../assets/logo-utalca.png";

const Registro = () => {
  const [rol, setRol] = useState("docente");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-6">
          <img src={logoUtalca} alt="Logo Utalca" className="h-12 mb-2" />
          <h2 className="text-xl font-semibold text-red-700">Registro de Usuario</h2>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Nombre completo</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded text-sm"
              placeholder="Juan Pérez"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded text-sm"
              placeholder="ejemplo@utalca.cl"
              required
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                className="w-full border px-3 py-2 rounded text-sm"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm text-gray-700 mb-1">Confirmar contraseña</label>
              <input
                type="password"
                className="w-full border px-3 py-2 rounded text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Rol</label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="w-full border px-3 py-2 rounded text-sm"
            >
              <option value="docente">Docente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
          >
            Crear cuenta
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-red-600 hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registro;
