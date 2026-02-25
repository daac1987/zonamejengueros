'use client';

const REGLAS = [
  {
    id: "01",
    titulo: "ROL DE LA PLATAFORMA",
    desc: "Somos un canal exclusivo de información y enlace. No organizamos, ni pactamos, ni reservamos canchas ni campeonatos de forma directa.",
    importancia: "INFORMATIVO"
  },
  {
    id: "02",
    titulo: "RESPONSABILIDAD FINANCIERA",
    desc: "No nos hacemos responsables por pagos de alquiler de canchas, arbitrajes o inscripciones. Todo flujo de dinero es responsabilidad exclusiva de los administradores.",
    importancia: "CRÍTICA"
  },
  {
    id: "03",
    titulo: "RETOS Y ACUERDOS",
    desc: "Los términos de cada reto (lugar, hora, apuestas o pagos) son pactados de forma privada entre los equipos. No actuamos como mediadores en disputas.",
    importancia: "ALTA"
  },
  {
    id: "04",
    titulo: "CONDUCTA EN LA CANCHA",
    desc: "Aunque solo brindamos la información, nos reservamos el derecho de banear equipos reportados por violencia física o estafas para proteger a la comunidad.",
    importancia: "MÁXIMA"
  },
  {
    id: "05",
    titulo: "VERIFICACIÓN DE DATOS",
    desc: "Es responsabilidad de cada equipo confirmar la veracidad de la reserva de la cancha y la identidad del rival antes de asistir al evento.",
    importancia: "MEDIA"
  }
];

export default function ReglamentoPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 max-w-4xl mx-auto">
      {/* Encabezado Estilo Manifiesto */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none mb-4">
          TÉRMINOS DE <span className="text-[#facf00]">USO</span>
        </h1>
        <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-sm">
          Aviso legal y guía de convivencia para mejengueros
        </p>
      </div>

      {/* Lista de Reglas */}
      <div className="space-y-6">
        {REGLAS.map((regla) => (
          <div 
            key={regla.id} 
            className="group relative bg-[#111] border border-white/5 p-8 rounded-2xl hover:border-[#facf00]/50 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Número de Regla */}
              <div className="text-4xl font-black italic text-[#facf00] opacity-40 group-hover:opacity-100 transition-opacity">
                {regla.id}
              </div>

              {/* Contenido */}
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-black italic uppercase text-white tracking-tight">
                    {regla.titulo}
                  </h3>
                  <span className="text-[10px] bg-white/10 text-gray-400 px-2 py-0.5 rounded font-bold uppercase">
                    {regla.importancia}
                  </span>
                </div>
                <p className="text-gray-400 font-medium leading-relaxed">
                  {regla.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer del Reglamento / Disclaimer Final */}
      <div className="mt-16 bg-zinc-900 border border-white/10 p-8 rounded-2xl text-center">
        <h4 className="text-[#facf00] font-black italic text-2xl uppercase mb-2">DESCARGO DE RESPONSABILIDAD</h4>
        <p className="text-gray-400 font-bold text-xs uppercase italic leading-relaxed">
          Esta plataforma funciona como un directorio informativo. Al utilizarla, usted libera a los administradores de cualquier responsabilidad legal por accidentes, deudas económicas, incumplimiento de retos o altercados ocurridos antes, durante o después de los eventos pactados de forma independiente.
        </p>
      </div>
    </div>
  );
}