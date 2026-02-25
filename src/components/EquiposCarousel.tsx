'use client';
import { useState, useMemo, useEffect } from 'react';
import { ImageIcon } from 'lucide-react';
import Link from 'next/link';

const ZONAS = ["TODAS", "San José", "Alajuela", "Heredia", "Cartago", "Guanacaste", "Puntarenas", "Limón"];

export default function TeamSearch() {
    const [equiposDB, setEquiposDB] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroCat, setFiltroCat] = useState("TODOS");
    const [filtroZona, setFiltroZona] = useState("TODAS");
    const [index, setIndex] = useState(0);

    // 1. Carga de datos desde la API
    useEffect(() => {
        const fetchEquipos = async () => {
            try {
                const res = await fetch('/api/equipos'); // Ajusta a tu endpoint real
                const data = await res.json();
                if (res.ok) {
                    setEquiposDB(data);
                }
            } catch (error) {
                console.error("Error cargando equipos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEquipos();
    }, []);

    const [categoriaEquipo, setcategoriaEquipo] = useState<{ categoria_equipo_id: number, categoria_equipo: string }[]>([]);
    // Estado para categorías de equipos
    useEffect(() => {
        const loadCategoriaEquipo = async () => {
            const res = await fetch('/api/categoria_equipo');
            if (res.ok) {
                const data = await res.json();
                setcategoriaEquipo(data);
            }
        };
        loadCategoriaEquipo();
    }, []);

    // Lógica de Doble Filtrado
    const equiposFiltrados = useMemo(() => {
        return equiposDB.filter(equipo => {
            const matchCat = filtroCat === "TODOS" || equipo.categoria_nombre === filtroCat;
            const matchZona = filtroZona === "TODAS" || equipo.provincia === filtroZona;
            return matchCat && matchZona;
        });
    }, [filtroCat, filtroZona, equiposDB]);


    const equipo = equiposFiltrados[index];

    const siguiente = () => setIndex((prev) => (prev + 1) % equiposFiltrados.length);
    const anterior = () => setIndex((prev) => (prev - 1 + equiposFiltrados.length) % equiposFiltrados.length);

    return (
        <section className="w-full py-12 flex flex-col items-center max-w-6xl mx-auto">
            <h2 className="text-[#facf00] font-black italic text-5xl mb-10 uppercase tracking-tighter">
                Equipos Disponibles
            </h2>

            {/* --- CONTENEDOR DE FILTROS --- */}
            <div className="flex flex-col md:flex-row gap-6 mb-12 w-full px-4 items-center justify-center">
                {/* Filtro de Categoría */}
                {/* Filtro de Categoría */}
                <div className="flex flex-wrap gap-2 justify-center">
                    {/* Botón Estático para TODOS */}
                    <button
                        onClick={() => { setFiltroCat("TODOS"); setIndex(0); }}
                        className={`px-4 py-1 font-black italic text-[10px] tracking-widest transition-all skew-x-[-15deg] border ${filtroCat === "TODOS"
                            ? 'bg-[#facf00] text-black border-[#facf00]'
                            : 'bg-transparent text-gray-500 border-white/10'
                            }`}
                    >
                        <span className="inline-block skew-x-[15deg]">TODOS</span>
                    </button>

                    {/* Botones Dinámicos desde la DB */}
                    {categoriaEquipo.map((cat) => (
                        <button
                            key={cat.categoria_equipo_id}
                            onClick={() => {
                                setFiltroCat(cat.categoria_equipo);
                                setIndex(0);
                            }}
                            className={`px-4 py-1 font-black italic text-[10px] tracking-widest transition-all skew-x-[-15deg] border ${filtroCat === cat.categoria_equipo
                                ? 'bg-[#facf00] text-black border-[#facf00]'
                                : 'bg-transparent text-gray-500 border-white/10'
                                }`}
                        >
                            <span className="inline-block skew-x-[15deg] uppercase">
                                {cat.categoria_equipo}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Separador Visual */}
                <div className="hidden md:block w-[2px] h-8 bg-white/10" />

                {/* Filtro de Zona */}
                <div className="relative">
                    <select
                        value={filtroZona}
                        onChange={(e) => { setFiltroZona(e.target.value); setIndex(0); }}
                        className="bg-[#111] text-[#facf00] border border-white/10 px-4 py-2 font-bold italic text-sm uppercase outline-none appearance-none cursor-pointer pr-10 rounded-md"
                    >
                        {ZONAS.map(z => <option key={z} value={z}>{z}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#facf00]">
                        ▼
                    </div>
                </div>
            </div>

            {/* --- RESULTADOS --- */}
            <div className="relative flex items-center justify-center w-full min-h-[500px]">
                {loading ? (
                    <div className="text-center animate-pulse">
                        <p className="text-[#facf00] font-black italic uppercase tracking-widest">Buscando rivales...</p>
                    </div>
                ) : equiposFiltrados.length > 0 ? (
                    <>
                        <button onClick={anterior} className="absolute left-0 lg:-left-12 z-20 text-[#facf00] hover:scale-125 transition-transform">
                            <svg width="50" height="50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                        </button>

                        <div className="w-full max-w-3xl bg-[#0a0a0a] rounded-3xl border border-white/5 p-8 relative shadow-2xl overflow-hidden">
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#facf00] opacity-5 blur-[100px] rounded-full" />

                            <div className="flex flex-col md:flex-row items-center gap-10">
                                {/* Lado Izquierdo: Escudo */}
                                <div className="relative">
                                    <div className="absolute inset-0 bg-[#facf00] opacity-20 blur-3xl animate-pulse" />
                                    {equipo.escudo_url ? (
                                        <img src={equipo.escudo_url} alt="Escudo" className="relative z-10 w-48 h-48 object-contain" />
                                    ) : (
                                        <div className="relative z-10 w-48 h-48 flex items-center justify-center bg-zinc-900 rounded-full border border-white/5">
                                            <ImageIcon size={64} className="text-white/10" />
                                        </div>
                                    )}
                                </div>

                                {/* Lado Derecho: Info */}
                                <div className="flex-1 text-center md:text-left">
                                    <div className="inline-block bg-[#facf00] text-black px-3 py-1 text-[10px] font-black italic rounded mb-4 uppercase">
                                        {equipo.provincia} • {equipo.modalidad}
                                    </div>
                                    <h3 className="text-5xl font-black italic text-white uppercase tracking-tighter mb-4 leading-none">
                                        {equipo.nombre_equipo || equipo.nombre}
                                    </h3>

                                    <div className="space-y-3 mb-8">
                                        <div className="flex items-center gap-3 text-gray-400">
                                            <span className="text-[#facf00]">🏟️</span>
                                            <span className="font-bold uppercase text-xs tracking-widest">
                                                Sede: {equipo.sede.nombre || "Sin cancha fija"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-400">
                                            <span className="text-[#facf00]">🔥</span>
                                            <span className="font-bold uppercase text-xs tracking-widest">Categoria: {equipo.categoria_nombre || "Aficionado"}</span>
                                        </div>
                                    </div>

                                    <Link href={`/equipos/${equipo.usuario_id}`} className="w-full block">
                                        <button className="w-full bg-[#facf00] text-black py-4 font-black italic uppercase tracking-tighter hover:bg-white transition-all transform hover:-translate-y-1 active:scale-95 shadow-[0_10px_20px_rgba(250,207,0,0.2)]">
                                            Ver Perfil y Lanzar Desafío
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <button onClick={siguiente} className="absolute right-0 lg:-right-12 z-20 text-[#facf00] hover:scale-125 transition-transform">
                            <svg width="50" height="50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </>
                ) : (
                    <div className="text-center animate-pulse">
                        <p className="text-gray-600 text-xl italic font-black uppercase">No hay rivales en esta zona...</p>
                        <button onClick={() => { setFiltroCat("TODOS"); setFiltroZona("TODAS") }} className="text-[#facf00] underline mt-4 text-sm font-bold uppercase">Ver todos los equipos</button>
                    </div>
                )}
            </div>
            <Link href="/equipos">
                <button className="bg-black text-white px-10 py-5 rounded-2xl font-black italic uppercase text-sm tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                    VER TODOS LOS EQUIPOS
                </button>
            </Link>
        </section>
    );
}