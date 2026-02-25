'use client';
import Link from 'next/link';

const FEATURES = [
  {
    title: "INSCRIBE TU EQUIPO",
    desc: "Únete a la comunidad de mejengueros más grande. Crea tu perfil, sube tu escudo y queda disponible para recibir retos de otros capitanes.",
    icon: "⚽",
    color: "bg-[#facf00]",
    textColor: "text-black",
    grid: "md:col-span-2",
    link: "/auth" // Te lleva al registro/login
  },
  {
    title: "CAMPEONATOS",
    desc: "Encuentra y regístrate en los mejores torneos relámpago y ligas locales.",
    icon: "🏆",
    color: "bg-[#111]",
    textColor: "text-white",
    grid: "md:col-span-1",
    link: "/torneos" // Ruta para futuros torneos
  },
  {
    title: "NOTICIAS",
    desc: "Fichajes, resultados y crónicas de las mejores mejengas de la semana.",
    icon: "📰",
    color: "bg-[#111]",
    textColor: "text-white",
    grid: "md:col-span-1",
    link: "/noticias" // La página de noticias que creamos arriba
  },
  {
    title: "CANCHAS",
    desc: "¿No tienen sede? Mira las canchas premium disponibles con descuentos para usuarios Mejengueros.",
    icon: "🏟️",
    color: "bg-[#facf00]",
    textColor: "text-black",
    grid: "md:col-span-2",
    link: "/canchas" // Ruta para el marketplace de canchas
  }
];

export default function AboutSection() {
  return (
    <section className="w-full py-20 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
          MÁS QUE <span className="text-[#facf00]">FÚTBOL.</span>
        </h2>
        <p className="text-gray-400 mt-4 text-lg font-bold tracking-[0.2em] uppercase italic">
          El ecosistema definitivo para el fútbol amateur
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FEATURES.map((item, idx) => (
          <div 
            key={idx} 
            className={`${item.grid} ${item.color} p-8 rounded-tr-3xl rounded-bl-3xl border border-white/5 flex flex-col justify-between transition-transform hover:scale-[1.01] duration-300 shadow-2xl group`}
          >
            <div>
              <span className="text-4xl mb-4 block">{item.icon}</span>
              <h3 className={`text-3xl font-black italic tracking-tighter mb-4 ${item.textColor}`}>
                {item.title}
              </h3>
              <p className={`text-sm font-bold leading-relaxed opacity-80 ${item.textColor}`}>
                {item.desc}
              </p>
            </div>
            
            {/* Link dinámico según el objeto FEATURES */}
            <Link 
              href={item.link}
              className={`mt-8 text-xs font-black uppercase tracking-widest border-b-2 self-start transition-all hover:gap-2 flex items-center ${
                item.textColor === 'text-black' 
                ? 'border-black text-black' 
                : 'border-[#facf00] text-[#facf00]'
              }`}
            >
              <span>Leer más</span>
              <span className="ml-1 transition-transform group-hover:translate-x-1">+</span>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-white/5 border border-white/10 p-10 text-center rounded-xl backdrop-blur-sm">
        <h4 className="text-[#facf00] font-black italic text-2xl mb-4 uppercase">NUESTRO PROPÓSITO</h4>
        <p className="text-gray-300 max-w-3xl mx-auto font-medium italic leading-relaxed">
          "Nacimos para profesionalizar la mejenga. Queremos que cada equipo amateur se sienta como un club de primera división, 
          facilitando la conexión entre rivales, sedes y la pasión que solo el fútbol genera en la comunidad."
        </p>
      </div>
    </section>
  );
}