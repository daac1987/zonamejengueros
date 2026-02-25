"use client";

import React, { useState, useEffect } from 'react';
import { ListOrdered, Loader2, Shield } from 'lucide-react';

const TablaPosiciones = ({ torneo_id }: { torneo_id: number }) => {
    const [inscritos, setInscritos] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);

    const cargarInscritos = async () => {
        try {
            setCargando(true);
            const res = await fetch(`/api/posiciones?torneo_id=${torneo_id}`);
            const data = await res.json();
            setInscritos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al obtener inscritos:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        if (torneo_id) cargarInscritos();
    }, [torneo_id]);

    return (
        <div className="bg-[#111] p-8 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden w-full">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black uppercase italic flex items-center gap-2">
                    <ListOrdered size={24} className="text-[#facf00]" />
                    Tabla de Posiciones
                </h3>
                {!cargando && (
                    <span className="text-[10px] font-black text-zinc-500 bg-white/5 px-4 py-1.5 rounded-full">
                        {inscritos.length} EQUIPOS
                    </span>
                )}
            </div>

            {/* TABLA DE SOLO LECTURA */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10 text-[10px] font-black uppercase text-zinc-500">
                            <th className="pb-4 px-2 w-16">Pos</th>
                            <th className="pb-4">Equipo</th>
                            <th className="pb-4 text-center">PJ</th>
                            <th className="pb-4 text-center">DG</th>
                            <th className="pb-4 text-right pr-4 text-[#facf00]">PTS</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs font-bold uppercase tracking-tighter">
                        {cargando ? (
                            <tr>
                                <td colSpan={5} className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-2 text-zinc-600">
                                        <Loader2 className="animate-spin" size={20} />
                                        <span className="text-[10px] font-black italic">Cargando clasificación...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : inscritos.length > 0 ? (
                            inscritos.map((e, i) => (
                                <tr key={e.inscripcion_id} className="border-b border-white/5 group hover:bg-white/[0.02] transition-colors">
                                    {/* POSICIÓN */}
                                    <td className="py-5 px-2 text-[#facf00] font-black text-lg">
                                        {i + 1}
                                    </td>

                                    {/* EQUIPO */}
                                    <td className="py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-black rounded-xl border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                                                {e.escudo ? (
                                                    <img src={e.escudo} alt="logo" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Shield size={16} className="text-zinc-700" />
                                                )}
                                            </div>
                                            <span className="text-zinc-200 text-sm tracking-normal font-black italic uppercase">{e.nombre_equipo}</span>
                                        </div>
                                    </td>

                                    {/* PJ */}
                                    <td className="py-5 text-center text-zinc-400 font-bold">
                                        {e.pj}
                                    </td>

                                    {/* DG */}
                                    <td className={`py-5 text-center font-bold ${e.dg > 0 ? 'text-green-500' : e.dg < 0 ? 'text-red-500' : 'text-zinc-500'}`}>
                                        {e.dg > 0 ? `+${e.dg}` : e.dg}
                                    </td>

                                    {/* PTS */}
                                    <td className="py-5 text-right pr-4">
                                        <span className="text-[#facf00] font-black text-base bg-[#facf00]/5 px-3 py-1 rounded-lg border border-[#facf00]/10">
                                            {e.puntos}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-16 text-center text-zinc-600 italic uppercase text-[10px] border-2 border-dashed border-white/5 rounded-[2rem]">
                                    No hay datos disponibles
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TablaPosiciones;