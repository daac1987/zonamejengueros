'use client';
import { useParams } from 'next/navigation';
import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import NoticiasGrid from '@/src/components/NoticiasGrid';
import EquiposInscritos from '@/src/components/EquiposInscritos';
import TablaPosiciones from '@/src/components/TablaPosiciones';
import TorneoSeguro from '@/src/components/TorneoSeguro';
import TablaGoleador from '@/src/components/TablaGoleador';

export default function DetalleTorneo() {
  // 1. Desenvuelve la promesa de los params
  const params = useParams();
  const [torneo, setTorneo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCanchaDetalle = async () => {
      setLoading(true);
      try {
        // 1. Fetch de los detalles de la cancha
        const res = await fetch(`/api/torneo/perfil?id=${params.ID}`);
        const data = await res.json();
        if (res.ok && !data.error) {
          setTorneo(data);
        } else {
          console.error("Error desde la API:", data.error);
          setTorneo(null);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
        setTorneo(null);
      } finally {
        setLoading(false);
      }
    };

    if (params.ID) fetchCanchaDetalle();
  }, [params.ID]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-[#facf00] font-black italic text-4xl animate-pulse">CARGANDO DATOS...</div>
    </div>
  );

  if (!torneo) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-white font-black italic text-2xl">TORNEO NO ENCONTRADO</div>
    </div>
  );

  // Extraemos la primera sede de forma segura
  const sedePrincipal = torneo.sede?.[0]?.cancha;

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 max-w-5xl mx-auto">

      {/* HEADER DEL TORNEO */}
      <div className="bg-[#111] border border-white/10 p-8 rounded-3xl mb-8 relative overflow-hidden">
        {/* Texto de fondo (Marca de agua) */}
        <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl font-black italic uppercase select-none">
          {torneo.categoria}
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">

          {/* IMAGEN / LOGO DEL TORNEO */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-black border-2 border-[#facf00] rounded-2xl overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-300 shadow-[0_0_20px_rgba(250,207,0,0.2)]">
              {torneo.logo_url ? (
                <img
                  src={torneo.logo_url}
                  alt="Logo Torneo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  🏆
                </div>
              )}
            </div>
            {/* Adorno estético (Esquina Neón) */}
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#facf00] rounded-full blur-sm opacity-50"></div>
          </div>

          {/* TEXTO DEL HEADER */}
          <div className="text-center md:text-left">
            <span className={`px-3 py-1 rounded text-[10px] font-black uppercase italic ${torneo.estado === 'INSCRIPCIONES' ? 'bg-[#facf00] text-black' : 'bg-[#facf00] text-black'
              }`}>
              {torneo.estado_torneo === 'INSCRIPCIONES' ? 'INSCRIPCIÓN ABIERTA' : torneo.estado_torneo === 'EN CURSO' ? 'TORNEO EN CURSO' : 'TORNEO FINALIZADO'}
            </span>

            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white mt-4 leading-none">
              {torneo.nombre_torneo}
            </h1>

            <p className="text-[#facf00] font-bold italic mt-2 uppercase tracking-widest text-sm">
              {torneo.categoria_equipo?.categoria_equipo || "Categoría no disponible"} • {torneo.provincia_torneo}
            </p>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* COLUMNA INFO TORNEO */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/5 p-8 rounded-2xl border border-white/5">
            <h3 className="text-[#facf00] font-black italic text-xl mb-4 uppercase tracking-tighter">DETALLES</h3>
            <p className="text-white font-bold italic mt-2 uppercase tracking-widest text-sm">
              INSCRIPCION ₡{Number(torneo.precio_inscripcion_torneo).toLocaleString()}
            </p>
            <p className="text-white font-bold italic mt-2 uppercase tracking-widest text-sm">
              FECHA INICIO {new Date(torneo.fecha_inicio).toLocaleDateString()}
            </p>
            <p className="text-white font-bold italic mt-2 uppercase tracking-widest text-sm">
              CUPO {torneo.cantidad_equipos_torneo} EQUIPOS
            </p>
            <p className="text-white font-bold italic mt-2 uppercase tracking-widest text-sm">
              EQUIPOS {torneo.cantidad_jugadores.cantidad_jugadores}
            </p>
            <h3 className="text-[#facf00] font-black italic text-xl mt-4 uppercase tracking-tighter">ESPECIFICACIONES</h3>
            <p className="text-white font-medium leading-relaxed whitespace-pre-wrap">
              {torneo.especificaciones_torneo || "No hay especificaciones adicionales para este torneo."}
            </p>
          </div>

          <div className="bg-white/5 p-8 rounded-2xl border border-white/5">
            <h3 className="text-white font-black italic text-xl mb-4 uppercase tracking-tighter">🏆 PREMIACIÓN</h3>
            <div className="text-[#facf00] text-3xl font-black italic mb-2 uppercase">
              {torneo.premioUno_torneo}
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase italic tracking-widest">Premio al primer lugar</p>
            <div className="text-[#facf00] text-3xl font-black italic mb-2 uppercase">
              {torneo.premioDos_torneo}
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase italic tracking-widest">Premio al segundo lugar</p>
            <div className="text-[#facf00] text-3xl font-black italic mb-2 uppercase">
              {torneo.premioTres_torneo}
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase italic tracking-widest">Premio al tercer lugar</p>
          </div>
          <div className="lg:col-span-2 space-y-8">
            <EquiposInscritos torneo_id={torneo.torneo_id} />
          </div>
        </div>


        {/* COLUMNA DE LA SEDE (CONEXIÓN REAL) */}
        <div className="space-y-6">
          <div className="bg-[#111] border-2 border-[#facf00] p-6 rounded-3xl">
            <h3 className="text-white font-black italic text-sm mb-6 uppercase tracking-widest text-center">SEDE DEL TORNEO</h3>

            {torneo ? (
              <div className="bg-black/50 p-4 rounded-2xl border border-white/5 text-center mb-6">
                <div className="text-5xl mb-4">🏟️</div>
                <h4 className="text-xl font-black italic text-white uppercase">{torneo.sede_torneo[0]?.cancha?.nombre_cancha}</h4>
                <p className="text-gray-500 text-[10px] font-bold uppercase mb-2">
                  {torneo.sede_torneo[0]?.cancha?.provincia_cancha} • {torneo.sede_torneo[0]?.cancha?.ubicacion_cancha || "Ubicación no disponible"}
                </p>
                <p className="text-gray-500 text-[10px] font-bold uppercase mb-4">
                  Gramilla {torneo.sede_torneo[0]?.cancha?.grama_cancha || "Sin descripción disponible"}
                </p>
                <Link href={`/canchas/${torneo.sede_torneo[0]?.cancha?.cancha_id}`}>
                  <button className="w-full bg-white/10 hover:bg-[#facf00] hover:text-black text-white py-3 rounded-xl font-black italic text-[10px] uppercase transition-all">
                    Ver Detalles de la Sede
                  </button>
                </Link>
              </div>
            ) : (
              <div className="bg-black/50 p-4 rounded-2xl border border-white/5 text-center mb-6 text-gray-500 font-bold italic text-xs">
                SEDE POR DEFINIR
              </div>
            )}
          </div>

          <TorneoSeguro torneo={torneo} />

        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto w-full px-4 items-stretch mt-5">

        {/* 1. Tabla de Posiciones o Mensaje de Espera */}
        <div className="w-full flex">
          {torneo.estado_torneo !== "INSCRIPCIONES" ? (
            <TablaPosiciones torneo_id={torneo.torneo_id} />
          ) : (
            /* Contenedor del mensaje ajustado para hacer match con el de la izquierda */
            <div className="bg-[#111] p-10 rounded-[2.5rem] border border-white/5 text-center flex flex-col items-center justify-center w-full min-h-[300px]">
              <div className="opacity-20 mb-4">
                {/* Un icono opcional aquí ayudaría a llenar el vacío visual */}
                <svg className="w-12 h-12 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-zinc-500 text-xs font-black uppercase italic leading-relaxed max-w-[250px]">
                La tabla de posiciones estará disponible cuando inicie la fase de juegos.
              </p>
            </div>
          )}
        </div>
        {/* . tabla goleadores */}
        <div className="w-full flex">
          {torneo.estado_torneo !== "INSCRIPCIONES" ? (
            <TablaGoleador torneo_id={torneo.torneo_id} />
          ) : (
            /* Contenedor del mensaje ajustado para hacer match con el de la izquierda */
            <div className="bg-[#111] p-10 rounded-[2.5rem] border border-white/5 text-center flex flex-col items-center justify-center w-full min-h-[300px]">
              <div className="opacity-20 mb-4">
                {/* Un icono opcional aquí ayudaría a llenar el vacío visual */}
                <svg className="w-12 h-12 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-zinc-500 text-xs font-black uppercase italic leading-relaxed max-w-[250px]">
                La tabla de goleadores estará disponible cuando inicie la fase de juegos.
              </p>
            </div>
          )}
        </div>

      </div>

      <NoticiasGrid usuario_id={torneo.usuario_id} torneoNombre={torneo.nombre_torneo} />

      {/* --- FOOTER REGRESAR --- */}
      <div className="mt-12 text-center">
        <button onClick={() => window.history.back()} className="text-[#facf00] font-black italic text-xs uppercase tracking-widest border-b border-[#facf00] pb-1 hover:text-white transition-all">
          ← Volver atrás
        </button>
      </div>

    </div>

  );
}