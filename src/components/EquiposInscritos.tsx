"use client";

import React, { useState, useEffect } from 'react';
import { Users, Shield, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface EquipoInscrito {
    inscripcionTorneo_id: number;
    equipo_id: number;
    equipo: {
        nombre_equipo: string;
        logo_url?: string;
        categoria_equipo: {
            categoria_equipo: string;
        }
        usuario_equipo: {
            usuario_id: number;
        }[]
    };
}

interface Props {
    torneo_id: number | string;
}

const EquiposInscritos = ({ torneo_id }: Props) => {
    const [inscritos, setInscritos] = useState<EquipoInscrito[]>([]);
    const [cargando, setCargando] = useState(true);

    const idTorneo = Number(torneo_id);

    const cargarInscritos = async () => {
        try {
            setCargando(true);
            const res = await fetch(`/api/torneo/inscritos?torneo_id=${idTorneo}`);
            const data = await res.json();
            setInscritos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al cargar inscritos:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        if (idTorneo) cargarInscritos();
    }, [idTorneo]);

    return (
        <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                    <h3 className="text-lg font-black uppercase italic flex items-center gap-2 text-white tracking-tighter">
                        <Users size={20} className="text-[#facf00]" />
                        Equipos Inscritos
                    </h3>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest ml-7">
                        Lista oficial del torneo
                    </p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] bg-[#facf00]/10 border border-[#facf00]/20 px-3 py-1 rounded-full text-[#facf00] font-black">
                        {inscritos.length}
                    </span>
                </div>
            </div>

            {/* Lista de Equipos */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar min-h-[150px]">
                {cargando ? (
                    <div className="flex flex-col items-center justify-center py-12 text-zinc-600">
                        <Loader2 size={24} className="animate-spin mb-2" />
                        <span className="text-[10px] font-black uppercase italic tracking-widest">Sincronizando...</span>
                    </div>
                ) : inscritos.length > 0 ? (
                    inscritos.map((item) => (
                        <div
                            key={item.inscripcionTorneo_id}
                            className="flex items-center gap-4 p-3.5 bg-zinc-900/30 rounded-2xl border border-white/5 hover:bg-zinc-900/50 hover:border-white/10 transition-all group"
                        >
                            {/* Escudo / Logo */}
                            <div className="w-12 h-12 bg-black rounded-xl overflow-hidden border border-white/10 flex items-center justify-center shrink-0 shadow-2xl group-hover:scale-105 transition-transform">
                                {item.equipo.logo_url ? (
                                    <img src={item.equipo.logo_url} alt="logo" className="w-full h-full object-cover" />
                                ) : (
                                    <Shield size={20} className="text-zinc-800" />
                                )}
                            </div>

                            {/* Información del Equipo */}
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs font-black uppercase tracking-tighter text-zinc-100 truncate">
                                    {item.equipo.nombre_equipo}
                                </span>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[9px] text-[#facf00] font-black uppercase italic">
                                        Cat: {item.equipo.categoria_equipo.categoria_equipo}
                                    </span>
                                    <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
                                    <Link href={`/equipos/${item.equipo.usuario_equipo[0].usuario_id}`}>
                                        <button
                                            className="text-[#facf00] text-xs font-black italic uppercase tracking-widest border-b border-[#facf00] p-1 hover:text-white hover:border-white transition-all"
                                        >
                                            Ver Equipo →
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-14 border-2 border-dashed border-white/5 rounded-[2rem] bg-black/20">
                        <Users size={32} className="text-zinc-800 mb-3" />
                        <p className="text-zinc-600 text-[10px] uppercase font-black tracking-[0.2em] text-center px-4 leading-relaxed">
                            No se han encontrado<br />equipos registrados
                        </p>
                    </div>
                )}
            </div>

            {/* Footer sutil */}
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-center">
                <p className="text-[8px] text-zinc-700 font-black uppercase tracking-widest">
                    Sistema de Gestión de Torneos 2026
                </p>
            </div>
        </div>
    );
};

export default EquiposInscritos;