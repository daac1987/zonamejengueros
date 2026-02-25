'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ImageIcon } from 'lucide-react';

export default function NoticiasPage() {
    const [noticias, setNoticias] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoriaNoticias, setCategoriaNoticias] = useState<any[]>([]);
    const [filtroActivo, setFiltroActivo] = useState('TODAS');

    useEffect(() => {
        const fetchNoticias = async () => {
            try {
                const res = await fetch('/api/noticias');
                const data = await res.json();
                if (res.ok) setNoticias(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNoticias();
    }, []);

    useEffect(() => {
        const loadCategorias = async () => {
            const res = await fetch('/api/categoria_noticias');
            if (res.ok) {
                const data = await res.json();
                setCategoriaNoticias(data);
            }
        };
        loadCategorias();
    }, []);

    const noticiasFiltradas = filtroActivo === 'TODAS'
        ? noticias
        : noticias.filter(n => {
            const catNombre = categoriaNoticias.find(
                c => Number(c.categoria_noticia_id) === Number(n.categoria_noticia_id)
            )?.categoria_noticia || 'GENERAL';
            return catNombre.toUpperCase() === filtroActivo;
        });

    return (
        <div className="min-h-screen bg-black pt-28 pb-20 px-4">
            <div className="max-w-6xl mx-auto">

                {/* --- ENCABEZADO --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b-4 border-[#facf00] pb-6">
                    <div>
                        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none text-white">
                            EL <span className="text-[#facf00]">DIARIO</span>
                        </h1>
                        <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-xs mt-2">Crónicas del fútbol de barrio</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[#facf00] font-black italic text-xl uppercase">
                            {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* --- FILTROS --- */}
                {!loading && (
                    <div className="flex flex-wrap gap-6 mb-12 border-b border-white/10 pb-4">
                        {['TODAS', ...categoriaNoticias.map(c => c.categoria_noticia.toUpperCase())].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFiltroActivo(cat)}
                                className={`text-[10px] font-black uppercase tracking-[0.2em] italic transition-all ${filtroActivo === cat
                                    ? 'text-[#facf00] border-b-2 border-[#facf00] mb-[-1px]'
                                    : 'text-gray-500 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                {/* --- GRID DE NOTICIAS (ESTILO SOLICITADO) --- */}
                {loading ? (
                    <div className="text-center py-20 text-[#facf00] font-black italic animate-pulse">CARGANDO...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {noticiasFiltradas.map((news) => {
                            const nombreCategoria = categoriaNoticias.find(
                                c => Number(c.categoria_noticia_id) === Number(news.categoria_noticia_id)
                            )?.categoria_noticia || 'GENERAL';

                            return (
                                <Link key={news.id || news.noticia_id} href={`/noticias/${news.usuario_id}`}>
                                    <div className="group bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-[#facf00]/50 transition-all flex flex-col h-full">

                                        {/* Imagen con Badge */}
                                        <div className="h-56 bg-gray-900 relative overflow-hidden">
                                            <img
                                                src={news.foto_noticia_url}
                                                alt={news.titulo_noticia}
                                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                                            />
                                            <div className="absolute top-6 left-6">
                                                <span className="bg-[#facf00] text-black text-[9px] font-black px-3 py-1 rounded-full uppercase italic">
                                                    {nombreCategoria} 
                                                </span>
                                            </div>
                                            <div className="absolute bottom-0 left-2">
                                                <h3 className="text-white font-black italic text-2xl uppercase leading-none bg-black/50 px-2 py-1 rounded-tr-full rounded-br-full mb-1 group-hover:text-[#facf00] transition-colors">
                                                    {news.nombre_autor}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Contenido (Sin botón de leer más, fecha arriba) */}
                                        <div className="p-8 flex flex-col flex-grow">
                                            <h3 className="text-white font-black italic text-2xl uppercase leading-none mb-4 group-hover:text-[#facf00] transition-colors">
                                                {news.titulo_noticia}
                                            </h3>
                                            <p className="text-gray-400 text-sm font-medium leading-relaxed italic uppercase opacity-80 line-clamp-3">
                                                {news.texto_noticia}
                                            </p>
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">
                                                    {news.fecha_noticia ? new Date(news.fecha_noticia).toLocaleDateString() : 'RECIENTE'}
                                                </span>
                                            </div>
                                            {/* Footer de la Card */}
                                            <div className="mt-1 pt- border-t border-white/5 flex justify-between items-center">
                                                <span className="text-[#facf00] text-[9px] font-black uppercase tracking-widest italic">
                                                    Ver más de {news.nombre_autor || "Autor"}
                                                </span>
                                                <span className="text-white opacity-20 group-hover:opacity-100 transition-opacity">→</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* --- FOOTER REGRESAR --- */}
                <div className="mt-12 text-center">
                    <button onClick={() => window.history.back()} className="text-[#facf00] font-black italic text-xs uppercase tracking-widest border-b border-[#facf00] pb-1 hover:text-white transition-all">
                        ← Volver atrás
                    </button>
                </div>
            </div>
        </div>
    );
}