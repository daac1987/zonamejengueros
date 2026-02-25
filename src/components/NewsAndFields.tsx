'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NewsAndFields() {
  const [news, setNews] = useState<any[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Traemos las últimas noticias (puedes ajustar el limit en tu API)
        const resNews = await fetch('/api/noticias?limit=3'); // Ajusta a tu ruta real
        const dataNews = await resNews.json();
        // 2. Traemos las últimas canchas (limitado a 2)
        const resFields = await fetch('/api/cancha/recientes?limit=2');
        const dataFields = await resFields.json();

        if (resNews.ok) setNews(dataNews.slice(0, 3)); // Tomamos las 3 últimas
        if (resFields.ok) setFields(dataFields.slice(0, 2)); // Tomamos las 2 últimas

      } catch (error) {
        console.error("Error cargando datos de inicio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="py-20 text-center text-[#facf00] font-black italic">CARGANDO...</div>;

  return (
    <section className="w-full max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* --- COLUMNA DE NOTICIAS (1/3) --- */}
      <div className="lg:col-span-1">
        <h3 className="text-[#facf00] font-black italic text-2xl mb-6 uppercase flex items-center gap-2">
          <span className="w-8 h-[2px] bg-[#facf00]"></span> ÚLTIMA HORA
        </h3>
        
        <div className="space-y-4">
          {news.length > 0 ? news.map((item) => (
            <Link key={item.noticia_id} href={`/noticias/${item.usuario_id}`}>
              <div className="group cursor-pointer border-b border-white/5 pb-4 mb-4 hover:border-[#facf00]/30 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-black text-[#facf00] uppercase tracking-tighter bg-[#facf00]/10 px-2 py-0.5 rounded">
                    {new Date(item.fecha_noticia).toLocaleDateString()}
                  </span>
                  <span className="text-[9px] font-black text-gray-400 uppercase italic tracking-widest group-hover:text-white transition-colors">
                    POR {item.nombre_autor || 'EQUIPO'}
                  </span>
                </div>

                <h4 className="text-white font-bold group-hover:text-[#facf00] transition-colors uppercase leading-tight text-sm">
                  {item.titulo_noticia}
                </h4>
                
                <p className="text-gray-500 text-[10px] mt-1 font-medium">
                  {item.texto_noticia.length > 60 ? item.texto_noticia.slice(0, 60) + '...' : item.texto_noticia}
                </p>
              </div>
            </Link>
          )) : (
            <p className="text-gray-600 italic text-xs">No hay noticias recientes.</p>
          )}
        </div>

        <Link href="/noticias">
          <button className="mt-2 text-xs font-bold text-gray-400 hover:text-[#facf00] uppercase tracking-widest transition-colors">
            Ver todas las noticias →
          </button>
        </Link>
      </div>

      {/* --- COLUMNA DE CANCHAS (2/3) --- */}
      <div className="lg:col-span-2">
        <h3 className="text-white font-black italic text-2xl mb-6 uppercase flex items-center gap-2">
          RESERVA TU SEDE <span className="text-[#facf00]">TOP</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.length > 0 ? fields.map((field) => (
            <Link key={field.cancha_id} href={`/canchas/${field.cancha_id}`} className="group">
              <div className="relative h-64 bg-[#111] rounded-2xl overflow-hidden border border-white/5 transition-all hover:border-[#facf00]/50 shadow-2xl">
                {/* Imagen de fondo real */}
                <div className="absolute inset-0 z-0">
                  {field.sede_url ? (
                    <img 
                      src={field.sede_url} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      alt={field.autor_nombre || 'Cancha'}
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-900" />
                  )}
                </div>

                {/* Overlay Gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />

                <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="bg-[#facf00] text-black text-[9px] font-black px-2 py-1 rounded-sm uppercase italic mb-2 inline-block">
                        {field.ubicacion_cancha || 'COSTA RICA'}
                      </span>
                      <h4 className="text-2xl font-black italic text-white uppercase group-hover:text-[#facf00] transition-colors leading-none">
                        {field.nombre_cancha}
                      </h4>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-tighter mt-1">
                        {field.provincia_cancha}
                      </p>
                    </div>

                    <div className="bg-white text-black p-3 rounded-full group-hover:bg-[#facf00] transition-colors shadow-xl">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 12h14m-7-7l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )) : (
            <div className="col-span-2 text-center py-10 border border-dashed border-white/10 rounded-2xl text-zinc-700 font-black italic uppercase">
              No hay sedes disponibles
            </div>
          )}
        </div>
      </div>

    </section>
  );
}