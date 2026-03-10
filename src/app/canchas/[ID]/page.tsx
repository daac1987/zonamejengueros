'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import NoticiasGrid from '@/src/components/NoticiasGrid';
import CanchaSeguro from '@/src/components/canchaSeguro';
import CanchaTorneo from '@/src/components/CanchaTorneo';

export default function DetalleCancha() {
  const params = useParams();
  const [cancha, setCancha] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchCanchaDetalle = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/cancha/perfil?id=${params.ID}`);
        const data = await res.json();
        if (res.ok && !data.error) {
          setCancha(data);
        } else {
          console.error("Error desde la API:", data.error);
          setCancha(null);
        }

      } catch (error) {
        console.error("Error de conexión:", error);
        setCancha(null);
      } finally {
        setLoading(false);
      }
    };

    if (params.ID) fetchCanchaDetalle();
  }, [params.ID]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <p className="text-[#facf00] font-black italic animate-pulse text-2xl uppercase">Cargando Sede...</p>
    </div>
  );

  if (!cancha) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <p className="text-white font-black italic text-2xl uppercase">Sede no encontrada</p>
    </div>
  );

  const copiarAlPortapapeles = () => {
    const direccion = cancha.direccion_exacta || cancha.ubicacion_cancha;
    navigator.clipboard.writeText(direccion);

    // Mostrar el toast y ocultarlo tras 2 segundos
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 max-w-6xl mx-auto">
      {/* --- BLOQUE 1: GALERÍA BENTO (Fotos Grandes) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Principal */}
        <div className="md:col-span-2 h-[400px] bg-[#111] rounded-3xl border border-white/5 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
          {cancha.sede_url ? (
            <img src={cancha.sede_url} className="absolute inset-0 w-full h-full object-cover opacity-60 border-4 border-[#facf00]" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-800 font-black italic text-4xl uppercase">Sede</div>
          )}
          <div className="absolute bottom-6 left-6 z-20 flex items-center gap-4">
            <div>
              <h1 className="text-4xl font-black italic uppercase text-white leading-none">{cancha.nombre_cancha}</h1>
              <p className="text-[#facf00] font-bold text-xs mt-1 uppercase italic tracking-widest">🛡️ {cancha.categoria_cancha || 'LIBRE'}</p>
            </div>
          </div>
        </div>

        {/* Laterales */}
        <div className="hidden md:grid grid-rows-2 gap-4 h-[400px]">
          <div className="bg-[#111] rounded-3xl border border-white/5 overflow-hidden">
            {cancha.foto_sede_dos_url && <img src={cancha.foto_sede_dos_url} className="w-full h-full object-cover opacity-40 border-4 border-[#facf00] p-1" />}
          </div>
          <div className="bg-[#111] rounded-3xl border border-white/5 overflow-hidden">
            {cancha.foto_sede_uno_url && <img src={cancha.foto_sede_uno_url} className="w-full h-full object-cover opacity-40 border-4 border-[#facf00] p-1" />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-5">

        {/* COLUMNA IZQUIERDA: INFO TÉCNICA */}
        <div className="lg:col-span-2 space-y-8">

          {/* Detalles Rápidos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "TAMAÑO", val: cancha.tipo_cancha || "5 VS 5" },
              { label: "GRAMILLA", val: cancha.grama_cancha || "Sintética" },
              { label: "PRECIO", val: `₡${cancha.precio_cancha?.toLocaleString()}` },
              { label: "PROVINCIA", val: cancha.provincia_cancha || "N/A" }
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black text-[#facf00] uppercase mb-1">{stat.label}</p>
                <p className="text-white font-bold italic uppercase text-sm">{stat.val}</p>
              </div>
            ))}
          </div>

          {/* Ubicación y Servicios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {showToast && (
              <div className="fixed left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="bg-[#facf00] text-black px-6 py-3 rounded-2xl font-black italic uppercase text-[10px] tracking-[0.2em] shadow-[0_10px_40px_rgba(250,207,0,0.3)] flex items-center gap-3">
                  <span>✅</span> ¡Dirección copiada al portapapeles!
                </div>
              </div>
            )}

            <div className="bg-[#111] p-6 rounded-2xl border border-white/5">
              <h4 className="text-white font-black italic uppercase mb-4 tracking-tighter">
                UBICACIÓN
              </h4>

              <p className="text-gray-400 text-sm font-medium mb-4">
                {cancha.direccion_exacta || cancha.ubicacion_cancha}
              </p>

              <div className="w-full h-40 bg-gray-900 rounded-xl flex flex-col items-center justify-center gap-3 text-gray-700 italic font-bold">
                {cancha.link_maps ? (
                  <>
                    <a
                      href={cancha.link_maps}
                      target="_blank"
                      className="bg-[#facf00] text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-400 transition w-3/4 text-center"
                    >
                      Ver ubicación en Google Maps
                    </a>

                    {/* Botón para copiar dirección */}
                    <button
                      onClick={copiarAlPortapapeles}
                      className="text-gray-400 hover:text-[#facf00] text-xs font-black uppercase italic tracking-widest transition-all border border-white/10 px-4 py-2 rounded-lg hover:border-[#facf00]/50"
                    >
                      <span className="text-[#facf00]">📋</span> Copiar Dirección
                    </button>
                  </>
                ) : (
                  "Ubicación no disponible"
                )}
              </div>
            </div>

            <div className="bg-[#111] p-6 rounded-2xl border border-white/5">
              <h4 className="text-white font-black italic uppercase mb-4 tracking-tighter">SERVICIOS</h4>
              <div className="grid grid-cols-2 gap-3">
                {Array.isArray(cancha.servicios_cancha)
                  ? cancha.servicios_cancha.map((s: string, i: number) => (
                    <p key={i} className="text-gray-400 text-[10px] font-bold uppercase italic flex items-center gap-2">
                      <span className="text-[#facf00]">✔</span> {s}
                    </p>
                  ))
                  : (cancha.servicios_cancha?.split(',') || ["Parqueo", "Duchas", "Petos"]).map((s: string, i: number) => (
                    <p key={i} className="text-gray-400 text-[10px] font-bold uppercase italic flex items-center gap-2">
                      <span className="text-[#facf00]">✔</span> {s.trim()}
                    </p>
                  ))
                }
              </div>
            </div>
          </div>

          {/* SECCIÓN DE NOTICIAS DE LA SEDE */}
          <div className="space-y-4">
            <NoticiasGrid
              usuario_id={cancha.usuario_id ? String(cancha.usuario_id) : "0"}
              torneoNombre={cancha.nombre_cancha}
            />
          </div>
        </div>

        {/* COLUMNA DERECHA: RESERVA + TORNEOS (AQUÍ ESTÁ EL CAMBIO) */}
        <div className="space-y-6">
          <CanchaSeguro cancha={cancha} />
          {/* Ahora CanchaTorneo aparece aquí para llenar el espacio vacío */}
          <div className="mt-4">
            <CanchaTorneo equipoId={cancha.usuario_id} />
          </div>
        </div>

      </div>

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