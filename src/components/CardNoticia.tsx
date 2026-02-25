'use client';
import { ImageIcon, Trash2 } from 'lucide-react';

interface CardNoticiaProps {
    noticia: any;
    nombreCancha: string;
    categorias?: any[];
    onDelete: (id: any) => void;
}


export default function CardNoticia({ noticia, nombreCancha, categorias, onDelete }: CardNoticiaProps) {
    const nombreCategoria = categorias?.find(
        cat => Number(cat.categoria_noticia_id) === Number(noticia.categoria_noticia_id)
    )?.categoria_noticia || 'Sin Categoría';
    return (
        <div className="group bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-[#facf00]/50 transition-all flex flex-col h-full shadow-xl">
            {/* Cabecera de la Imagen */}
            <div className="h-52 bg-zinc-900 relative overflow-hidden">
                {noticia.foto_noticia_url ? (
                    <img
                        src={noticia.foto_noticia_url}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                        alt="Noticia"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                        <ImageIcon size={40} />
                    </div>
                )}
                <div className="absolute top-6 left-6">
                    <span className="bg-[#facf00] text-black text-[9px] font-black px-3 py-1 rounded-full uppercase italic">
                        {nombreCategoria}
                    </span>
                </div>
            </div>

            {/* Contenido de la Noticia */}
            <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">
                        {noticia.fecha_noticia ? new Date(noticia.fecha_noticia).toLocaleDateString() : ''}
                    </span>
                    <span className="text-[#facf00] font-black text-[10px] uppercase italic">
                        • {nombreCancha || 'MI COMPLEJO'}
                    </span>
                </div>

                <h3 className="text-white font-black italic text-2xl uppercase leading-none mb-4 group-hover:text-[#facf00] transition-colors">
                    {noticia.titulo_noticia}
                </h3>

                <p className="text-zinc-400 text-sm font-medium leading-relaxed italic uppercase opacity-80 line-clamp-3 mb-6">
                    {noticia.texto_noticia}
                </p>

                {/* Footer con Botón de Borrar */}
                <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                    <button
                        onClick={() => onDelete(noticia.noticia_id || noticia.id)}
                        className="text-red-500 hover:text-red-400 flex items-center gap-2 transition-colors group/btn"
                    >
                        <Trash2 size={14} className="group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[9px] font-black uppercase tracking-widest italic">Borrar Noticia</span>
                    </button>
                </div>
            </div>
        </div>
    );
}