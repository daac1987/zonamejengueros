'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';

interface EntidadPerfil {
    entidad_id: number;
    entidad_nombre: string;
    entidad_foto: string | null;
    tipo_perfil: string;
}

interface Noticia {
    noticia_id: number;
    foto_noticia_url?: string;
    nombre_categoria?: string;
    titulo_noticia: string;
    texto_noticia: string;
    fecha_creacion: string | Date;
    fecha_noticia?: string | Date; // Agregada para consistencia con tu JSX
    imagen?: string;
}

export default function EquipoNoticiasPage({ params }: { params: Promise<{ ID: string }> }) {
    const resolvedParams = use(params);
    const idUsuario = resolvedParams.ID;
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [loading, setLoading] = useState(true);
    const [perfil, setPerfil] = useState<EntidadPerfil | null>(null);

    useEffect(() => {
        if (!idUsuario || idUsuario === "undefined") return;

        const fetchNoticias = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/noticias/perfil?id=${idUsuario}`);
                const data = await res.json();
                if (!res.ok) {
                    console.error("Error en la respuesta del servidor");
                    return;
                }

                setPerfil(data.perfil);
                setNoticias(data.noticias || []);
            } catch (error) {
                console.error("Error cargando noticias:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNoticias();
    }, [idUsuario]);

    const getRoute = () => {
        // Forzamos a que sea un string y lo pasamos a minúsculas para evitar errores de comparación
        const tipo = perfil?.tipo_perfil?.toString().toLowerCase();

        if (tipo === 'cancha') return 'canchas';
        if (tipo === 'torneo') return 'torneos';
        if (tipo === 'equipo') return 'equipos';

        return 'equipos'; // ruta por defecto
    };

    return (
        <div className="min-h-screen bg-black pt-8 pb-8 px-4">
            <div className="max-w-6xl mx-auto">

                {/* --- HEADER DE NAVEGACIÓN --- */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-[#111] p-8 rounded-[2.5rem] border border-white/5">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center p-1 border border-white/10 shadow-2xl overflow-hidden">
                            {loading ? (
                                <div className="w-full h-full bg-zinc-900 animate-pulse" />
                            ) : perfil?.entidad_foto ? (
                                <img
                                    src={perfil.entidad_foto}
                                    alt="Escudo Oficial"
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="text-[#facf00] font-black italic text-xl">FC</div>
                            )}
                        </div>

                        <div>
                            <p className="text-[#facf00] font-black italic text-[10px] tracking-[0.3em] uppercase">NOTICIAS OFICIALES</p>
                            <h1 className="text-4xl md:text-5xl font-black italic text-white uppercase tracking-tighter leading-none">
                                {perfil?.entidad_nombre || (loading ? "CARGANDO..." : "SIN NOMBRE")}
                            </h1>
                        </div>
                    </div>

                    {!loading && perfil && (
                        <Link
                            href={`/${getRoute()}/${perfil.tipo_perfil.toLowerCase() === 'cancha'
                                    ? perfil.entidad_id
                                    : (idUsuario || '')
                                }`}
                        >
                            <button className="bg-white text-black px-8 py-4 rounded-2xl font-black italic uppercase text-xs tracking-widest hover:bg-[#facf00] transition-all shadow-lg flex items-center gap-2 group">
                                VER PERFIL {
                                    perfil.tipo_perfil.toLowerCase() === 'cancha' ? 'de la cancha' :
                                        perfil.tipo_perfil.toLowerCase() === 'torneo' ? 'del torneo' : 'del equipo'
                                }
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </Link>
                    )}
                </div>

                {/* --- GRID DE NOTICIAS --- */}
                {loading ? (
                    <div className="text-center py-20 text-[#facf00] font-black italic animate-pulse">
                        BUSCANDO CRÓNICAS...
                    </div>
                ) : noticias.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {noticias.map((news) => (
                            <div key={news.noticia_id} className="group bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-[#facf00]/50 transition-all flex flex-col">
                                <div className="h-56 bg-gray-900 relative overflow-hidden">
                                    <img
                                        src={news.foto_noticia_url || news.imagen}
                                        alt={news.titulo_noticia}
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                                    />
                                    <div className="absolute top-6 left-6">
                                        <span className="bg-[#facf00] text-black text-[9px] font-black px-3 py-1 rounded-full uppercase italic">
                                            {news.nombre_categoria || "OFICIAL"}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">
                                            {news.fecha_noticia || news.fecha_creacion ? new Date(news.fecha_noticia || news.fecha_creacion).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : 'RECIENTE'}
                                        </span>
                                    </div>
                                    <h3 className="text-white font-black italic text-2xl uppercase leading-none mb-4 group-hover:text-[#facf00] transition-colors">
                                        {news.titulo_noticia}
                                    </h3>
                                    <p className="text-gray-400 text-sm font-medium leading-relaxed italic uppercase opacity-80 line-clamp-3">
                                        {news.texto_noticia}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* --- ESTADO SIN NOTICIAS --- */
                    <div className="text-center py-32 border border-dashed border-white/10 rounded-[2.5rem]">
                        <p className="text-zinc-600 font-black italic uppercase tracking-widest text-xl">
                            {perfil?.entidad_nombre || "Este perfil"} aún no ha publicado noticias oficiales.
                        </p>
                        <p className="text-zinc-800 font-bold text-[10px] uppercase mt-2">Próximamente más novedades</p>
                    </div>
                )}

                {/* Footer Volver */}
                <div className="mt-12 text-center">
                    <button
                        onClick={() => window.history.back()}
                        className="text-[#facf00] font-black italic text-xs uppercase tracking-widest border-b border-[#facf00] pb-1 hover:text-white transition-all"
                    >
                        ← Volver atrás
                    </button>
                </div>
            </div>
        </div>
    );
}