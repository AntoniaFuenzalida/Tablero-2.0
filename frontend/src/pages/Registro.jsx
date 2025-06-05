import { useState } from "react";
import { Link } from "react-router-dom";
import logoUtalca from "../assets/logo-utalca.png";

export default function RegistroVerificado() {
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [verificado, setVerificado] = useState(false);

  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("docente");
  const [contraseña, setContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");

const enviarCodigo = async () => {
  if (!correo.endsWith("@alumnos.utalca.cl")) {
    alert("Solo se permiten correos @alumnos.utalca.cl");
    return;
  }

  try {
    const res = await fetch("http://localhost:3001/api/enviar-codigo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Error al enviar código");
      return; // ⛔ No continuar
    }

    // ✅ Solo si todo fue bien
    alert("Código enviado al correo. Revisa también tu bandeja de spam o correos no deseados.");
    setCodigoEnviado(true);
  } catch (error) {
    alert("Error de conexión con el servidor");
  }
};


  const verificarCodigo = async () => {
    const res = await fetch("http://localhost:3001/api/verificar-codigo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, codigoIngresado: codigo }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Correo verificado correctamente");
      setVerificado(true);
    } else {
      alert(data.error || "Código incorrecto");
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();

    if (contraseña !== confirmarContraseña) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, contraseña, rol }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Usuario registrado exitosamente");
        // Redireccionar si se desea
      } else {
        alert(data.error || "Error al registrar");
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
          <h2 className="text-xl font-semibold text-red-700">Registro de Usuario</h2>
        </div>

        {!codigoEnviado ? (
          <div className="space-y-4">
            <label className="block text-sm text-gray-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full border px-3 py-2 rounded text-sm"
              placeholder="ejemplo@alumnos.utalca.cl"
              required
            />
            <button
              onClick={enviarCodigo}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
            >
              Enviar código
            </button>
          </div>
        ) : !verificado ? (
          <div className="space-y-4">
            <label className="block text-sm text-gray-700 mb-1">Código recibido</label>
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="w-full border px-3 py-2 rounded text-sm"
              placeholder="123456"
            />
            <button
              onClick={verificarCodigo}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
            >
              Verificar código
            </button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleRegistro}>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Nombre completo</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border px-3 py-2 rounded text-sm"
                placeholder="Juan Pérez"
                required
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm text-gray-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  className="w-full border px-3 py-2 rounded text-sm"
                  required
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm text-gray-700 mb-1">Confirmar contraseña</label>
                <input
                  type="password"
                  value={confirmarContraseña}
                  onChange={(e) => setConfirmarContraseña(e.target.value)}
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
        )}

        <p className="text-sm text-center text-gray-600 mt-4">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-red-600 hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
