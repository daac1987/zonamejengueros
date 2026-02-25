'use client';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';

const ZONAS = ['Todas', 'San José', 'Heredia', 'Alajuela', 'Cartago', 'Puntarenas', 'Limón', 'Guanacaste'];


export default function CanchasPage() {
    const [canchasDB, setCanchasDB] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroZona, setFiltroZona] = useState('Todas');
    const [filtroTipo, setFiltroTipo] = useState<number | 'Todos'>('Todos');
    const [cantidadJugadores, setCantidadJugadores] = useState<{ cantidad_jugadores_id: number, cantidad_jugadores: string }[]>([]);



    // 1. CARGA DE DATOS DESDE LA API
    useEffect(() => {
        const fetchCanchas = async () => {
            try {
                const res = await fetch('/api/canchas');
                const data = await res.json();
                if (res.ok) {
                    setCanchasDB(data);
                }
            } catch (error) {
                console.error("Error cargando sedes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCanchas();
    }, []);

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

    // Lógica de filtrado corregida
    const canchasFiltradas = useMemo(() => {
        return canchasDB.filter(cancha => {

            // 1. Filtro por ZONA (en tu DB es ubicacion_cancha)
            const zonaCancha = (cancha.zona || "").trim().toLowerCase();
            const zonaFiltro = filtroZona.trim().toLowerCase();

            const matchZona =
                filtroZona === 'Todas' || zonaCancha === zonaFiltro;

            // 2. Filtro por TAMAÑO (cantidad_jugadores_id)
            // Forzamos comparación numérica para evitar errores de tipo
            const matchTipo =
                filtroTipo === 'Todos' ||
                Number(cancha.tipo) === Number(filtroTipo);

            return matchZona && matchTipo;

        });
    }, [filtroZona, filtroTipo, canchasDB]);

    return (
        <div className="min-h-screen pt-5 pb-20 px-4 max-w-7xl mx-auto">

            {/* HEADER */}
            <div className="mb-12">
                <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none text-white">
                    SEDES <span className="text-[#facf00]">OFICIALES</span>
                </h1>

                {/* PANEL DE FILTROS */}
                <div className="mt-10 flex flex-col md:flex-row gap-8 bg-[#111] p-6 rounded-2xl border border-white/5">
                    {/* Filtro por Zona */}
                    <div className="flex-1">
                        <p className="text-[#facf00] text-[10px] font-black uppercase mb-3 tracking-widest ml-1">Seleccionar Zona</p>
                        <div className="flex flex-wrap gap-2">
                            {ZONAS.map((z) => (
                                <button
                                    key={z}
                                    onClick={() => setFiltroZona(z)}
                                    className={`px-4 py-2 rounded-lg font-black uppercase text-[9px] transition-all border ${filtroZona === z ? 'bg-[#facf00] text-black border-[#facf00]' : 'bg-black text-gray-500 border-white/10 hover:border-white/30'
                                        }`}
                                >
                                    {z}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filtro por Tamaño */}
                    <div className="flex-1">
                        <p className="text-[#facf00] text-[10px] font-black uppercase mb-3 tracking-widest ml-1">FUTBOL</p>
                        <div className="flex flex-wrap gap-2">

                            {/* BOTÓN MANUAL PARA "TODOS" */}
                            <button
                                onClick={() => setFiltroTipo('Todos')}
                                className={`px-4 py-2 rounded-lg font-black uppercase text-[9px] transition-all border ${filtroTipo === 'Todos'
                                    ? 'bg-white text-black border-white'
                                    : 'bg-black text-gray-500 border-white/10 hover:border-white/30'
                                    }`}
                            >
                                Todos
                            </button>

                            {/* MAPEO DE CATEGORÍAS DINÁMICAS */}
                            {cantidadJugadores.map((t) => (
                                <button
                                    key={t.cantidad_jugadores_id}
                                    onClick={() => setFiltroTipo(t.cantidad_jugadores_id)}
                                    className={`px-4 py-2 rounded-lg font-black uppercase text-[9px] transition-all border ${filtroTipo === t.cantidad_jugadores_id
                                        ? 'bg-white text-black border-white'
                                        : 'bg-black text-gray-500 border-white/10 hover:border-white/30'
                                        }`}
                                >
                                    {t.cantidad_jugadores}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* RESULTADOS */}
            {loading ? (
                <div className="py-20 text-center animate-pulse">
                    <p className="text-[#facf00] font-black italic uppercase text-2xl">Buscando Sedes Disponibles...</p>
                </div>
            ) : canchasFiltradas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {canchasFiltradas.map((cancha) => (
                        <div key={cancha.id} className="group bg-[#111] border border-white/5 rounded-3xl overflow-hidden hover:border-[#facf00]/50 transition-all shadow-2xl">
                            <div className="relative h-48 bg-gray-900 overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent z-10" />

                                {cancha.foto_cancha_url ? (
                                    <img
                                        src={cancha.foto_cancha_url}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
                                        alt={cancha.nombre}
                                    />
                                ) : (
                                    <span className="text-5xl group-hover:scale-110 transition-transform duration-700">🏟️</span>
                                )}

                                <div className="absolute top-4 left-4 z-20 bg-white/10 backdrop-blur-md text-white font-black px-3 py-1 rounded-md text-[10px] uppercase">
                                    {
                                        // Buscamos el objeto en cantidadJugadores cuya ID coincida con la PK de la cancha
                                        cantidadJugadores.find(
                                            (t) => Number(t.cantidad_jugadores_id) === Number(cancha.tipo)
                                        )?.cantidad_jugadores || "Cancha"
                                    }
                                </div>
                                <div className="absolute top-4 right-4 z-20 bg-[#facf00] text-black font-black px-3 py-1 rounded-md text-xs italic">
                                    {cancha.precio ? `₡${cancha.precio.toLocaleString()}` : 'Consultar'}
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-2xl font-black italic text-white uppercase leading-none mb-2 group-hover:text-[#facf00] transition-colors">{cancha.nombre}</h3>
                                <p className="text-gray-500 font-bold text-xs uppercase mb-6">{cancha.zona} • Grama {cancha.grama || 'Sintética'}</p>

                                <Link href={`/canchas/${cancha.id}`}>
                                    <button
                                        className="w-full bg-white text-black py-4 rounded-xl font-black italic uppercase tracking-widest hover:bg-[#facf00] transition-colors">
                                        Ver Detalles de Sede 
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center">
                    <p className="text-gray-600 font-black italic uppercase text-2xl">No hay canchas con esos filtros...</p>
                    <button
                        onClick={() => { setFiltroZona('Todas'); setFiltroTipo('Todos'); }}
                        className="mt-4 text-[#facf00] underline uppercase font-bold text-sm"
                    >
                        Limpiar filtros
                    </button>
                </div>
            )}

            {/* BANNER PARA DUEÑOS */}
            <div className="mt-20 bg-[#facf00] p-12 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                <div className="text-black">
                    <h2 className="text-4xl font-black italic uppercase leading-none mb-2 text-black">
                        ¿Eres dueño de una cancha?
                    </h2>
                    <p className="font-bold uppercase text-xs opacity-70 tracking-wide">
                        Aumenta tus reservas y únete a la red más grande de fútbol amateur
                    </p>
                </div>

                <Link href="/auth">
                    <button className="bg-black text-white px-10 py-5 rounded-2xl font-black italic uppercase text-sm tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                        Registrar mi sede
                    </button>
                </Link>
            </div>

            <div className="mt-12 text-center">
                <button
                    onClick={() => window.history.back()}
                    className="text-[#facf00] font-black italic text-xs uppercase tracking-widest border-b border-[#facf00] pb-1 hover:text-white hover:border-white transition-all"
                >
                    ← Volver atrás
                </button>
            </div>
        </div>
    );
}