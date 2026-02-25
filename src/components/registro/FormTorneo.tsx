'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Camera, MapPin, Trophy, Users, Plus, Calendar, Star, Info } from 'lucide-react';

export default function FormTorneo({ onBack }: { onBack: () => void }) {
    const [categorias, setCategorias] = useState<{ categoria_equipo_id: number, categoria_equipo: string }[]>([]);
    const [modalidades, setModalidades] = useState<{ cantidad_jugadores_id: number, cantidad_jugadores: string }[]>([]);
    const [canchas, setCanchas] = useState<{ id: number, nombre: string }[]>([]);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        nombre_torneo: '',
        telefono_torneo: '',
        provincia_torneo: 'San José',
        ubicacion_torneo: '',
        encargado_torneo: '',
        cantidad_equipos_torneo: '',
        cantidad_jugadores_id: '',
        precio_inscripcion_torneo: '',
        categoria_equipo_id: '',
        fecha_inicio: '',
        especificaciones_torneo: '',
        premioUno_torneo: '',
        premioDos_torneo: '',
        premioTres_torneo: '',
        logo_url: '',
        cancha_id: '',
    });

    useEffect(() => {
        const loadData = async () => {
            const [resCat, resMod, resCanchas] = await Promise.all([
                fetch('/api/categoria_equipo'),
                fetch('/api/cantidad_jugadores'),
                fetch('/api/canchas')
            ]);
            if (resCat.ok) setCategorias(await resCat.json());
            if (resMod.ok) setModalidades(await resMod.json());
            if (resCanchas.ok) setCanchas(await resCanchas.json());
        };
        loadData();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: JSON.stringify({ file: reader.result, fileName: file.name }),
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await res.json();
                if (data.url) {
                    setFormData(prev => ({ ...prev, logo_url: data.url }));
                    toast.success("Logo cargado");
                }
            };
        } catch (error) {
            toast.error("Error al subir imagen");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const userIdRaw = localStorage.getItem('usuario_id');
        const usuario_id = userIdRaw ? parseInt(userIdRaw) : null;

        if (!usuario_id) {
            toast.error("Debes estar logueado");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/torneo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    usuario_id,
                    // Convertimos a número lo que el modelo espera como Int
                    cantidad_equipos_torneo: parseInt(formData.cantidad_equipos_torneo),
                    cantidad_jugadores_id: parseInt(formData.cantidad_jugadores_id),
                    categoria_equipo_id: parseInt(formData.categoria_equipo_id)
                }),
            });

            if (res.ok) {
                toast.success("¡Torneo creado con éxito!");
                router.push('/torneos');
            } else {
                const err = await res.json();
                toast.error(err.error || "Error al crear torneo");
            }
        } catch (error) {
            toast.error("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in slide-in-from-bottom-10 duration-500">
            {/* HEADER */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <span className="text-[#facf00] font-black italic text-xs tracking-widest uppercase">ORGANIZACIÓN PROFESIONAL</span>
                    <h2 className="text-5xl font-black italic text-white uppercase leading-none mt-2">CREAR <span className="text-[#facf00]">TORNEO</span></h2>
                </div>
                <button onClick={onBack} className="bg-white/5 text-white px-6 py-2 rounded-full font-black italic uppercase text-[10px] tracking-widest border border-white/10 hover:bg-white/10 transition-all">← VOLVER</button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">

                    {/* INFORMACIÓN BÁSICA */}
                    <div className="bg-[#1a1a1a]/40 border border-white/5 p-8 rounded-[2rem]">
                        <h3 className="text-[#facf00] font-black italic text-sm uppercase mb-6 flex items-center gap-2">
                            <Trophy size={16} /> DATOS DEL TORNEO
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">NOMBRE DEL TORNEO</label>
                                <input required type="text" className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]" placeholder="Ej. Copa Oro Verano 2024"
                                    onChange={e => setFormData({ ...formData, nombre_torneo: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">ORGANIZADOR RESPONSABLE</label>
                                <input required type="text" className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]" placeholder="Nombre completo"
                                    onChange={e => setFormData({ ...formData, encargado_torneo: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">TELÉFONO DE CONTACTO</label>
                                <input required type="tel" className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]" placeholder="8888-8888"
                                    onChange={e => setFormData({ ...formData, telefono_torneo: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">CANTIDAD DE EQUIPOS</label>
                                <input required type="number" className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]" placeholder="Ej. 16"
                                    onChange={e => setFormData({ ...formData, cantidad_equipos_torneo: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">PRECIO DE INSCRIPCION EQUIPOS</label>
                                <input required type="number" className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]" placeholder="Ej. 25000"
                                    onChange={e => setFormData({ ...formData, precio_inscripcion_torneo: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">
                                    FECHA DE INICIO
                                </label>
                                <input
                                    required
                                    type="date"
                                    className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00] [color-scheme:dark]"
                                    onChange={e => setFormData({ ...formData, fecha_inicio: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* LOGÍSTICA Y UBICACIÓN */}
                    <div className="bg-[#1a1a1a]/40 border border-white/5 p-8 rounded-[2rem]">
                        <h3 className="text-[#facf00] font-black italic text-sm uppercase mb-6 flex items-center gap-2">
                            <MapPin size={16} /> REGLAS
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">CATEGORIA</label>
                                <select required className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]"
                                    onChange={e => setFormData({ ...formData, categoria_equipo_id: e.target.value })}>
                                    <option value="">Seleccione</option>
                                    {categorias.map(m => <option key={m.categoria_equipo_id} value={m.categoria_equipo_id}>{m.categoria_equipo}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">CANTIDAD DE JUGADORES</label>
                                <select required className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]"
                                    onChange={e => setFormData({ ...formData, cantidad_jugadores_id: e.target.value })}>
                                    <option value="">Seleccione</option>
                                    {modalidades.map(m => <option key={m.cantidad_jugadores_id} value={m.cantidad_jugadores_id}>{m.cantidad_jugadores}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">PROVINCIA</label>
                                <select className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]"
                                    onChange={e => setFormData({ ...formData, provincia_torneo: e.target.value })}>
                                    <option>San José</option><option>Alajuela</option><option>Cartago</option><option>Heredia</option><option>Guanacaste</option><option>Puntarenas</option><option>Limón</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">DIRECCIÓN ESPECÍFICA</label>
                                <input required type="text" className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]" placeholder="Nombre de la cancha o complejo deportivo"
                                    onChange={e => setFormData({ ...formData, ubicacion_torneo: e.target.value })} />
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">ESPECIFICACIONES / REGLAMENTO</label>
                                <textarea className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00] min-h-[100px]" placeholder="Reglas especiales, formato de eliminación, etc."
                                    onChange={e => setFormData({ ...formData, especificaciones_torneo: e.target.value })} />
                            </div>
                        </div>

                    </div>

                    {/* SEDE OFICIAL */}
                    <div className="bg-[#1a1a1a]/40 border border-white/5 p-8 rounded-[2rem]">
                        <h3 className="text-[#facf00] font-black italic text-sm uppercase mb-6 flex items-center gap-2">
                            <MapPin size={16} /> SEDE OFICIAL
                        </h3>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-500 uppercase ml-2">CANCHA DE LOCAL</label>
                            <select required className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]"
                                onChange={e => setFormData({ ...formData, cancha_id: e.target.value })}>
                                <option value="">Seleccione una sede</option>
                                {canchas.map(c => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                                <option value="0">OTRAS SEDES (SIN SEDE FIJA)</option>
                            </select>
                        </div>
                    </div>

                    {/* PREMIOS */}
                    <div className="bg-[#1a1a1a]/40 border border-white/5 p-8 rounded-[2rem]">
                        <h3 className="text-[#facf00] font-black italic text-sm uppercase mb-6 flex items-center gap-2">
                            <Star size={16} /> PREMIOS Y RECOMPENSAS
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-[#facf00] uppercase ml-2">🥇 PRIMER LUGAR</label>
                                <input required type="text" className="w-full bg-[#111] border border-[#facf00]/20 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]" placeholder="Monto o Trofeo"
                                    onChange={e => setFormData({ ...formData, premioUno_torneo: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">🥈 SEGUNDO LUGAR</label>
                                <input type="text" className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]" placeholder="Premio"
                                    onChange={e => setFormData({ ...formData, premioDos_torneo: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-amber-700 uppercase ml-2">🥉 TERCER LUGAR</label>
                                <input type="text" className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]" placeholder="Premio"
                                    onChange={e => setFormData({ ...formData, premioTres_torneo: e.target.value })} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ACCIÓN Y LOGO */}
                <div className="space-y-6">
                    <div className="bg-[#1a1a1a]/40 border border-white/5 p-8 rounded-[2rem]">
                        <h3 className="text-white font-black italic text-[10px] uppercase mb-4 flex items-center gap-2">
                            <Camera size={14} /> LOGO DEL TORNEO
                        </h3>
                        <div className="relative group bg-[#111] border-2 border-dashed border-white/10 rounded-3xl h-52 flex flex-col items-center justify-center overflow-hidden hover:border-[#facf00] transition-all">
                            {formData.logo_url ? (
                                <img src={formData.logo_url} className="w-full h-full object-cover" alt="Logo" />
                            ) : (
                                <label className="cursor-pointer flex flex-col items-center">
                                    <Plus className="text-gray-500 group-hover:text-[#facf00] mb-2" />
                                    <span className="text-[9px] text-gray-500 font-black uppercase">Subir Logo</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="bg-[#facf00] p-8 rounded-[2.5rem] text-black shadow-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar size={20} className="font-black" />
                            <h3 className="text-2xl font-black italic uppercase leading-none">PUBLICAR</h3>
                        </div>
                        <p className="text-[10px] font-bold uppercase leading-tight mb-8 opacity-70">
                            Al publicar, el torneo aparecerá en la sección de inscripciones abiertas.
                        </p>
                        <button type="submit" disabled={loading} className="w-full bg-black text-[#facf00] py-6 rounded-[1.5rem] font-black italic uppercase tracking-widest text-sm hover:scale-105 transition-transform disabled:opacity-50">
                            {loading ? 'CREANDO...' : 'LANZAR TORNEO'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}