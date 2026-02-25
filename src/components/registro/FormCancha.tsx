'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Camera, MapPin, Clock, User, Tag, Shield, Plus, Image as ImageIcon, Cat } from 'lucide-react';

export default function FormCancha({ onBack }: { onBack: () => void }) {
    const [cantidadJugadores, setCantidadJugadores] = useState<{ cantidad_jugadores_id: number, cantidad_jugadores: string }[]>([]);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre_cancha: '',
        telefono_cancha: '',
        provincia_cancha: 'San José',
        ubicacion_cancha: '',
        encargado_cancha: '',
        horario_cancha: '',
        grama_cancha: '',
        categoria_equipo_id: '',
        cantidad_jugadores_id: '',
        precio_cancha: '',
        servicios_cancha: '',
        sede_url: '',
        foto_sede_uno_url: '',
        foto_sede_dos_url: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const usuario_id = localStorage.getItem('usuario_id');
        if (!usuario_id) {
            toast.error("Sesión no encontrada. Inicia sesión de nuevo.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/cancha/registrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, usuario_id }),
            });

            if (res.ok) {
                toast.success("¡Sede registrada y vinculada!");
                router.push('/dashboard-cancha');
            } else {
                const errorData = await res.json();
                toast.error(errorData.error || "Error al registrar");
            }
        } catch (error) {
            toast.error("Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    // Estado para categorías de cantidad de jugadores
    useEffect(() => {
        const loadCantidadJugadores = async () => {
            const res = await fetch('/api/cantidad_jugadores');
            if (res.ok) {
                const data = await res.json();
                setCantidadJugadores(data);
            }
        };
        loadCantidadJugadores();
    }, []);

    // Función para convertir archivo a Base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    // Función para manejar la subida cuando el usuario selecciona una foto
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const base64 = await fileToBase64(file);
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: JSON.stringify({ file: base64, fileName: file.name }),
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await res.json();
            if (data.url) {
                setFormData(prev => ({ ...prev, [field]: data.url }));
                toast.success("Imagen cargada");
            }
        } catch (error) {
            toast.error("Error subiendo imagen");
        }
    };

    return (
        <div className="animate-in slide-in-from-bottom-10 duration-500">
            {/* Header */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <span className="text-[#facf00] font-black italic text-xs tracking-widest uppercase">CONFIGURACIÓN DE SEDE</span>
                    <h2 className="text-5xl font-black italic text-white uppercase leading-none mt-2">REGISTRAR <span className="text-[#facf00]">CANCHA</span></h2>
                </div>
                <button onClick={onBack} className="bg-white/5 text-white px-6 py-2 rounded-full font-black italic uppercase text-[10px] tracking-widest border border-white/10 hover:bg-white/10 transition-all">← VOLVER</button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                <div className="lg:col-span-2 space-y-6">

                    {/* Bloque 1: Información General */}
                    <div className="bg-[#1a1a1a]/40 border border-white/5 p-8 rounded-[2rem]">
                        <h3 className="text-[#facf00] font-black italic text-sm uppercase mb-6 flex items-center gap-2">
                            <MapPin size={16} /> INFORMACIÓN Y CONTACTO
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">NOMBRE DE LA CANCHA</label>
                                <input required type="text" className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]" placeholder="Ej. Arena 5"
                                    onChange={e => setFormData({ ...formData, nombre_cancha: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">TELÉFONO WHATSAPP</label>
                                <input required type="tel" className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]" placeholder="8888-8888"
                                    onChange={e => setFormData({ ...formData, telefono_cancha: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">PROVINCIA</label>
                                <select className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]"

                                    onChange={e => setFormData({ ...formData, provincia_cancha: e.target.value })}>
                                    <option value="">Seleccione provincia</option>
                                    <option>San José</option><option>Alajuela</option><option>Cartago</option><option>Heredia</option><option>Guanacaste</option><option>Puntarenas</option><option>Limón</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">UBICACIÓN / ZONA</label>
                                <input required type="text" className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]" placeholder="Ej. Zapote, 200m Sur de..."
                                    onChange={e => setFormData({ ...formData, ubicacion_cancha: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">ENCARGADO DE SEDE</label>
                                <input required type="text" className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]" placeholder="Nombre del administrador"
                                    onChange={e => setFormData({ ...formData, encargado_cancha: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">HORARIOS (TEXTO)</label>
                                <input required type="text" className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]" placeholder="L-V: 5pm-11pm / S-D: 8am-10pm"
                                    onChange={e => setFormData({ ...formData, horario_cancha: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    {/* Bloque 2: Detalles Técnicos */}
                    <div className="bg-[#1a1a1a]/40 border border-white/5 p-8 rounded-[2rem]">
                        <h3 className="text-[#facf00] font-black italic text-sm uppercase mb-6 flex items-center gap-2">
                            <Shield size={16} /> ESPECIFICACIONES Y PRECIO
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">GRAMILLA</label>
                                <select className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]"
                                    onChange={e => setFormData({ ...formData, grama_cancha: e.target.value })}>
                                    <option value="">Seleccione tipo</option>
                                    <option>Sintética</option><option>Natural</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">TAMAÑO</label>
                                <select className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]"
                                    onChange={e => setFormData({ ...formData, cantidad_jugadores_id: e.target.value })}>
                                    <option value="">Seleccione tamaño</option>
                                    {cantidadJugadores.map((can) => (
                                        <option key={can.cantidad_jugadores_id} value={can.cantidad_jugadores_id}>
                                            {can.cantidad_jugadores}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">PRECIO</label>
                                <input required type="number" className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]" placeholder="25000"
                                    onChange={e => setFormData({ ...formData, precio_cancha: e.target.value })} />
                            </div>
                            <div className="md:col-span-3 space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2">SERVICIOS INCLUIDOS</label>
                                <input required type="text" className="w-full bg-[#111] border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#facf00]" placeholder="Parqueo, Duchas, Soda, Petos, Balón..."
                                    onChange={e => setFormData({ ...formData, servicios_cancha: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    {/* Bloque 3: Galería (URLs de imágenes) */}
                    <div className="bg-[#1a1a1a]/40 border border-white/5 p-8 rounded-[2rem]">
                        <h3 className="text-white font-black italic text-sm uppercase mb-6 flex items-center gap-2">
                            <Camera size={16} /> GALERÍA DE LA SEDE
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { label: 'FOTO PRINCIPAL', field: 'sede_url' },
                                { label: 'FOTO INTERIOR', field: 'foto_sede_uno_url' },
                                { label: 'FOTO FACHADA', field: 'foto_sede_dos_url' }
                            ].map((img, index) => (
                                <div key={index} className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase ml-2">{img.label}</label>
                                    <div className="relative group bg-[#111] border-2 border-dashed border-white/10 rounded-2xl h-40 flex flex-col items-center justify-center overflow-hidden hover:border-[#facf00] transition-all">
                                        {formData[img.field as keyof typeof formData] ? (
                                            <>
                                                <img
                                                    src={formData[img.field as keyof typeof formData]}
                                                    className="w-full h-full object-cover"
                                                    alt="Preview"
                                                />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <label className="cursor-pointer text-[#facf00] text-[10px] font-black uppercase italic">
                                                        Cambiar Foto
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, img.field)} />
                                                    </label>
                                                </div>
                                            </>
                                        ) : (
                                            <label className="cursor-pointer flex flex-col items-center group">
                                                <Plus className="text-gray-500 group-hover:text-[#facf00] mb-2" />
                                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Subir Imagen</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, img.field)} />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Columna Derecha: Acción */}
                <div className="space-y-6">
                    <div className="bg-[#facf00] p-10 rounded-[2.5rem] text-black shadow-[0_20px_60px_rgba(250,207,0,0.15)]">
                        <h3 className="text-3xl font-black italic uppercase leading-none mb-4">¿LISTO PARA PUBLICAR?</h3>
                        <p className="text-[10px] font-bold uppercase leading-tight mb-8 opacity-70">
                            Al finalizar, tu cancha aparecerá en los listados oficiales para que los equipos puedan reservar.
                        </p>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-[#facf00] py-6 rounded-[1.5rem] font-black italic uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-2xl disabled:opacity-50"
                        >
                            {loading ? 'REGISTRANDO...' : 'FINALIZAR REGISTRO'}
                        </button>
                    </div>

                    <div className="bg-[#1a1a1a]/40 border border-white/5 p-8 rounded-[2rem]">
                        <p className="text-[10px] font-black text-gray-500 uppercase mb-2">RECORDATORIO</p>
                        <p className="text-white text-xs italic font-medium leading-tight">
                            "Asegúrate de que el precio sea por partido."
                        </p>
                    </div>
                </div>

            </form>
        </div>
    );
}