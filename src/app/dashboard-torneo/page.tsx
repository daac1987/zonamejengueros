'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    Trophy, Users, Calendar, Award, ShieldCheck,
    Megaphone, Plus, LogOut as LogOutIcon, Settings, Camera,
    Search, MapPin, Target, ListOrdered, Trash2, Send, Image as ImageIcon
} from 'lucide-react';
import FormularioNoticia from '@/src/components/FormularioNoticia';
import CardNoticia from '@/src/components/CardNoticia';
import Swal from 'sweetalert2';
import VincularEquipos from '@/src/components/VincularEquipos';
import EquiposIncritos from '@/src/components/BorrarEquiposInscritos';
import TablaPosiciones from '@/src/components/TablaPosicionesActualizar';
import TablaGoleadores from '@/src/components/TablaGoleadorActualizar';

export default function DashboardTorneo() {
    const [refreshKey, setRefreshKey] = useState(0);
    const handleRefresh = () => setRefreshKey(prev => prev + 1);
    const router = useRouter();

    interface TorneoState {
        torneo_id: string | number;
        nombre_torneo: string;
        encargado_torneo: string;
        telefono_torneo: string;
        provincia_torneo: string;
        ubicacion_torneo: string;
        categoria_torneo: string;
        especificaciones_torneo: string;
        cantidad_equipos_torneo: string | number;
        precio_inscripcion_torneo: string | number; // <--- NUEVO CAMPO
        logo_url: string;
        premioUno_torneo: string;
        premioDos_torneo: string;
        premioTres_torneo: string;
        estado_torneo: string;
        fecha_inicio: string;
        cantidad_jugadores_id: number;
        cantidad_jugadores: any;
        categoria_equipo_id: number;
        categoria_equipo: any;
        sede_torneo: any[]; // <--- AQUÍ está el truco: le decimos que es un array de cualquier cosa
    }

    // 1. ESTADO DEL TORNEO
    const [torneo, setTorneo] = useState<TorneoState>({
        torneo_id: '',
        nombre_torneo: '',
        encargado_torneo: '',
        telefono_torneo: '',
        provincia_torneo: '',
        ubicacion_torneo: '',
        categoria_torneo: '',
        especificaciones_torneo: '',
        cantidad_equipos_torneo: '',
        precio_inscripcion_torneo: '', // <--- INICIALIZAMOS EL NUEVO CAMPO
        logo_url: '',
        premioUno_torneo: '',
        premioDos_torneo: '',
        premioTres_torneo: '',
        estado_torneo: 'ACTIVO',
        fecha_inicio: '',
        // Si necesitas manejar la cantidad de jugadores (Fútbol 5, 7, etc)
        cantidad_jugadores_id: 0,
        cantidad_jugadores: {
            cantidad_jugadores_id: 0,
            cantidad_jugadores: '' // Aquí se guardará el número (ej: 5, 7, 11)
        },
        categoria_equipo_id: 0,
        categoria_equipo: {
            categoria_equipo_id: 0,
            categoria_equipo: '' // Aquí se guardará el nombre (ej: INFANTIL)
        },
        sede_torneo: []
    });

    // 2. ESTADOS DE CONTROL Y LISTAS
    const [canchasDB, setCanchasDB] = useState<any[]>([]);
    const [equiposDB, setEquiposDB] = useState<any[]>([]);
    const [equiposInscritos, setEquiposInscritos] = useState<any[]>([]);
    const [noticias, setNoticias] = useState<any[]>([]);
    const [catTorneo, setCatTorneo] = useState<any[]>([]);
    const [canJugadores, setCanJugadores] = useState<any[]>([]);
    const [categoriasNoticias, setCategoriasNoticias] = useState<any[]>([]);
    const [mounted, setMounted] = useState(false);
    const [usuario_id, setUsuarioId] = useState<string | null>(null);

    const [nuevaNoticia, setNuevaNoticia] = useState({
        titulo_noticia: '',
        texto_noticia: '',
        foto_noticia_url: ''
    });

    const [tieneSede, setTieneSede] = useState(false);
    const [canchaSeleccionada, setCanchaSeleccionada] = useState('');
    const [otraUbicacion, setOtraUbicacion] = useState('');

    useEffect(() => {
        const id = localStorage.getItem('usuario_id');
        if (!id) { router.push('/auth'); return; }
        setUsuarioId(id);
        cargarDatos(id);
        cargarListas();
    }, []);

    const cargarDatos = async (id: string) => {
        try {
            const res = await fetch(`/api/torneo/perfil?id=${id}`);
            const data = await res.json();
            if (res.ok) setTorneo(data);
            const resN = await fetch(`/api/noticias?usuario_id=${id}`);
            if (resN.ok) {
                const dataN = await resN.json();
                setNoticias(Array.isArray(dataN) ? dataN : []);
            }
            console.log(id);
            const resE = await fetch(`/api/torneo/inscritos?torneo_id=${data.torneo_id}`);
            if (resE.ok) setEquiposInscritos(await resE.json());

        } catch (e) { toast.error("Error al cargar datos"); }
    };

    const cargarListas = async () => {
        const [resC, resE, resCat, resCant, resNot] = await Promise.all([
            fetch('/api/canchas'),
            fetch('/api/equipos'),
            fetch('/api/categoria_equipo'),
            fetch('/api/cantidad_jugadores'),
            fetch('/api/categoria_noticias')
        ]);
        if (resC.ok) setCanchasDB(await resC.json());
        if (resE.ok) setEquiposDB(await resE.json());
        if (resCat.ok) setCatTorneo(await resCat.json());
        if (resCant.ok) {
            setCanJugadores(await resCant.json());
        };
        if (resNot.ok) setCategoriasNoticias(await resNot.json());
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, campo: string) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            if (campo === 'noticia') {
                setNuevaNoticia(prev => ({ ...prev, foto_noticia_url: reader.result as string }));
            } else {
                setTorneo(prev => ({ ...prev, [campo]: reader.result as string }));
            }
        };
        reader.readAsDataURL(file);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const tId = toast.loading('Guardando cambios...');

        const res = await fetch('/api/torneo/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(torneo), // Aquí ya va el torneo_id y la fecha_inicio
        });

        if (res.ok) {
            toast.success('Torneo actualizado', { id: tId });

            // Llamamos a cargarDatos usando el ID del torneo actual
            // Convertimos a string por si el estado lo tiene como número
            await cargarDatos(torneo.torneo_id.toString());

        } else {
            const errorData = await res.json();
            toast.error(`Error: ${errorData.error || 'No se pudo actualizar'}`, { id: tId });
        }
    };


    const vincularEquipo = async (equipo_id: string) => {
        const res = await fetch('/api/torneo/vincular-equipo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ torneo_id: torneo.torneo_id, equipo_id }),
        });

        if (res.ok) {
            toast.success('Equipo inscrito');
            // 1. Cargamos datos generales si es necesario
            cargarDatos(localStorage.getItem('usuario_id')!);
            // 2. DISPARAMOS EL REFRESH para que el componente de la lista se actualice
            handleRefresh();
        }
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
                if (id) cargarDatos(id);
            }
        }
    };

    return (
        <div className="min-h-screen bg-transparent text-white pb-20 p-8">
            {/* HEADER */}
            <header className="max-w-7xl mx-auto mb-12 flex items-center justify-between border-b border-white/10 pb-8">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-zinc-900 border-2 border-[#facf00] rounded-2xl overflow-hidden relative group">
                        <img src={torneo.logo_url || '/placeholder.png'} className="w-full h-full object-cover" />
                        <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
                            <Camera size={20} /><input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'logo_url')} />
                        </label>
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter">{torneo.nombre_torneo || 'Nuevo Torneo'}</h1>
                        <p className="text-[#facf00] font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck size={14} /> Organizador Oficial
                        </p>
                    </div>
                </div>
                <button onClick={() => { localStorage.clear(); router.push('/auth') }} className="flex items-center gap-3 px-6 py-3 bg-zinc-900/50 rounded-2xl text-zinc-500 hover:text-red-500 transition-all border border-white/5 group">
                    <span className="text-[10px] font-black uppercase italic tracking-widest">Cerrar Sesión</span>
                    <LogOutIcon size={18} />
                </button>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* PANEL IZQUIERDO: CONFIGURACIÓN */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                        <h2 className="text-xl font-black uppercase italic mb-6 flex items-center gap-2 text-[#facf00]"><Settings size={20} /> Ajustes de Copa</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Nombre del Torneo</label>
                                <input value={torneo.nombre_torneo} onChange={e => setTorneo({ ...torneo, nombre_torneo: e.target.value })} className="w-full bg-black p-4 rounded-xl border border-white/5 outline-none focus:border-[#facf00] font-bold" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Encargado</label>
                                    <input value={torneo.encargado_torneo} onChange={e => setTorneo({ ...torneo, encargado_torneo: e.target.value })} className="w-full bg-black p-4 rounded-xl border border-white/5 text-xs outline-none focus:border-[#facf00]" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest text-[#facf00]">
                                        Categoría
                                    </label>
                                    <select
                                        // Usamos el ID como valor principal del select
                                        value={torneo.categoria_equipo_id || ""}
                                        onChange={(e) => {
                                            const valorId = parseInt(e.target.value);
                                            // Buscamos el objeto de la categoría seleccionada para actualizar también el nombre visual si quieres
                                            const categoriaSeleccionada = catTorneo.find(c => c.categoria_equipo_id === valorId);

                                            setTorneo({
                                                ...torneo,
                                                categoria_equipo_id: valorId, // Ahora TypeScript lo reconocerá
                                                categoria_equipo: {
                                                    ...torneo.categoria_equipo,
                                                    categoria_equipo_id: valorId,
                                                    categoria_equipo: categoriaSeleccionada?.categoria_equipo || ''
                                                }
                                            });
                                        }}
                                        className="w-full bg-black p-4 rounded-xl border border-white/5 outline-none focus:border-[#facf00] font-bold text-xs"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {catTorneo.map((c) => (
                                            <option key={c.categoria_equipo_id} value={c.categoria_equipo_id}>
                                                {c.categoria_equipo}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest text-[#facf00]">
                                        Cantidad de Jugadores
                                    </label>
                                    <select
                                        // Usamos el ID como valor principal del select
                                        value={torneo.cantidad_jugadores_id || 0}
                                        onChange={(e) => {
                                            const valorId = parseInt(e.target.value);
                                            // Buscamos el objeto de la categoría seleccionada para actualizar también el nombre visual si quieres
                                            const categoriaSeleccionada = catTorneo.find(c => c.categoria_equipo_id === valorId);

                                            setTorneo({
                                                ...torneo,
                                                cantidad_jugadores_id: valorId, // Ahora TypeScript lo reconocerá
                                                cantidad_jugadores: {
                                                    ...torneo.cantidad_jugadores,
                                                    cantidad_jugadores_id: valorId,
                                                    cantidad_jugadores: categoriaSeleccionada?.categoria_equipo || ''
                                                }
                                            });
                                        }}
                                        className="w-full bg-black p-4 rounded-xl border border-white/5 outline-none focus:border-[#facf00] font-bold text-xs"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {canJugadores.map((c) => (
                                            <option key={c.cantidad_jugadores_id} value={c.cantidad_jugadores_id}>
                                                {c.cantidad_jugadores}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Precio Inscripción </label>
                                    <input value={torneo.precio_inscripcion_torneo} onChange={e => setTorneo({ ...torneo, precio_inscripcion_torneo: e.target.value })} className="w-full bg-black p-4 rounded-xl border border-white/5 text-xs outline-none focus:border-[#facf00]" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Teléfono de Contacto </label>
                                    <input value={torneo.telefono_torneo} onChange={e => setTorneo({ ...torneo, telefono_torneo: e.target.value })} className="w-full bg-black p-4 rounded-xl border border-white/5 text-xs outline-none focus:border-[#facf00]" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Equipos Permitidos</label>
                                    <input type="number" placeholder="Ej: 16" value={torneo.cantidad_equipos_torneo} onChange={e => setTorneo({ ...torneo, cantidad_equipos_torneo: e.target.value })} className="w-full bg-black p-4 rounded-xl border border-white/5 text-xs outline-none focus:border-[#facf00] font-bold text-[#facf00]" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Descripción del Torneo</label>
                                <textarea value={torneo.especificaciones_torneo} onChange={e => setTorneo({ ...torneo, especificaciones_torneo: e.target.value })} className="w-full bg-black p-4 rounded-xl border border-white/5 text-xs outline-none focus:border-[#facf00] h-20 resize-none" />
                            </div>

                            {/* SEDE */}
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <div className="px-2">
                                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Sede Actual:</span>
                                    {/* Usamos encadenamiento opcional ? para entrar al array y luego al objeto cancha */}
                                    <p className="text-sm font-bold text-white italic">
                                        {torneo.sede_torneo?.[0]?.cancha?.nombre_cancha || torneo.ubicacion_torneo || 'NO ASIGNADA'}
                                    </p>
                                    {torneo.sede_torneo?.[0]?.cancha && (
                                        <p className="text-[10px] text-zinc-400">
                                            {torneo.sede_torneo[0].cancha.ubicacion_cancha}, {torneo.sede_torneo[0].cancha.provincia_cancha}
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
                                            value={torneo.sede_torneo?.[0]?.cancha_id || ""}
                                            onChange={(e) => {
                                                const idSeleccionado = e.target.value;
                                                if (idSeleccionado === 'otra') {
                                                    setCanchaSeleccionada('otra');
                                                } else {
                                                    const canchaEncontrada = canchasDB.find(c => c.id.toString() === idSeleccionado);
                                                    if (canchaEncontrada) {
                                                        setCanchaSeleccionada(idSeleccionado);
                                                        setTorneo(prev => ({
                                                            ...prev,
                                                            ubicacion_torneo: canchaEncontrada.nombre_cancha,
                                                            // Actualizamos el array manteniendo la estructura de la DB
                                                            sede_torneo: [{
                                                                ...prev.sede_torneo?.[0],
                                                                ubicacion_torneo: canchaEncontrada.nombre,
                                                                cancha_id: canchaEncontrada.id,
                                                            }]
                                                        }));
                                                    }
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
                                            <option value="otra">OTRA / UBICACIÓN</option>
                                        </select>
                                    </div>
                                )}
                            </div>


                            <div className="space-y-3 pt-4 border-t border-white/5">
                                <label className="text-[9px] font-black text-[#facf00] uppercase tracking-[0.2em] ml-2">Premiación</label>
                                <div className="space-y-1">
                                    <label className="text-[8px] text-zinc-500 uppercase px-2 italic">Actual: {torneo.premioUno_torneo || 'Sin definir'}</label>
                                    <input placeholder="1er Lugar" value={torneo.premioUno_torneo} onChange={e => setTorneo({ ...torneo, premioUno_torneo: e.target.value })} className="w-full bg-black p-3 rounded-xl border border-white/5 text-xs outline-none focus:border-[#facf00]" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] text-zinc-500 uppercase px-2 italic">Actual: {torneo.premioDos_torneo || 'Sin definir'}</label>
                                    <input placeholder="2do Lugar" value={torneo.premioDos_torneo} onChange={e => setTorneo({ ...torneo, premioDos_torneo: e.target.value })} className="w-full bg-black p-3 rounded-xl border border-white/5 text-xs outline-none focus:border-[#facf00]" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] text-zinc-500 uppercase px-2 italic">Actual: {torneo.premioTres_torneo || 'Sin definir'}</label>
                                    <input placeholder="3er Lugar" value={torneo.premioTres_torneo} onChange={e => setTorneo({ ...torneo, premioTres_torneo: e.target.value })} className="w-full bg-black p-3 rounded-xl border border-white/5 text-xs outline-none focus:border-[#facf00]" />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-500 uppercase ml-2">
                                        FECHA DE INICIO TORNEO
                                    </label>
                                    <input
                                        required
                                        type="date"
                                        className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00] [color-scheme:dark]"
                                        // IMPORTANTE: Vinculamos el value y cortamos el string para que sea YYYY-MM-DD
                                        value={torneo.fecha_inicio ? torneo.fecha_inicio.split('T')[0] : ''}
                                        onChange={e => setTorneo({ ...torneo, fecha_inicio: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest">
                                        ESTADO ACTUAL DEL TORNEO
                                    </label>
                                    <div className="relative">
                                        <select
                                            // 1. El value vinculado al estado es lo que extrae el valor de la base de datos
                                            value={torneo.estado_torneo}
                                            onChange={e => setTorneo({ ...torneo, estado_torneo: e.target.value })}
                                            className="w-full bg-black border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00] appearance-none cursor-pointer"
                                        >
                                            {/* 2. Las opciones deben tener el VALUE idéntico a como se guarda en la DB */}
                                            <option value="INSCRIPCIONES">INSCRIPCIONES</option>
                                            <option value="EN COMPETENCIA">EN COMPETENCIA</option>
                                            <option value="FINALIZADO">FINALIZADO</option>
                                        </select>

                                        {/* Decoración: Flecha para que parezca un select premium */}
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-zinc-500">
                                            <ListOrdered size={16} />
                                        </div>
                                    </div>

                                    {/* Feedback visual opcional para el usuario */}
                                    <p className="text-[9px] text-[#facf00] font-bold italic ml-2 mt-1 uppercase">
                                        Estado actual: {torneo.estado_torneo}
                                    </p>
                                </div>
                            </div>

                            <button className="w-full bg-[#facf00] text-black font-black uppercase italic py-4 rounded-2xl hover:bg-white transition-all shadow-lg shadow-[#facf00]/20">Actualizar Datos de Copa</button>
                        </form>
                    </div>
                </div>

                {/* PANEL DERECHO: COMPETICIÓN */}
                <div className="lg:col-span-7 space-y-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* VINCULAR EQUIPOS */}
                        <VincularEquipos
                            key={`vincular-${refreshKey}`} // <-- Agrégalo aquí también
                            torneo_id={Number(torneo.torneo_id)}
                            onSuccess={handleRefresh}
                        />

                        {/* INSCRITOS */}
                        <EquiposIncritos
                            key={`inscritos-${refreshKey}`}
                            torneo_id={torneo.torneo_id}
                            onSuccess={handleRefresh}
                        />
                    </div>

                    {/* TABLA DE POSICIONES */}
                    <TablaPosiciones
                        key={refreshKey} // Esto obliga a la tabla a recargar los datos
                        torneo_id={Number(torneo.torneo_id)}
                    />

                    <TablaGoleadores
                        key={`goleadores-${refreshKey}`} // Forzamos recarga al actualizar
                        torneo_id={Number(torneo.torneo_id)}
                    />

                {/* --- LADO DERECHO: NOTICIAS DEL EQUIPO --- */}
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
                                    nombreCancha={torneo.nombre_torneo}
                                    categorias={categoriasNoticias}
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

        </div>
            </main >
        </div >
    );
} 