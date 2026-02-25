'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import FormularioNoticia from '@/src/components/FormularioNoticia';
import CardNoticia from '@/src/components/CardNoticia';
import {
    MapPin, Phone, ImageIcon, Plus, Settings,
    Megaphone, Trash2, LogOut, Camera, Info, Home, LogOut as LogOutIcon
} from 'lucide-react';

export default function DashboardCancha() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [usuario_id, setUsuarioId] = useState<string | null>(null);
    const [categoriaNoticias, setCategoriaNoticias] = useState<any[]>([]);

    // 1. Estados iniciales
    const [cancha, setCancha] = useState({
        cancha_id: '',
        nombre_cancha: '',
        telefono_cancha: '',
        provincia_cancha: '',
        ubicacion_cancha: '',
        encargado_cancha: '',
        grama_cancha: '',
        precio_cancha: '',
        horario_cancha: '',
        servicios_cancha: '',
        sede_url: '',
        foto_cancha_uno_url: '',
        foto_cancha_dos_url: ''
    });

    const [noticias, setNoticias] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
        const id = localStorage.getItem('usuario_id');
        if (!id) { router.push('/auth'); return; }
        setUsuarioId(id);
        cargarDatos(id);
    }, []);

    const cargarDatos = async (id: string) => {
        try {
            const res = await fetch(`/api/cancha/dashboard?id=${id}`);
            const data = await res.json();

            if (res.ok && data) {
                setCancha({
                    ...data,
                    nombre_cancha: data.nombre_cancha || '',
                    telefono_cancha: data.telefono_cancha || '',
                    encargado_cancha: data.encargado_cancha || '',
                    grama_cancha: data.grama_cancha || '',
                    precio_cancha: data.precio_cancha || '',
                    horario_cancha: data.horario_cancha || '',
                    servicios_cancha: data.servicios_cancha || '',
                    sede_url: data.sede_url || '',
                    foto_cancha_uno_url: data.foto_sede_uno_url || '',
                    foto_cancha_dos_url: data.foto_sede_dos_url || ''
                });
            }

            const resN = await fetch(`/api/noticias?usuario_id=${id}`);
            if (resN.ok) {
                const dataN = await resN.json();
                setNoticias(Array.isArray(dataN) ? dataN : []);
            }
        } catch (e) {
            toast.error("Error al sincronizar datos");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, campo: string) => {
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
                    setCancha(prev => ({ ...prev, [campo]: data.url }));
                    toast.success('Imagen lista', { id: tId });
                }
            } catch (error) {
                toast.error('Error al subir archivo', { id: tId });
            }
        };
        reader.readAsDataURL(file);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const tId = toast.loading('Actualizando información...');
        const res = await fetch('/api/cancha/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cancha),
        });

        if (res.ok) toast.success('Perfil actualizado', { id: tId });
        else toast.error('Error al guardar', { id: tId });
    };

    const handleDeleteNews = async (id: any) => {
        if (!id) return;

        const result = await Swal.fire({
            title: '¿ELIMINAR NOTICIA?',
            text: "Esta acción no se puede deshacer en el diario.",
            icon: 'warning',
            showCancelButton: true,
            background: '#111',
            color: '#fff',
            confirmButtonColor: '#facf00',
            cancelButtonColor: '#333',
            confirmButtonText: 'SÍ, BORRAR',
            cancelButtonText: 'CANCELAR',
            customClass: {
                popup: 'rounded-[2rem] border border-white/10',
                title: 'font-black italic uppercase tracking-tighter',
                confirmButton: 'rounded-xl font-black italic uppercase text-black',
                cancelButton: 'rounded-xl font-black italic uppercase'
            }
        });

        if (result.isConfirmed) {
            const tId = toast.loading('Eliminando de los archivos...');
            try {
                const res = await fetch(`/api/noticias?id=${id}`, { method: 'DELETE' });
                if (res.ok) {
                    toast.success('Noticia eliminada', { id: tId });
                    if (usuario_id) cargarDatos(usuario_id);
                } else {
                    toast.error('Error al borrar', { id: tId });
                }
            } catch (error) {
                toast.error('Error de red', { id: tId });
            }
        }
    };

    // Cargar categorías de noticias al montar el componente
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

    return (
        <div className="min-h-screen bg-transparent text-white p-8">
            <header className="max-w-7xl mx-auto mb-12 flex items-center justify-between border-b border-white/10 pb-8">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-zinc-900 border-2 border-[#facf00] rounded-2xl overflow-hidden relative group">
                        <img src={cancha.sede_url || '/placeholder.png'} className="w-full h-full object-cover" alt="Sede" />
                        <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
                            <Camera size={20} /><input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'sede_url')} />
                        </label>
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter">{cancha.nombre_cancha || 'Mi Complejo'}</h1>
                        <p className="text-[#facf00] font-bold text-xs uppercase tracking-widest">Panel de Administración</p>
                    </div>
                </div>
                <button
                    onClick={() => { localStorage.clear(); router.push('/auth') }}
                    className="flex items-center gap-3 px-6 py-3 bg-zinc-900/50 rounded-2xl text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all border border-white/5 group"
                >
                    <span className="text-[10px] font-black uppercase italic tracking-widest">Cerrar Sesión</span>
                    <LogOutIcon size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-5 bg-[#111] p-8 rounded-[2.5rem] border border-white/5 h-fit shadow-2xl">
                    <h2 className="text-xl font-black uppercase italic mb-6 flex items-center gap-2 text-[#facf00]"><Settings size={20} /> Datos del Complejo</h2>
                    <form onSubmit={handleUpdate} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Nombre del Complejo</label>
                            <input value={cancha.nombre_cancha} onChange={e => setCancha({ ...cancha, nombre_cancha: e.target.value })} className="w-full bg-black p-4 rounded-xl border border-white/5 outline-none focus:border-[#facf00] font-bold" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Teléfono Directo</label>
                                <input value={cancha.telefono_cancha} onChange={e => setCancha({ ...cancha, telefono_cancha: e.target.value })} className="w-full bg-black p-4 rounded-xl border border-white/5 outline-none focus:border-[#facf00]" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Responsable</label>
                                <input value={cancha.encargado_cancha} onChange={e => setCancha({ ...cancha, encargado_cancha: e.target.value })} className="w-full bg-black p-4 rounded-xl border border-white/5 outline-none focus:border-[#facf00]" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">TIPO DE GRAMILLA</label>
                                <select className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]"
                                    value={cancha.grama_cancha}
                                    onChange={e => setCancha({ ...cancha, grama_cancha: e.target.value })}>
                                    <option>Sintética</option><option>Natural</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest text-[#facf00]">Precio (Solo números)</label>
                                <input
                                    type="number"
                                    value={cancha.precio_cancha}
                                    onChange={e => setCancha({ ...cancha, precio_cancha: e.target.value })}
                                    placeholder="Ej: 21000"
                                    className="w-full bg-black p-4 rounded-xl border border-white/5 outline-none focus:border-[#facf00] font-bold"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest text-[#facf00]">Horario Disponible</label>
                            <input value={cancha.horario_cancha} onChange={e => setCancha({ ...cancha, horario_cancha: e.target.value })} className="w-full bg-black p-4 rounded-xl border border-white/5 outline-none focus:border-[#facf00] font-bold" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest text-[#facf00]">Servicios y Extras</label>
                            <textarea value={cancha.servicios_cancha} onChange={e => setCancha({ ...cancha, servicios_cancha: e.target.value })} className="w-full bg-black p-4 rounded-xl border border-white/5 h-20 outline-none focus:border-[#facf00] text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="bg-black border border-dashed border-white/10 p-2 rounded-2xl cursor-pointer hover:border-[#facf00] block aspect-video relative overflow-hidden group/img">
                                {cancha.foto_cancha_uno_url ? <img src={cancha.foto_cancha_uno_url} className="w-full h-full object-cover rounded-lg" alt="Cancha 1" /> : <div className="h-full flex items-center justify-center"><Plus className="text-zinc-700" /></div>}
                                <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'foto_cancha_uno_url')} />
                            </label>
                            <label className="bg-black border border-dashed border-white/10 p-2 rounded-2xl cursor-pointer hover:border-[#facf00] block aspect-video relative overflow-hidden group/img">
                                {cancha.foto_cancha_dos_url ? <img src={cancha.foto_cancha_dos_url} className="w-full h-full object-cover rounded-lg" alt="Cancha 2" /> : <div className="h-full flex items-center justify-center"><Plus className="text-zinc-700" /></div>}
                                <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'foto_cancha_dos_url')} />
                            </label>
                        </div>
                        <button className="w-full bg-[#facf00] text-black font-black uppercase italic py-4 rounded-2xl hover:bg-white transition-all shadow-lg transform active:scale-95">Guardar Cambios</button>
                    </form>
                </div>

                <div className="lg:col-span-7 space-y-8">
                    {usuario_id && (
                        <FormularioNoticia
                            usuarioId={usuario_id}
                            onNoticiaCreada={() => cargarDatos(usuario_id)}
                        />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {noticias.length > 0 ? (
                            noticias.map((noticia) => (
                                <CardNoticia
                                    key={noticia.noticia_id}
                                    noticia={noticia}
                                    nombreCancha={cancha.nombre_cancha}
                                    categorias={categoriaNoticias} // Aquí corregí el nombre de la variable
                                    onDelete={handleDeleteNews}
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-20 border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center bg-[#111]/50">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                    <ImageIcon className="text-zinc-600" size={32} />
                                </div>
                                <h3 className="text-zinc-500 font-black italic uppercase tracking-widest text-xl">
                                    Sin crónicas publicadas
                                </h3>
                                <p className="text-zinc-700 font-bold text-[10px] uppercase mt-2 italic">
                                    Tus noticias aparecerán aquí una vez que las publiques
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}