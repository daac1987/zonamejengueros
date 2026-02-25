'use client';
import { useState, useEffect } from 'react';
import { Megaphone, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface FormularioNoticiaProps {
    usuarioId: string | number;
    onNoticiaCreada: () => void; // Para recargar la lista de noticias después de publicar
}

export default function FormularioNoticia({ usuarioId, onNoticiaCreada }: FormularioNoticiaProps) {
    const [categoriaNoticias, setCategoriaNoticias] = useState<{ categoria_noticia_id: number, categoria_noticia: string }[]>([]);
    const [nuevaNoticia, setNuevaNoticia] = useState({
        titulo_noticia: '',
        texto_noticia: '',
        foto_noticia_url: '',
        categoria_noticia_id: ''
    });

    // Estado para categorías de noticias
    useEffect(() => {
        const loadCategoriaNoticias = async () => {
            const res = await fetch('/api/categoria_noticias');
            if (res.ok) {
                const data = await res.json();
                setCategoriaNoticias(data);
            }
        };
        loadCategoriaNoticias();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const tId = toast.loading('Subiendo imagen...');
        const reader = new FileReader();

        reader.onloadend = async () => {
            const base64 = reader.result as string;
            try {
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ file: base64, fileName: file.name }),
                });
                const data = await res.json();
                if (res.ok && data.url) {
                    setNuevaNoticia(prev => ({ ...prev, foto_noticia_url: data.url }));
                    toast.success('Imagen lista', { id: tId });
                }
            } catch (error) {
                toast.error('Error al subir archivo', { id: tId });
            }
        };
        reader.readAsDataURL(file);
    };

    const handleCreateNews = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nuevaNoticia.titulo_noticia || !nuevaNoticia.texto_noticia) {
            toast.error("El título y el texto son obligatorios");
            return;
        }

        const tId = toast.loading('Publicando noticia...');
        try {
            const res = await fetch('/api/noticias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...nuevaNoticia,
                    usuario_id: parseInt(usuarioId.toString())
                }),
            });

            if (res.ok) {
                toast.success('¡Noticia publicada!', { id: tId });
                setNuevaNoticia({ titulo_noticia: '', texto_noticia: '', foto_noticia_url: '', categoria_noticia_id: '' });
                onNoticiaCreada(); // Ejecuta la recarga en el padre
            }
        } catch (error) {
            toast.error('Error de red', { id: tId });
        }
    };

    return (
        <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <h3 className="text-xl font-black uppercase italic mb-6 flex items-center gap-2">
                <Megaphone size={20} className="text-[#facf00]" /> Publicar Noticia
            </h3>
            <form onSubmit={handleCreateNews} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest text-[#facf00]">Categoría</label>
                    <select
                        value={nuevaNoticia.categoria_noticia_id}
                        onChange={e => setNuevaNoticia({ ...nuevaNoticia, categoria_noticia_id: e.target.value })}
                        className="w-full bg-black p-4 rounded-xl border border-white/5 outline-none focus:border-[#facf00] font-black text-xs uppercase appearance-none cursor-pointer text-[#facf00]">
                        <option value="">Seleccione categoría</option>
                        {categoriaNoticias.map((cat) => (
                            <option key={cat.categoria_noticia_id} value={cat.categoria_noticia_id}>
                                {cat.categoria_noticia}
                            </option>
                        ))}
                    </select>
                </div>
                <input
                    placeholder="Título de la noticia..."
                    value={nuevaNoticia.titulo_noticia}
                    onChange={e => setNuevaNoticia({ ...nuevaNoticia, titulo_noticia: e.target.value })}
                    className="w-full bg-black p-4 rounded-xl border border-white/5 outline-none focus:border-[#facf00] font-bold"
                />
                <textarea
                    placeholder="¿Qué quieres contar hoy?..."
                    value={nuevaNoticia.texto_noticia}
                    onChange={e => setNuevaNoticia({ ...nuevaNoticia, texto_noticia: e.target.value })}
                    className="w-full bg-black p-4 rounded-xl border border-white/5 h-24 outline-none focus:border-[#facf00] text-sm"
                />
                <div className="flex items-center gap-4">
                    <label className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 p-4 rounded-xl border border-white/5 cursor-pointer hover:border-[#facf00] transition-all">
                        <ImageIcon size={18} className="text-[#facf00]" />
                        <span className="text-[10px] font-black uppercase">
                            {nuevaNoticia.foto_noticia_url ? 'Imagen Lista' : 'Adjuntar Imagen'}
                        </span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                    <button type="submit" className="bg-white text-black px-10 py-4 rounded-xl font-black uppercase italic text-xs hover:bg-[#facf00] transition-all">
                        Publicar
                    </button>
                </div>
            </form>
        </div>
    );
}