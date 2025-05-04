import React from "react";
import { Link } from "react-router-dom";
import logoUtalca from "../assets/logo-utalca.png";
import heroImage from "../assets/landing-illustration.png"; // Asegúrate de guardarla como 'landing-illustration.png'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
        <div className="flex items-center space-x-3">
          <img src={logoUtalca} alt="Logo Utalca" className="h-10" />
          <h1 className="text-xl font-bold text-red-700">SistemaLED</h1>
        </div>
        <div className="space-x-3">
          <Link to="/login">
            <button className="px-4 py-2 text-sm border rounded hover:bg-gray-100">Iniciar Sesión</button>
          </Link>
          <Link to="/registro">
            <button className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700">Registrarse</button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-16 bg-gray-50">
        <div className="text-center md:text-left md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-snug">
            Sistema de Gestión de Disponibilidad Docente
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Administre su horario, personalice mensajes y mantenga a sus estudiantes informados
            en tiempo real a través de paneles LED.
          </p>
          <div className="space-x-4">
            <Link to="/registro">
              <button className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700">Comenzar Ahora</button>
            </Link>
            <Link to="/login">
              <button className="px-6 py-3 border rounded hover:bg-gray-100">Más Información</button>
            </Link>
          </div>
        </div>
        <div className="mt-10 md:mt-0 md:w-1/2 flex justify-center">
          <img src={heroImage} alt="Ilustración SistemaLED" className="w-full max-w-md" />
        </div>
      </main>

      {/* Beneficios */}
      <section className="bg-white py-12 px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-left">
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Para Docentes</h3>
            <ul className="text-sm text-gray-700 list-disc ml-5 space-y-1">
              <li>Administre su horario de atención</li>
              <li>Active o desactive su disponibilidad con un clic</li>
              <li>Configure mensajes personalizados</li>
              <li>Reciba notificaciones de cambios</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Para Administradores</h3>
            <ul className="text-sm text-gray-700 list-disc ml-5 space-y-1">
              <li>Gestione registros de docentes</li>
              <li>Verifique dispositivos LED vinculados</li>
              <li>Monitoree el estado de conexión</li>
              <li>Resuelva problemas técnicos</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Beneficios</h3>
            <ul className="text-sm text-gray-700 list-disc ml-5 space-y-1">
              <li>Comunicación en tiempo real</li>
              <li>Facilidad de uso</li>
              <li>Mejora la experiencia de estudiantes</li>
              <li>Optimiza la gestión del tiempo</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-gray-500 border-t bg-white">
        © 2025 SistemaLED – Universidad de Talca
      </footer>
    </div>
  );
};

export default LandingPage;