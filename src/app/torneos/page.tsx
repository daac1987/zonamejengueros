'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';


export default function TorneosPage() {
    const [torneos, setTorneos] = useState<any[]>([]);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Estados de Filtros
    const [filtroZona, setFiltroZona] = useState('Todas');
    const [filtroCat, setFiltroCat] = useState('TODOS');

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [resTorneo, resCat] = await Promise.all([
                    fetch('/api/torneo'),
                    fetch('/api/categoria_equipo')
                ]);
                
                if (resTorneo.ok) setTorneos(await resTorneo.json());
                if (resCat.ok) setCategorias(await resCat.json());
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const torneosFiltrados = useMemo(() => {
        return torneos.filter(t => {
            const mZona = filtroZona === 'Todas' || t.zona === filtroZona;
            const mCat = filtroCat === 'TODOS' || t.categoria === filtroCat;
            return mZona && mCat;
        });
    }, [filtroZona, filtroCat, torneos]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-[#facf00] font-black italic tracking-tighter text-4xl">CARGANDO ARENA...</div>;

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 max-w-7xl mx-auto">

            {/* HEADER */}
            <div className="text-center mb-16">
                <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-none text-white">
                    ARENA DE <span className="text-[#facf00]">GLORIA</span>
                </h1>
                <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-xs mt-4">Gestión de campeonatos oficiales</p>
            </div>

            {/* FILTROS */}
            <div className="space-y-4 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select 
                        onChange={(e) => setFiltroZona(e.target.value)} 
                        className="bg-[#111] border border-white/10 p-4 rounded-xl text-[#facf00] font-black italic uppercase outline-none focus:border-[#facf00]"
                    >
                        <option value="Todas">FILTRAR POR CIUDAD (TODAS)</option>
                        <option value="San José">SAN JOSÉ</option>
                        <option value="Heredia">HEREDIA</option>
                        <option value="Alajuela">ALAJUELA</option>
                        <option value="Cartago">CARTAGO</option>
                        <option value="Guanacaste">GUANACASTE</option>
                        <option value="Limón">LIMÓN</option>
                        <option value="Puntarenas">PUNTARENAS</option>
                    </select>

                    <div className="flex flex-wrap gap-2 items-center justify-center md:justify-end">
                        <button
                            onClick={() => setFiltroCat('TODOS')}
                            className={`px-6 py-3 font-black italic text-[10px] tracking-widest transition-all skew-x-[-15deg] border ${filtroCat === 'TODOS' ? 'bg-[#facf00] text-black border-[#facf00]' : 'bg-transparent text-gray-500 border-white/10'}`}
                        >
                            <span className="inline-block skew-x-[15deg]">TODOS</span>
                        </button>
                        {categorias.map((cat) => (
                            <button
                                key={cat.categoria_equipo_id}
                                onClick={() => setFiltroCat(cat.categoria_equipo)}
                                className={`px-6 py-3 font-black italic text-[10px] tracking-widest transition-all skew-x-[-15deg] border ${filtroCat === cat.categoria_equipo ? 'bg-[#facf00] text-black border-[#facf00]' : 'bg-transparent text-gray-500 border-white/10'}`}
                            >
                                <span className="inline-block skew-x-[15deg] uppercase">{cat.categoria_equipo}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* LISTA DE TORNEOS */}
            <div className="space-y-6">
                {torneosFiltrados.map((torneo) => (
                    <div key={torneo.id} className="group relative bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-[#facf00]/30 transition-all">
                        <div className="flex flex-col md:flex-row">
                            {/* Lateral de Estado */}
                            <div className={`w-full md:w-3 ${torneo.estado === 'INSCRIPCIONES' ? 'bg-[#facf00]' :
                                    torneo.estado === 'EN CURSO' ? 'bg-blue-500' : 'bg-red-600'
                                }`} />

                            <div className="p-8 flex-grow grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
                                {/* Info Principal */}
                                <div className="lg:col-span-2">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`text-[8px] font-black px-2 py-1 rounded italic uppercase ${torneo.estado === 'INSCRIPCIONES' ? 'bg-[#facf00] text-black' : 'bg-white/10 text-gray-400'}`}>
                                            {torneo.estado === 'INSCRIPCIONES' ? 'INSCRIPCIÓN ABIERTA' : torneo.estado}
                                        </span>
                                        <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest italic">
                                            CATEGORIA {torneo.categoria} 
                                        </span>
                                    </div>
                                    <h3 className="text-4xl font-black italic text-white uppercase leading-none tracking-tighter">
                                        {torneo.nombre}
                                    </h3>
                                    <p className="text-gray-500 font-bold text-[10px] mt-2 uppercase tracking-widest italic">
                                        SEDE: {torneo.sede?.[0]?.cancha?.nombre_cancha || "POR DEFINIR"} • {torneo.zona}
                                    </p>
                                </div>

                                {/* Detalles Dinámicos */}
                                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-2">
                                    <div className="flex flex-col">
                                        <span className="text-gray-600 text-[8px] font-black uppercase tracking-[0.2em]">Formato</span>
                                        <span className="text-white font-black italic text-sm">{torneo.tipo}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-600 text-[8px] font-black uppercase tracking-[0.2em]">Gran Premio</span>
                                        <span className="text-[#facf00] font-black italic text-sm uppercase leading-none">{torneo.premio}</span>
                                    </div>
                                </div>

                                {/* Botones de Acción */}
                                <div className="space-y-3">
                                    {torneo.estado === 'INSCRIPCIONES' ? (
                                        <>
                                            <p className="text-2xl font-black italic text-white text-center md:text-right mb-2">INSCRIPCION ₡{Number(torneo.precio).toLocaleString()}</p>
                                            <Link href={`/torneos/${torneo.usuario}`}>
                                                <button className="w-full py-4 bg-[#facf00] text-black rounded-2xl font-black italic uppercase text-xs tracking-widest hover:bg-white transition-all shadow-xl">
                                                    Inscribir mi Equipo
                                                </button>
                                            </Link>
                                        </>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-2">
                                            <Link href={`/torneos/${torneo.usuario}`}>
                                                <button className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-xl font-black italic uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all">
                                                    📰 Noticias del Torneo
                                                </button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* BANNER PARA ORGANIZADORES */}
            <div className="mt-24 bg-[#facf00] p-1 rounded-[3rem] overflow-hidden group">
                <div className="bg-black p-12 rounded-[2.8rem] flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl text-center md:text-left">
                        <h2 className="text-5xl font-black italic uppercase leading-none mb-4 text-white">
                            ¿ORGANIZAS UN <span className="text-[#facf00]">TORNEO?</span>
                        </h2>
                        <p className="text-gray-500 font-bold text-xs uppercase leading-relaxed italic tracking-widest">
                            Publica tu evento y gestiona inscripciones, noticias y equipos desde un solo lugar.
                        </p>
                    </div>
                    <Link href="/auth">
                        <button className="bg-[#facf00] text-black px-12 py-6 rounded-2xl font-black italic uppercase tracking-widest hover:scale-105 transition-all">
                            REGISTRATE AHORA
                        </button>
                    </Link>
                </div>
            </div>

            {/* Volver atrás */}
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