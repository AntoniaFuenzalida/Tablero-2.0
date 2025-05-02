import React from "react";

const Hero = () => {
  return (
    <section className="text-center py-20 px-6">
      <h1 className="text-4xl md:text-5xl font-bold max-w-3xl mx-auto leading-tight mb-6">
        Sistema de Gestión de Disponibilidad Docente
      </h1>
      <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-8">
        Administre su horario, personalice mensajes y mantenga a sus estudiantes informados en tiempo real a través de paneles LED.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition">
          Comenzar Ahora
        </button>
        <button className="border px-6 py-3 rounded-md hover:bg-gray-100 transition">
          Más Información
        </button>
      </div>
    </section>
  );
};

export default Hero;