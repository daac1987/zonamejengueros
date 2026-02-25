'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Camera, MapPin, User, Shield, Plus, Users } from 'lucide-react';


export default function FormEquipo({ onBack }: { onBack: () => void }) {
    const [categorias, setCategorias] = useState<{ categoria_equipo_id: number, categoria_equipo: string }[]>([]);
    const [cantidadJugadores, setCantidadJugadores] = useState<{ cantidad_jugadores_id: number, cantidad_jugadores: string }[]>([]);
    const [canchas, setCanchas] = useState<{ id: number, nombre: string }[]>([]);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        nombre_equipo: '',
        telefono_equipo: '',
        provincia_equipo: 'San José', // Valor por defecto
        ubicacion_equipo: '', // Dirección exacta o barrio
        encargado_equipo: '',
        logros_equipo: '',
        categoria_equipo_id: '',
        cantidad_jugadores_id: '',
        cancha_id: '',
        logo_url: '',
        foto_equipo_uno_url: '',
        foto_equipo_dos_url: ''
    });

    useEffect(() => {
        const loadData = async () => {
            const [resCat, resJug, resCanchas] = await Promise.all([
                fetch('/api/categoria_equipo'),
                fetch('/api/cantidad_jugadores'),
                fetch('/api/canchas')
            ]);
            if (resCat.ok) setCategorias(await resCat.json());
            if (resJug.ok) setCantidadJugadores(await resJug.json());
            if (resCanchas.ok) setCanchas(await resCanchas.json());
        };
        loadData();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
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
                    setFormData(prev => ({ ...prev, [field]: data.url }));
                    toast.success("Imagen lista");
                }
            };
        } catch (error) {
            toast.error("Error al subir imagen");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // 1. Obtener y validar el ID
        const userIdRaw = localStorage.getItem('usuario_id');
        const usuario_id = userIdRaw ? parseInt(userIdRaw) : null;

        if (!usuario_id || isNaN(usuario_id)) {
            toast.error("Sesión no válida. Por favor, vuelve a iniciar sesión.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/equipos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, usuario_id }),
            });

            if (res.ok) {
                toast.success("¡Equipo registrado con éxito!");
                router.push('/dashboard-equipo');
            } else {
                const err = await res.json();
                toast.error(err.error || "Error al registrar");
            }
        } catch (error) {
            toast.error("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in slide-in-from-bottom-10 duration-500">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <span className="text-[#facf00] font-black italic text-xs tracking-widest uppercase">GESTIÓN DE PLANTEL</span>
                    <h2 className="text-5xl font-black italic text-white uppercase leading-none mt-2">FUNDAR <span className="text-[#facf00]">EQUIPO</span></h2>
                </div>
                <button onClick={onBack} className="bg-white/5 text-white px-6 py-2 rounded-full font-black italic uppercase text-[10px] tracking-widest border border-white/10 hover:bg-white/10 transition-all">← VOLVER</button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">

                    {/* IDENTIDAD DEL CLUB */}
                    <div className="bg-[#1a1a1a]/40 border border-white/5 p-8 rounded-[2rem]">
                        <h3 className="text-[#facf00] font-black italic text-sm uppercase mb-6 flex items-center gap-2">
                            <Shield size={16} /> IDENTIDAD DEL CLUB
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">NOMBRE DEL EQUIPO</label>
                                <input required type="text" className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]" placeholder="Ej. Real Suciedad FC"
                                    onChange={e => setFormData({ ...formData, nombre_equipo: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">CAPITÁN / ENCARGADO</label>
                                <input required type="text" className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]" placeholder="Nombre completo"
                                    onChange={e => setFormData({ ...formData, encargado_equipo: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">TELÉFONO DE CONTACTO</label>
                                <input required type="tel" className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]" placeholder="8888-8888"
                                    onChange={e => setFormData({ ...formData, telefono_equipo: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">PROVINCIA</label>
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">PROVINCIA</label>
                                <select className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]"
                                    onChange={e => setFormData({ ...formData, provincia_equipo: e.target.value })}>
                                    <option value="">Seleccione provincia</option>
                                    <option>San José</option><option>Alajuela</option><option>Cartago</option><option>Heredia</option><option>Guanacaste</option><option>Puntarenas</option><option>Limón</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">UBICACIÓN ESPECÍFICA (BARRIO / SECTOR)</label>
                                <input required type="text" className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]" placeholder="Ej. Urbanización Las Flores, 200m Norte de la Iglesia"
                                    onChange={e => setFormData({ ...formData, ubicacion_equipo: e.target.value })} />
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">PALMARÉS Y LOGROS</label>
                                <input required type="text" className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]" placeholder="Campeonatos Terceera División 2022, Subcampeones Liga Local 2023"
                                    onChange={e => setFormData({ ...formData, logros_equipo: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    {/* CATEGORÍA Y TAMAÑO */}
                    <div className="bg-[#1a1a1a]/40 border border-white/5 p-8 rounded-[2rem]">
                        <h3 className="text-[#facf00] font-black italic text-sm uppercase mb-6 flex items-center gap-2">
                            <Users size={16} /> NIVEL Y PLANTILLA
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">CATEGORÍA</label>
                                <select required className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]"
                                    onChange={e => setFormData({ ...formData, categoria_equipo_id: e.target.value })}>
                                    <option value="">Seleccione Categoria</option>
                                    {categorias.map(cat => <option key={cat.categoria_equipo_id} value={cat.categoria_equipo_id}>{cat.categoria_equipo}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">MODALIDAD PREFERIDA</label>
                                <select required className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]"
                                    onChange={e => setFormData({ ...formData, cantidad_jugadores_id: e.target.value })}>
                                    <option value="">Seleccione formato</option>
                                    {cantidadJugadores.map(can => <option key={can.cantidad_jugadores_id} value={can.cantidad_jugadores_id}>{can.cantidad_jugadores}</option>)}
                                </select>
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

                    {/* IMÁGENES */}
                    <div className="bg-[#1a1a1a]/40 border border-white/5 p-8 rounded-[2rem]">
                        <h3 className="text-white font-black italic text-sm uppercase mb-6 flex items-center gap-2">
                            <Camera size={16} /> GALERÍA DEL EQUIPO
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { label: 'ESCUDO (LOGO)', field: 'logo_url' },
                                { label: 'FOTO EQUIPO 1', field: 'foto_equipo_uno_url' },
                                { label: 'FOTO EQUIPO 2', field: 'foto_equipo_dos_url' }
                            ].map((img, i) => (
                                <div key={i} className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase ml-2">{img.label}</label>
                                    <div className="relative group bg-[#111] border-2 border-dashed border-white/10 rounded-2xl h-40 flex flex-col items-center justify-center overflow-hidden hover:border-[#facf00] transition-all">
                                        {formData[img.field as keyof typeof formData] ? (
                                            <img src={formData[img.field as keyof typeof formData]} className="w-full h-full object-cover" />
                                        ) : (
                                            <label className="cursor-pointer flex flex-col items-center">
                                                <Plus className="text-gray-500 group-hover:text-[#facf00]" />
                                                <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, img.field)} />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ACCIÓN */}
                <div className="space-y-6">
                    <div className="bg-[#facf00] p-10 rounded-[2.5rem] text-black shadow-2xl">
                        <h3 className="text-3xl font-black italic uppercase leading-none mb-4">¿LISTOS PARA EL DEBUT?</h3>
                        <p className="text-[10px] font-bold uppercase leading-tight mb-8 opacity-70">
                            Tu equipo será visible para retos y torneos oficiales.
                        </p>
                        <button type="submit" disabled={loading} className="w-full bg-black text-[#facf00] py-6 rounded-[1.5rem] font-black italic uppercase tracking-widest text-sm hover:scale-105 transition-transform disabled:opacity-50">
                            {loading ? 'FUNDANDO...' : 'REGISTRAR EQUIPO'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}