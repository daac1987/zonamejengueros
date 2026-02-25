'use client';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';

const PROVINCIAS = ['Todas', 'San José', 'Heredia', 'Alajuela', 'Cartago', 'Puntarenas', 'Limón', 'Guanacaste'];

export default function EquiposPage() {
    const [equiposDB, setEquiposDB] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroProvincia, setFiltroProvincia] = useState('Todas');

    // Cambiamos el estado para que guarde el nombre de la categoría (string)
    const [filtroCategoria, setFiltroCategoria] = useState<string>('Todas');
    const [categorias, setCategorias] = useState<{ categoria_equipo_id: number, categoria_equipo: string }[]>([]);

    // 1. CARGA DE EQUIPOS
    useEffect(() => {
        const fetchEquipos = async () => {
            try {
                const res = await fetch('/api/equipos');
                const data = await res.json();
                if (res.ok) setEquiposDB(data);
            } catch (error) {
                console.error("Error cargando equipos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEquipos();
    }, []);

    // 2. CARGA DE CATEGORÍAS
    useEffect(() => {
        const loadCategorias = async () => {
            try {
                const res = await fetch('/api/categoria_equipo');
                if (res.ok) {
                    const data = await res.json();
                    setCategorias(data);
                  
                }
            } catch (error) {
                console.error("Error cargando categorías:", error);
            }
        };
        loadCategorias();
    }, []);

    const equiposFiltrados = useMemo(() => {
        return equiposDB.filter(equipo => {
            // 1. Filtro Provincia
            const provEquipo = (equipo.provincia || "").trim().toLowerCase();
            const provFiltro = filtroProvincia.trim().toLowerCase();
            const matchProvincia = filtroProvincia === 'Todas' || provEquipo === provFiltro;

            // 2. Filtro Categoría (Aseguramos que el campo sea el correcto)
            // NOTA: Revisa si en tu base de datos el campo se llama 'modalidad', 'categoria' o 'categoria_nombre'
            const catEquipo = (equipo.categoria_nombre).trim();
            const catFiltro = (filtroCategoria || "").trim();

            const matchCategoria = filtroCategoria === 'Todas' || catEquipo === catFiltro;

            return matchProvincia && matchCategoria;
        });
    }, [filtroProvincia, filtroCategoria, equiposDB]);

    return (
        <div className="min-h-screen pt-5 pb-20 px-4 max-w-7xl mx-auto">
            {/* HEADER */}
            <div className="mb-12">
                <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none text-white">
                    EQUIPOS <span className="text-[#facf00]">REGISTRADOS</span>
                </h1>

                <div className="mt-10 flex flex-col md:flex-row gap-8 bg-[#111] p-6 rounded-2xl border border-white/5">
                    {/* Filtro Provincia */}
                    <div className="flex-1">
                        <p className="text-[#facf00] text-[10px] font-black uppercase mb-3 tracking-widest ml-1">Provincia</p>
                        <div className="flex flex-wrap gap-2">
                            {PROVINCIAS.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setFiltroProvincia(p)}
                                    className={`px-4 py-2 rounded-lg font-black uppercase text-[9px] transition-all border ${filtroProvincia === p ? 'bg-[#facf00] text-black border-[#facf00]' : 'bg-black text-gray-500 border-white/10 hover:border-white/30'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filtro Categoría por Texto */}
                    <div className="flex-1">
                        <p className="text-[#facf00] text-[10px] font-black uppercase mb-3 tracking-widest ml-1">Categoria</p>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setFiltroCategoria('Todas')}
                                className={`px-4 py-2 rounded-lg font-black uppercase text-[9px] transition-all border ${filtroCategoria === 'Todas' ? 'bg-white text-black border-white' : 'bg-black text-gray-500 border-white/10 hover:border-white/30'}`}
                            >
                                Todas
                            </button>
                            {categorias.map((cat) => (
                                <button
                                    key={cat.categoria_equipo_id}
                                    onClick={() => setFiltroCategoria(cat.categoria_equipo)} // Guardamos el string "11 VS 11"
                                    className={`px-4 py-2 rounded-lg font-black uppercase text-[9px] transition-all border ${filtroCategoria === cat.categoria_equipo ? 'bg-white text-black border-white' : 'bg-black text-gray-500 border-white/10 hover:border-white/30'}`}
                                >
                                    {cat.categoria_equipo}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* GRILLA DE EQUIPOS */}
            {loading ? (
                <div className="py-20 text-center animate-pulse text-[#facf00] font-black uppercase">Cargando...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {equiposFiltrados.map((equipo) => (
                        <div key={equipo.equipo_id || equipo.id} className="group bg-[#111] border border-white/5 rounded-3xl overflow-hidden hover:border-[#facf00]/50 transition-all shadow-2xl">
                            <div className="relative h-48 bg-gray-900 overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent z-10" />
                                {equipo.escudo_url ? (
                                    <img src={equipo.escudo_url} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-all duration-700" alt={equipo.nombre} />
                                ) : (
                                    <span className="text-5xl">🛡️</span>
                                )}

                                {/* Badge de Categoría (String) */}
                                <div className="absolute top-4 left-4 z-20 bg-white/10 backdrop-blur-md text-white font-black px-3 py-1 rounded-md text-[10px] uppercase">
                                    {equipo.categoria_nombre || "Equipo"}
                                </div>
                                <div className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-md text-white font-black px-3 py-1 rounded-md text-[10px] uppercase">
                                    {equipo.modalidad || "Equipo"}
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-2xl font-black italic text-white uppercase group-hover:text-[#facf00] transition-colors line-clamp-1">
                                    {equipo.nombre}
                                </h3>
                                <p className="text-gray-500 font-bold text-xs uppercase mb-6">
                                    {equipo.provincia} • {equipo.ubicacion_especifica}
                                </p>
                                <Link href={`/equipos/${equipo.usuario_id}`}>
                                    <button className="w-full bg-white text-black py-4 rounded-xl font-black italic uppercase text-[10px] tracking-widest hover:bg-[#facf00] transition-colors">
                                        Ver Detalles
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* --- FOOTER REGRESAR --- */}
            <div className="mt-12 text-center">
                <button onClick={() => window.history.back()} className="text-[#facf00] font-black italic text-xs uppercase tracking-widest border-b border-[#facf00] pb-1 hover:text-white transition-all">
                    ← Volver atrás
                </button>
            </div>
        </div>
    );
}