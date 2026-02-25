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
        console.log("Respuesta de la API:", data);
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

  return (
    <div className="min-h-screen pt-5 pb-10 px-4 max-w-6xl mx-auto">

      {/* SECCIÓN DE IMÁGENES (BENTO GALLERY) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px] mb-8">
        <div className="md:col-span-2 bg-[#111] rounded-3xl border border-white/5 flex items-center justify-center text-gray-800 font-black italic text-4xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          {cancha.sede_url ? (
            <img src={cancha.sede_url} alt={cancha.nombre_cancha} className="absolute inset-0 w-full h-full object-cover opacity-50 border-4 border-[#facf00]" />
          ) : (
            "FOTO_PRINCIPAL.JPG"
          )}
          <div className="absolute bottom-6 left-6 z-20">
            <h1 className="text-5xl font-black italic uppercase text-white leading-none">{cancha.nombre_cancha}</h1>
            <p className="text-[#facf00] font-bold text-sm mt-2">⭐ 4.9 (120 Reseñas)</p>
          </div>
        </div>
        <div className="hidden md:grid grid-rows-2 gap-4">
          <div className="bg-[#111] rounded-3xl border border-white/5 flex items-center justify-center text-gray-800 font-black italic text-xl overflow-hidden">
            {cancha.foto_sede_uno_url ? <img src={cancha.foto_sede_uno_url} className="w-full h-full object-cover opacity-40 border-4 border-[#facf00]" /> : "FOTO_2.JPG"}
          </div>
          <div className="bg-[#111] rounded-3xl border border-white/5 flex items-center justify-center text-gray-800 font-black italic text-xl overflow-hidden">
            {cancha.foto_sede_dos_url ? <img src={cancha.foto_sede_dos_url} className="w-full h-full object-cover opacity-40 border-4 border-[#facf00]" /> : "FOTO_3.JPG"}
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
            <div className="bg-[#111] p-6 rounded-2xl border border-white/5">
              <h4 className="text-white font-black italic uppercase mb-4 tracking-tighter">UBICACIÓN</h4>
              <p className="text-gray-400 text-sm font-medium mb-4">{cancha.direccion_exacta || cancha.ubicacion_cancha}</p>
              <div className="w-full h-40 bg-gray-900 rounded-xl flex items-center justify-center text-gray-700 italic font-bold">
                GOOGLE_MAPS_PREVIEW
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