'use client';

const SECCIONES = [
  {
    titulo: "1. ACEPTACIÓN DE LOS TÉRMINOS",
    contenido: "Al acceder y utilizar la plataforma Mejengueros, el usuario acepta de manera íntegra los presentes términos y condiciones. Si no está de acuerdo, deberá abstenerse de utilizar nuestros servicios de búsqueda de retos y reserva de canchas."
  },
  {
    titulo: "2. RESPONSABILIDAD EN LA CANCHA",
    contenido: "Mejengueros es una plataforma de conexión entre equipos. No nos hacemos responsables por lesiones, daños materiales o conflictos físicos ocurridos durante los partidos. Cada capitán es responsable de la conducta de sus jugadores."
  },
  {
    titulo: "3. VERACIDAD DE LA INFORMACIÓN",
    contenido: "Los administradores de equipos se comprometen a subir información real: escudos, nombres de jugadores, zonas y niveles de juego. El uso de perfiles falsos resultará en la baja inmediata de la cuenta."
  },
  {
    titulo: "4. RESERVAS Y PAGOS",
    contenido: "Mejengueros facilita la información de canchas, pero el contrato de alquiler es entre el equipo y el centro deportivo. Cualquier reclamo por estado de gramilla, iluminación o reembolsos debe dirigirse directamente a la administración de la cancha."
  },
  {
    titulo: "5. USO DE IMAGEN",
    contenido: "Al subir fotos de sus equipos o partidos, los usuarios autorizan a Mejengueros a utilizar dicho material con fines promocionales dentro de la plataforma y sus redes sociales oficiales."
  }
];

export default function TerminosPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 max-w-4xl mx-auto">
      {/* Encabezado */}
      <div className="mb-12 border-b border-[#facf00]/20 pb-8">
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
          TÉRMINOS Y <span className="text-[#facf00]">CONDICIONES</span>
        </h1>
        <p className="text-gray-500 font-bold mt-2 uppercase text-xs tracking-widest">
          Última actualización: 23 de Enero, 2026
        </p>
      </div>

      {/* Cuerpo Legal */}
      <div className="space-y-10">
        {SECCIONES.map((seccion, index) => (
          <div key={index} className="group">
            <h2 className="text-[#facf00] font-black italic text-lg uppercase mb-3 tracking-tight">
              {seccion.titulo}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              {seccion.contenido}
            </p>
          </div>
        ))}
      </div>

      {/* Nota de Privacidad Simple */}
      <div className="mt-16 p-6 bg-white/5 border border-white/10 rounded-xl">
        <p className="text-gray-500 text-[11px] italic leading-tight uppercase">
          Importante: Mejengueros se reserva el derecho de modificar estos términos en cualquier momento para mejorar la convivencia de la comunidad futbolística. El uso continuo de la web implica la aceptación de los nuevos términos.
        </p>
      </div>

      {/* Botón de Regreso Estilizado */}
      <div className="mt-12 text-center">
        <button 
          onClick={() => window.history.back()}
          className="text-[#facf00] font-black italic text-xs uppercase tracking-widest border-b border-[#facf00] pb-1 hover:text-white hover:border-white transition-all"
        >
          ← Volver atrás
        </button>
      </div>
    </div>
  );
}