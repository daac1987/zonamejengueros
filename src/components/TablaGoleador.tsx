"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Shield, Trophy, Medal } from 'lucide-react';

const TablaGoleador = ({ torneo_id }: { torneo_id: number }) => {
    const [goleadores, setGoleadores] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);

    const cargarGoleadores = async () => {
        try {
            setCargando(true);
            const res = await fetch(`/api/goleador?torneo_id=${torneo_id}`);
            const data = await res.json();
            // El backend ya debería devolverlos ordenados, pero aseguramos por si acaso
            const ordenados = Array.isArray(data) 
                ? data.sort((a, b) => b.goles_jugador - a.goles_jugador) 
                : [];
            setGoleadores(ordenados);
        } catch (error) {
            console.error("Error al obtener goleadores:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        if (torneo_id) {
            cargarGoleadores();
        }
    }, [torneo_id]);

    // Función para renderizar el icono de posición
    const renderPosicion = (index: number) => {
        if (index === 0) return <Medal size={20} className="text-[#facf00]" />;
        if (index === 1) return <Medal size={20} className="text-zinc-400" />;
        if (index === 2) return <Medal size={20} className="text-amber-700" />;
        return <span className="text-zinc-500 ml-1">{index + 1}</span>;
    };

    return (
        <div className="bg-[#111] p-8 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black uppercase italic flex items-center gap-2 text-white">
                        <Trophy size={24} className="text-[#facf00]" />
                        Tabla de Goleadores
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase ml-8 tracking-widest">
                        Máximos anotadores del torneo
                    </p>
                </div>
                {!cargando && goleadores.length > 0 && (
                    <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                        <span className="text-[10px] font-black text-[#facf00] uppercase italic">
                            Top Scorer: {goleadores[0].nombre_jugador}
                        </span>
                    </div>
                )}
            </div>

            {/* TABLA */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10 text-[10px] font-black uppercase text-zinc-500">
                            <th className="pb-4 px-2 w-16 text-center">Pos</th>
                            <th className="pb-4">Jugador</th>
                            <th className="pb-4">Equipo</th>
                            <th className="pb-4 text-center">Goles</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs font-bold uppercase tracking-tighter">
                        {cargando ? (
                            <tr>
                                <td colSpan={4} className="py-20 text-center">
                                    <Loader2 className="animate-spin mx-auto text-zinc-600" size={24} />
                                </td>
                            </tr>
                        ) : goleadores.length > 0 ? (
                            goleadores.map((g, i) => (
                                <tr 
                                    key={g.jugador_id} 
                                    className={`border-b border-white/5 group transition-colors ${i === 0 ? 'bg-[#facf00]/5' : 'hover:bg-zinc-900/40'}`}
                                >
                                    <td className="py-4 px-2 text-center font-black">
                                        <div className="flex justify-center italic">
                                            {renderPosicion(i)}
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <span className={`${i === 0 ? 'text-white' : 'text-zinc-300'} font-black italic`}>
                                            {g.nombre_jugador}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2 text-zinc-500">
                                            <Shield size={12} className={i === 0 ? 'text-[#facf00]' : ''} />
                                            <span className="truncate max-w-[150px]">
                                                {g.inscripciones_torneo?.equipo?.nombre_equipo || 'Sin Equipo'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={`py-4 text-center font-black text-lg ${i === 0 ? 'text-[#facf00]' : 'text-zinc-400'}`}>
                                        {g.goles_jugador}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-16 text-center text-zinc-600 uppercase text-[10px] italic">
                                    Estadísticas no disponibles
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TablaGoleador;