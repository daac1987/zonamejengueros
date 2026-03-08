'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import FormularioNoticia from '@/src/components/FormularioNoticia';
import CardNoticia from '@/src/components/CardNoticia';
import {
    MapPin, Phone, Shield, Plus, Settings,
    Trash2, Camera, Info, Home, LogOut as LogOutIcon, Users, Trophy
} from 'lucide-react';

export default function DashboardEquipo() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [usuario_id, setUsuarioId] = useState<string | null>(null);
    const [categoriasNoticias, setCategoriasNoticias] = useState<any[]>([]);
    const [canchasDB, setCanchasDB] = useState<any[]>([]);

    // Auxiliares para selects
    const [catEquipos, setCatEquipos] = useState<any[]>([]);
    const [modalidades, setModalidades] = useState<any[]>([]);
    const [tieneSede, setTieneSede] = useState(false);
    const [canchaSeleccionada, setCanchaSeleccionada] = useState('');

    const [equipo, setEquipo] = useState({
        equipo_id: '',
        nombre_equipo: '',
        telefono_equipo: '',
        provincia_equipo: '',
        ubicacion_equipo: '',
        encargado_equipo: '',
        logros_equipo: '',
        categoria_equipo_id: '',
        cantidad_jugadores_id: '',
        logo_url: '',
        foto_equipo_uno_url: '',
        foto_equipo_dos_url: '',
        sede_equipo: [{
            cancha_id: '',
            cancha: {
                nombre_cancha: '',
                ubicacion_cancha: '',
                provincia_cancha: ''
            }
        }]
    });

    const [noticias, setNoticias] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
        const id = localStorage.getItem('usuario_id');
        if (!id) { router.push('/auth'); return; }
        setUsuarioId(id);
        cargarDatos(id);
        cargarAuxiliares();
    }, []);

    const cargarAuxiliares = async () => {
        // Agregué resCan para las canchas
        const [resCat, resMod, resNot, resCan] = await Promise.all([
            fetch('/api/categoria_equipo'),
            fetch('/api/cantidad_jugadores'),
            fetch('/api/categoria_noticias'),
            fetch('/api/canchas'), // Esta es la ruta de canchas
        ]);

        if (resCat.ok) setCatEquipos(await resCat.json());
        if (resMod.ok) setModalidades(await resMod.json());
        if (resNot.ok) setCategoriasNoticias(await resNot.json());
        if (resCan.ok) setCanchasDB(await resCan.json());
    };

    const cargarDatos = async (id: string) => {
        try {
            const res = await fetch(`/api/equipo/perfil?id=${id}`);
            const data = await res.json();

            if (res.ok && data) {
                setEquipo({
                    ...data,
                    // Mapeamos los campos básicos
                    nombre_equipo: data.nombre_equipo || '',
                    telefono_equipo: data.telefono_equipo || '',
                    provincia_equipo: data.provincia_equipo || '',
                    ubicacion_equipo: data.ubicacion_equipo || '',
                    encargado_equipo: data.encargado_equipo || '',
                    logros_equipo: data.logros_equipo || '',
                    categoria_equipo_id: data.categoria_equipo_id || '',
                    cantidad_jugadores_id: data.cantidad_jugadores_id || '',
                    logo_url: data.logo_url || '',
                    foto_equipo_uno_url: data.foto_equipo_uno_url || '',
                    foto_equipo_dos_url: data.foto_equipo_dos_url || '',

                    // IMPORTANTE: Manejo de la sede
                    // Si data.sede_equipo existe y tiene algo, lo usamos. 
                    // Si no, usamos la estructura vacía que definiste.
                    sede_equipo: (data.sede_equipo && data.sede_equipo.length > 0)
                        ? data.sede_equipo
                        : [{
                            cancha_id: '',
                            cancha: { nombre_cancha: '', ubicacion_cancha: '', provincia_cancha: '' }
                        }]
                });
            } // Debug para verificar la estructura de datos
            const resN = await fetch(`/api/noticias?usuario_id=${id}`);
            if (resN.ok) {
                const dataN = await resN.json();
                setNoticias(Array.isArray(dataN) ? dataN : []);
            }
        } catch (e) {
            toast.error("Error al sincronizar datos del equipo");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, campo: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const tId = toast.loading('Subiendo imagen del club...');
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
                    setEquipo(prev => ({ ...prev, [campo]: data.url }));
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
        const tId = toast.loading('Actualizando plantel...');
        const res = await fetch('/api/equipo/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(equipo),
        });

        if (res.ok) toast.success('Perfil de equipo actualizado', { id: tId });
        else toast.error('Error al guardar cambios', { id: tId });
    };

    const handleDeleteNews = async (id: any) => {
        const result = await Swal.fire({
            title: '¿ELIMINAR COMUNICADO?',
            text: "La noticia se borrará del feed del equipo.",
            icon: 'warning',
            showCancelButton: true,
            background: '#111',
            color: '#fff',
            confirmButtonColor: '#facf00',
            cancelButtonColor: '#333',
            confirmButtonText: 'BORRAR',
            customClass: {
                popup: 'rounded-[2rem] border border-white/10',
                title: 'font-black italic uppercase',
                confirmButton: 'rounded-xl font-black italic text-black',
            }
        });

        if (result.isConfirmed) {
            const tId = toast.loading('Eliminando noticia...');
            const res = await fetch(`/api/noticias?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Noticia eliminada', { id: tId });
                if (usuario_id) cargarDatos(usuario_id);
            }
        }
    };

    return (
        <div className="min-h-screen bg-transparent text-white p-8">
            <header className="max-w-7xl mx-auto mb-12 flex items-center justify-between border-b border-white/10 pb-8">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-zinc-900 border-2 border-[#facf00] rounded-2xl overflow-hidden relative group">
                        <img src={equipo.logo_url || '/placeholder-team.png'} className="w-full h-full object-cover" alt="Escudo" />
                        <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
                            <Camera size={20} /><input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'logo_url')} />
                        </label>
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter">{equipo.nombre_equipo || 'Nuevo Equipo'}</h1>
                        <p className="text-[#facf00] font-bold text-xs uppercase tracking-widest">Panel de Administración de Equipo</p>
                    </div>
                </div>
                <button
                    onClick={() => { localStorage.clear(); router.push('/auth') }}
                    className="flex items-center gap-3 px-6 py-3 bg-zinc-900/50 rounded-2xl text-zinc-500 hover:text-red-500 hover:bg-red-500/10 border border-white/5 group"
                >
                    <span className="text-[10px] font-black uppercase italic tracking-widest">Salir</span>
                    <LogOutIcon size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* --- LADO IZQUIERDO: FORMULARIO EQUIPO --- */}
                <div className="lg:col-span-5 bg-[#111] p-8 rounded-[2.5rem] border border-white/5 h-fit shadow-2xl">
                    <h2 className="text-xl font-black uppercase italic mb-6 flex items-center gap-2 text-[#facf00]"><Shield size={20} /> Datos del Club</h2>
                    <form onSubmit={handleUpdate} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Nombre del Equipo</label>
                            <input value={equipo.nombre_equipo} onChange={e => setEquipo({ ...equipo, nombre_equipo: e.target.value })} className="w-full bg-black p-4 rounded-xl border border-white/5 outline-none focus:border-[#facf00] font-bold" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Encargado</label>
                                <input value={equipo.encargado_equipo} onChange={e => setEquipo({ ...equipo, encargado_equipo: e.target.value })} className="w-full bg-black p-4 rounded-xl border border-white/5 outline-none focus:border-[#facf00]" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Teléfono</label>
                                <input value={equipo.telefono_equipo} onChange={e => setEquipo({ ...equipo, telefono_equipo: e.target.value })} className="w-full bg-black p-4 rounded-xl border border-white/5 outline-none focus:border-[#facf00]" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest text-[#facf00]">Categoría</label>
                                <select
                                    value={equipo.categoria_equipo_id}
                                    onChange={e => setEquipo({ ...equipo, categoria_equipo_id: e.target.value })}
                                    className="w-full bg-black p-4 rounded-xl border border-white/5 outline-none focus:border-[#facf00] font-bold text-xs"
                                >
                                    <option value="">Seleccionar...</option>
                                    {catEquipos.map(c => <option key={c.categoria_equipo_id} value={c.categoria_equipo_id}>{c.categoria_equipo}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest text-[#facf00]">Modalidad</label>
                                <select
                                    value={equipo.cantidad_jugadores_id}
                                    onChange={e => setEquipo({ ...equipo, cantidad_jugadores_id: e.target.value })}
                                    className="w-full bg-black p-4 rounded-xl border border-white/5 outline-none focus:border-[#facf00] font-bold text-xs"
                                >
                                    <option value="">Seleccionar...</option>
                                    {modalidades.map(m => <option key={m.cantidad_jugadores_id} value={m.cantidad_jugadores_id}>{m.cantidad_jugadores}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest"><Trophy size={10} className="inline mr-1" /> Logros y Palmarés (Despues de cada registro usar ,)</label>
                            <textarea value={equipo.logros_equipo} onChange={e => setEquipo({ ...equipo, logros_equipo: e.target.value })} className="w-full bg-black p-4 rounded-xl border border-white/5 h-20 outline-none focus:border-[#facf00] text-sm" placeholder="Ej: Campeón Torneo Apertura 2023..." />
                        </div>

                        {/* SECCIÓN DE SEDE */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <div className="px-2">
                                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Sede Actual:</span>
                                <p className="text-sm font-bold text-white italic">
                                    {/* Acceso seguro a la relación de la sede */}
                                    {equipo.sede_equipo?.[0]?.cancha?.nombre_cancha || 'NO ASIGNADA'}
                                </p>
                                {equipo.sede_equipo?.[0]?.cancha && (
                                    <p className="text-[10px] text-zinc-400">
                                        {equipo.sede_equipo[0].cancha.ubicacion_cancha}, {equipo.sede_equipo[0].cancha.provincia_cancha}
                                    </p>
                                )}
                            </div>
                            {/* Switch para mostrar el selector */}
                            <div className="flex items-center justify-between bg-black/40 p-3 rounded-2xl border border-white/5">
                                <span className="text-[9px] font-black uppercase italic">¿Cambiar Sede?</span>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setTieneSede(true)}
                                        className={`px-4 py-1.5 rounded-lg font-black text-[9px] transition-colors ${tieneSede ? 'bg-[#facf00] text-black' : 'bg-zinc-800 text-zinc-500'}`}
                                    >
                                        SÍ
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setTieneSede(false);
                                            setCanchaSeleccionada('');
                                        }}
                                        className={`px-4 py-1.5 rounded-lg font-black text-[9px] transition-colors ${!tieneSede ? 'bg-[#facf00] text-black' : 'bg-zinc-800 text-zinc-500'}`}
                                    >
                                        NO
                                    </button>
                                </div>
                            </div>

                            {tieneSede && (
                                <div className="space-y-3 bg-black/60 p-4 rounded-2xl border border-[#facf00]/20">
                                    <select
                                        value={canchaSeleccionada}
                                        onChange={(e) => {
                                            const idSeleccionado = e.target.value;
                                            setCanchaSeleccionada(idSeleccionado);

                                            const canchaEncontrada = canchasDB.find(c => c.id.toString() === idSeleccionado);
                                            if (canchaEncontrada) {
                                                setEquipo(prev => ({
                                                    ...prev,
                                                    // Actualizamos la relación localmente para el feedback visual
                                                    sede_equipo: [{
                                                        cancha_id: canchaEncontrada.id,
                                                        cancha: {
                                                            nombre_cancha: canchaEncontrada.nombre_cancha,
                                                            ubicacion_cancha: canchaEncontrada.ubicacion_cancha,
                                                            provincia_cancha: canchaEncontrada.provincia_cancha
                                                        }
                                                    }]
                                                }));
                                            }
                                        }}
                                        className="w-full bg-black border border-white/10 p-3 rounded-xl text-xs font-bold outline-none focus:border-[#facf00]"
                                    >
                                        <option value="">-- Seleccionar Cancha Registrada --</option>
                                        {canchasDB.map(c => (
                                            <option key={c.id} value={c.id}>
                                                {c.nombre} ({c.zona})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>


                        <div className="grid grid-cols-2 gap-4">
                            <label className="bg-black border border-dashed border-white/10 p-2 rounded-2xl cursor-pointer hover:border-[#facf00] block aspect-video relative overflow-hidden group/img">
                                {equipo.foto_equipo_uno_url ? <img src={equipo.foto_equipo_uno_url} className="w-full h-full object-cover rounded-lg" alt="Equipo 1" /> : <div className="h-full flex items-center justify-center text-[10px] text-zinc-700 font-bold uppercase italic"><Camera className="mr-2" size={14} /> Foto 1</div>}
                                <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'foto_equipo_uno_url')} />
                            </label>
                            <label className="bg-black border border-dashed border-white/10 p-2 rounded-2xl cursor-pointer hover:border-[#facf00] block aspect-video relative overflow-hidden group/img">
                                {equipo.foto_equipo_dos_url ? <img src={equipo.foto_equipo_dos_url} className="w-full h-full object-cover rounded-lg" alt="Equipo 2" /> : <div className="h-full flex items-center justify-center text-[10px] text-zinc-700 font-bold uppercase italic"><Camera className="mr-2" size={14} /> Foto 2</div>}
                                <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'foto_equipo_dos_url')} />
                            </label>
                        </div>

                        <button className="w-full bg-[#facf00] text-black font-black uppercase italic py-4 rounded-2xl hover:bg-white transition-all shadow-lg transform active:scale-95">
                            Guardar Plantilla
                        </button>
                    </form>
                </div>

                {/* --- LADO DERECHO: NOTICIAS DEL EQUIPO --- */}
                <div className="lg:col-span-7 space-y-8">
                    {usuario_id && (
                        <FormularioNoticia
                            usuarioId={usuario_id}
                            onNoticiaCreada={() => cargarDatos(usuario_id)}
                        />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {mounted && noticias.map((n: any) => (
                            <CardNoticia
                                key={n.noticia_id || n.id}
                                noticia={n}
                                nombreCancha={equipo.nombre_equipo}
                                categorias={categoriasNoticias}
                                onDelete={handleDeleteNews}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}