'use client';
import { useState, useEffect, use as useReact } from 'react';
import Link from 'next/link';
import NoticiasGrid from '@/src/components/NoticiasGrid';
import EquipoTorneo from '@/src/components/EquipoTorneo';
import RetoSeguro from '@/src/components/RetoSeguro';

export default function TeamProfile({ params }: { params: Promise<{ ID: string }> }) {
  const resolvedParams = useReact(params);
  const equipoId = resolvedParams.ID;

  const [equipo, setEquipo] = useState<any>(null);
  const [sede, setSede] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!equipoId || equipoId === "undefined") return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const resEquipo = await fetch(`/api/equipo/perfil?id=${equipoId}`);
        const dataEquipo = await resEquipo.json();
        if (resEquipo.ok && dataEquipo) {
          setEquipo(dataEquipo);
          const canchaIdReal = dataEquipo.sede_equipo?.[0]?.cancha_id;
          if (canchaIdReal) {
            const resSede = await fetch(`/api/cancha/equipo?id=${canchaIdReal}`);
            if (resSede.ok) {
              const dataSede = await resSede.json();
              setSede(dataSede);
            }
          }
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [equipoId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <p className="text-[#facf00] font-black italic animate-pulse text-2xl uppercase">Cargando...</p>
    </div>
  );

  if (!equipo) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <p className="text-white font-black italic text-2xl uppercase">No encontrado</p>
    </div>
  );

  return (
    <div className="min-h-screen pt-5 pb-10 px-4 max-w-6xl mx-auto">

      {/* --- BLOQUE 1: GALERÍA BENTO (Fotos Grandes) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Principal */}
        <div className="md:col-span-2 h-[400px] bg-[#111] rounded-3xl border border-white/5 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
          {equipo.foto_equipo_uno_url ? (
            <img src={equipo.foto_equipo_uno_url} className="absolute inset-0 w-full h-full object-cover opacity-60 border-4 border-[#facf00]" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-800 font-black italic text-4xl uppercase">Equipo</div>
          )}
          <div className="absolute bottom-6 left-6 z-20 flex items-center gap-4">
            <div className="w-16 h-16 bg-black border-2 border-[#facf00] rounded-full overflow-hidden shrink-0 shadow-2xl">
              {equipo.logo_url && <img src={equipo.logo_url} className="w-full h-full object-cover" />}
            </div>
            <div>
              <h1 className="text-4xl font-black italic uppercase text-white leading-none">{equipo.nombre_equipo}</h1>
              <p className="text-[#facf00] font-bold text-xs mt-1 uppercase italic tracking-widest">🛡️ {equipo.categoria_equipo?.categoria_equipo || 'LIBRE'}</p>
            </div>
          </div>
        </div>

        {/* Laterales */}
        <div className="hidden md:grid grid-rows-2 gap-4 h-[400px]">
          <div className="bg-[#111] rounded-3xl border border-white/5 overflow-hidden">
            {equipo.foto_equipo_dos_url && <img src={equipo.foto_equipo_dos_url} className="w-full h-full object-cover opacity-40 border-4 border-[#facf00]" />}
          </div>
          <div className="bg-[#111] rounded-3xl border border-white/5 overflow-hidden">
            {sede?.sede_url && <img src={sede.sede_url} className="w-full h-full object-cover opacity-40 border-4 border-[#facf00]" />}
          </div>
        </div>
      </div>

      {/* --- BLOQUE 2: INFORMACIÓN + RETO (3 COLUMNAS) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Columna Izquierda (Ocupa 2 espacios) */}
        <div className="lg:col-span-2 space-y-8">

          {/* Stats Rápidos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "FUTBOL", val: equipo.cantidad_jugadores?.cantidad_jugadores || "N/A" },
              { label: "PROVINCIA", val: equipo.provincia_equipo },
              { label: "UBICACIÓN", val: equipo.ubicacion_equipo },
              { label: "GÉNERO", val: "MASCULINO" }
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black text-[#facf00] uppercase mb-1">{stat.label}</p>
                <p className="text-white font-bold italic uppercase text-[10px]">{stat.val}</p>
              </div>
            ))}
          </div>


          {/* Vitrina de Logros */}
          <div className="bg-[#111] p-6 rounded-3xl border border-white/5">
            <h4 className="text-[#facf00] font-black italic uppercase text-xs mb-4 tracking-[0.2em]">🏆 VITRINA DE LOGROS</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {equipo.logros_equipo ? equipo.logros_equipo.split(',').map((logro: string, i: number) => (
                <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center gap-3">
                  <span className="text-[#facf00] font-black italic text-xs">#{i + 1}</span>
                  <p className="text-white font-bold italic uppercase text-[10px]">{logro.trim()}</p>
                </div>
              )) : <p className="text-zinc-600 italic text-xs uppercase font-black opacity-30">Sin registros</p>}
            </div>
          </div>

          {/* SECCIÓN: SEDE Y SERVICIOS (Grid de 2 columnas) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Sede Principal (Nuestra Casa) */}
            <div className="bg-[#111] p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
              <div>
                <h4 className="text-white font-black italic uppercase text-xs mb-4 tracking-[0.2em]">NUESTRA CASA</h4>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-black rounded-2xl overflow-hidden border border-white/10 shrink-0">
                    {sede?.sede_url ? (
                      <img src={sede.sede_url} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-10">🏟️</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-black italic uppercase text-lg leading-tight">
                      {sede?.nombre_cancha || "SIN SEDE FIJA"}
                    </p>
                    <p className="text-gray-500 text-[9px] font-bold uppercase mt-1">
                      {sede ? `${sede.provincia_cancha}-${sede.ubicacion_cancha}` : "Coordinar con capitán"}
                    </p>
                  </div>
                </div>
              </div>

              {sede && (
                <Link href={`/canchas/${sede.cancha_id}`} className="mt-4">
                  <button className="w-full bg-white/5 hover:bg-[#facf00] hover:text-black text-white py-2 rounded-xl font-black text-[9px] uppercase italic transition-all border border-white/5">
                    VER INSTALACIONES
                  </button>
                </Link>
              )}
            </div>

            {/* Bloque de Servicios (Limitado a 6) */}
            <div className="bg-[#111] p-6 rounded-3xl border border-white/5">
              <h4 className="text-white font-black italic uppercase text-xs mb-4 tracking-[0.2em]">SERVICIOS DE NUESTRA CASA</h4>
              <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                {sede?.servicios_cancha ? (
                  (Array.isArray(sede.servicios_cancha)
                    ? sede.servicios_cancha
                    : sede.servicios_cancha.split(',')
                  )
                    .slice(0, 6) // 🔥 Aquí limitamos a máximo 6 elementos
                    .map((s: string, i: number) => (
                      <p key={i} className="text-gray-400 text-[10px] font-bold uppercase italic flex items-center gap-2">
                        <span className="text-[#facf00] text-xs">✔</span> {s.trim()}
                      </p>
                    ))
                ) : (
                  // Fallback
                  ["PARQUEO", "DUCHAS", "PETOS", "ILUMINACIÓN"].map((s, i) => (
                    <p key={i} className="text-gray-600 text-[10px] font-bold uppercase italic flex items-center gap-2">
                      <span className="text-gray-800">✔</span> {s}
                    </p>
                  ))
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-[8px] text-gray-600 font-black uppercase italic">
                  * Servicios sujetos a disponibilidad de la sede.
                </p>
              </div>
            </div>

          </div>

          <NoticiasGrid usuario_id={equipoId} torneoNombre={equipo.nombre_equipo} />
        </div>

        {/* Columna Derecha (Ocupa 1 espacio) - BLOQUE AMARILLO */}
        <div className="space-y-6">
          <RetoSeguro equipo={equipo} />
          <EquipoTorneo equipoId={equipo.equipo_id} />
        </div>

      </div>

      <div className="mt-12 text-center">
        <button onClick={() => window.history.back()} className="text-[#facf00] font-black italic text-[10px] uppercase border-b border-[#facf00] pb-1 hover:text-white transition-all">
          ← Volver atrás
        </button>
      </div>
    </div>
  );
}