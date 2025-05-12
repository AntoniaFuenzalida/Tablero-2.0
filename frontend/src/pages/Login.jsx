import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoUtalca from "../assets/logo-utalca.png";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contraseña }),
      });

      const data = await response.json();

    if (response.ok) {
      alert("Login exitoso");
      localStorage.setItem("token", data.token);

      const tokenPayload = JSON.parse(atob(data.token.split('.')[1])); // decodifica el JWT

      if (tokenPayload.rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/docente");
      }
    }
    } catch (error) {
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-6">
          <img src={logoUtalca} alt="Logo Utalca" className="h-12 mb-2" />
          <h2 className="text-xl font-semibold text-red-700">Iniciar Sesión</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="ejemplo@utalca.cl"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
          >
            Entrar
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="text-red-600 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
