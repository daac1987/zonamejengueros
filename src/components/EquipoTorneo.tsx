'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Inscripcion {
    id: number;
    torneo_id: number;
    equipo_id: number;
    torneo: {
        nombre_torneo: string;
        usuario_torneo: {
            usuario_id: number;
        }[];
    } | null;
}

interface EquipoTorneoProps {
    equipoId: number | string;
}

export default function EquipoTorneo({ equipoId }: EquipoTorneoProps) {
    const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInscripciones = async () => {
            if (!equipoId) return;
            try {
                const res = await fetch(`/api/equipo/torneo?equipo_id=${equipoId}`);
                if (res.ok) {
                    const data = await res.json();
                    setInscripciones(data);
                }
            } catch (error) {
                console.error("Error cargando inscripciones:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInscripciones();
    }, [equipoId]);

    return (
        <div className="space-y-4">
            {/* Contenedor Principal */}
            {inscripciones.length > 0 && (
                <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900/80 to-black/90 border border-white/5 p-1 rounded-[2.5rem] shadow-2xl backdrop-blur-md">
                    <div className="p-6">
                        {/* Encabezado con Icono y Badge */}
                        <div className="flex items-center justify-between mb-6 px-2">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-[#facf00] rounded-full animate-ping" />
                                <h3 className="text-[#facf00] text-xs font-[1000] uppercase tracking-[0.2em]">
                                    Torneos en Disputa
                                </h3>
                            </div>
                            <span className="text-[10px] bg-white/5 text-white/40 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-white/5">
                                {inscripciones.length} Activos
                            </span>
                        </div>

                        {/* Lista de Torneos en Formato Grid/Cards */}
                        <div className="space-y-3 mb-6">
                            {inscripciones.map((ins, index) => (
                                <div
                                    key={ins.id || index}
                                    className="group relative bg-white/[0.03] border border-white/5 p-4 rounded-2xl transition-all duration-300 hover:bg-white/[0.07] hover:border-[#facf00]/30 hover:translate-x-1"
                                >
                                    <div className="flex justify-between items-center relative z-10">
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-[9px] font-black uppercase tracking-tighter">Competencia</span>
                                            <span className="text-white text-sm font-bold italic uppercase tracking-tight group-hover:text-[#facf00] transition-colors">
                                                {ins.torneo?.nombre_torneo || "Torneo Amateur"}
                                            </span>
                                        </div>

                                        <Link href={`/torneos/${ins.torneo?.usuario_torneo[0]?.usuario_id}`}>
                                            <button className="bg-black text-[#facf00] text-[10px] font-black uppercase px-4 py-2 rounded-xl border border-[#facf00]/20 hover:bg-[#facf00] hover:text-black transition-all duration-300 shadow-lg shadow-black/50">
                                                Ver Torneo →
                                            </button>
                                        </Link>
                                    </div>

                                    {/* Línea decorativa interna al hacer hover */}
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 bg-[#facf00] group-hover:h-1/2 transition-all duration-300" />
                                </div>
                            ))}
                        </div>

                        {/* Sección PRO TIP Estilizada */}
                        <div className="relative mt-8 group">
                            <div className="absolute inset-0 bg-[#facf00]/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative bg-gradient-to-r from-white/[0.03] to-transparent border-l-2 border-[#facf00] p-4 rounded-r-2xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[#facf00] text-[10px] font-[1000] uppercase tracking-[0.2em]">PRO TIP</span>
                                    <div className="h-[1px] w-full bg-white/5" />
                                </div>
                                <p className="text-white/60 text-[11px] italic font-medium leading-relaxed leading-tight">
                                    "Confirma la sede y el color de las mejegas antes de pactar el reto para evitar confusiones."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}