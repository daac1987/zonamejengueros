'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Noticia {
    noticia_id: number;
    foto_noticia_url?: string;
    nombre_categoria?: string;
    titulo_noticia: string;
    texto_noticia: string;
    fecha_creacion: string | Date;
    fecha_noticia?: string | Date;
}

interface NoticiasGridProps {
    usuario_id: number | string | undefined;
    torneoNombre: string; // Para el texto del Link "Ver todas las de..."
}

const NoticiasGrid: React.FC<NoticiasGridProps> = ({ usuario_id, torneoNombre }) => {
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNoticias = async () => {
            // 1. Normalizamos el ID para que sea siempre un string (evita el error de ParamValue)
            const idLimpio = Array.isArray(usuario_id) ? usuario_id[0] : usuario_id;

            // 2. Ahora validamos de forma segura
            if (!idLimpio || idLimpio === "undefined") {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // Usamos el idLimpio en el fetch
                const resNoticias = await fetch(`/api/noticias/recientes?usuario_id=${idLimpio}`);
                const dataNoticias = await resNoticias.json();
                if (resNoticias.ok) {
                    const lista = Array.isArray(dataNoticias) ? dataNoticias : (dataNoticias.noticias || []);
                    setNoticias(lista);
                }
            } catch (error) {
                console.error("Error cargando noticias:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNoticias();
    }, [usuario_id]); //

    if (loading) {
        return (
            <div className="text-center py-10 text-[#facf00] font-black italic animate-pulse text-xs uppercase">
                Cargando Crónicas...
            </div>
        );
    }

    return (
        <div className="space-y-4 mt-8">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-white font-black italic text-xl uppercase tracking-tighter flex items-center gap-2">
                    <span className="w-2 h-6 bg-[#facf00]"></span> ÚLTIMAS NOTICIAS
                </h3>
                <Link href={`/noticias/${usuario_id}`}>
                    <span className="text-[10px] font-black text-gray-500 uppercase cursor-pointer hover:text-[#facf00] transition-colors border-b border-transparent hover:border-[#facf00]">
                        Ver todas las noticias de {torneoNombre} →
                    </span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {noticias.length > 0 ? (
                    noticias.map((post) => (
                        <div key={post.noticia_id} className="group bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-[#facf00]/50 transition-all">
                            <div className="h-40 bg-white/5 relative flex items-center justify-center overflow-hidden">
                                {post.foto_noticia_url ? (
                                    <img
                                        src={post.foto_noticia_url}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        alt="News"
                                    />
                                ) : (
                                    <span className="text-4xl opacity-20">📰</span>
                                )}
                                <div className="absolute top-4 left-4 bg-[#facf00] text-black text-[8px] font-black px-2 py-1 rounded italic">
                                    {post.nombre_categoria}
                                </div>
                            </div>
                            <div className="p-5">
                                <h4 className="text-white font-black italic uppercase text-lg leading-none mb-2 group-hover:text-[#facf00] transition-colors">
                                    {post.titulo_noticia}
                                </h4>
                                <p className="text-gray-500 text-xs font-bold leading-tight uppercase italic opacity-80 line-clamp-2">
                                    {post.texto_noticia} - {post.fecha_noticia
                                        ? new Date(post.fecha_noticia).toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric'
                                        })
                                        : 'Fecha no disponible'}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-2 py-10 text-center text-zinc-600 font-black italic uppercase text-xs border border-dashed border-white/5 rounded-2xl">
                        Sin noticias publicadas recientemente
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoticiasGrid;