import React, { useState } from "react";

const ModalCambiarContrasena = ({ isOpen, onClose }) => {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
    const [error, setError] = useState("");


const handleSubmit = async () => {
  if (nueva !== confirmar) {
    setError("Las contraseñas no coinciden.");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3001/api/cambiar-contrasena", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ actual, nueva }),
    });

    const data = await response.json();

    if (response.ok) {
      setError("");
      alert("Contraseña cambiada exitosamente ✅");
      setActual("");
      setNueva("");
      setConfirmar("");
      onClose();
    } else {
      setError(data.error || "Error al cambiar la contraseña");
    }
  } catch (err) {
    setError("Error de conexión con el servidor");
  }
};


  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-4">Cambiar Contraseña</h2>

        <label className="block text-sm font-medium mb-1">Contraseña Actual</label>
        <input
          type="password"
          className="w-full mb-3 border rounded px-3 py-2"
          value={actual}
          onChange={(e) => setActual(e.target.value)}
        />

        <label className="block text-sm font-medium mb-1">Nueva Contraseña</label>
        <input
          type="password"
          className="w-full mb-3 border rounded px-3 py-2"
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
        />

          <label className="block text-sm font-medium mb-1">Confirmar Nueva Contraseña</label>
          <input
            type="password"
            className="w-full mb-4 border rounded px-3 py-2"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
          />

          {error && (
            <p className="text-red-600 text-sm mb-3">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="text-sm px-4 py-2 border rounded hover:bg-gray-100">
              Cancelar
            </button>
            <button onClick={handleSubmit} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Guardar
            </button>
          </div>
      </div>
    </div>
  );
};

export default ModalCambiarContrasena;