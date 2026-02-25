"use client";

import React, { useState, useEffect } from 'react';
import { Users, Shield, Loader2, Plus } from 'lucide-react';
import Swal from 'sweetalert2';

interface EquipoInscrito {
    inscripcionTorneo_id: number;
    equipo_id: number;
    fecha_inscripcion: string;
    equipo: {
        encargado_equipo: string;
        telefono_equipo: string;
        nombre_equipo: string;
        logo_url?: string;
        categoria_equipo: {
            categoria_equipo: string;
        }
    };
}

interface Props {
    torneo_id: number | string;
    onSuccess?: () => void; // Prop estandarizada
}

const EquiposInscritos = ({ torneo_id, onSuccess }: Props) => {
    const [inscritos, setInscritos] = useState<EquipoInscrito[]>([]);
    const [cargando, setCargando] = useState(true);

    const idTorneo = Number(torneo_id);

    const cargarInscritos = async () => {
        try {
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
        cargarInscritos();
    }, [idTorneo]);

    const eliminarEquipo = async (inscripcionId: number) => {
        const result = await Swal.fire({
            title: '¿ESTÁS SEGURO?',
            text: "Esta acción eliminará al equipo del campeonato y borrará sus estadísticas.",
            icon: 'warning',
            showCancelButton: true,
            background: '#111',
            color: '#fff',
            confirmButtonColor: '#facf00',
            cancelButtonColor: '#27272a',
            confirmButtonText: 'SÍ, ELIMINAR',
            cancelButtonText: 'CANCELAR',
            heightAuto: false,
            customClass: {
                popup: 'rounded-[2rem] border border-white/10',
                title: 'font-black italic',
                confirmButton: 'text-black font-bold rounded-xl',
                cancelButton: 'text-white font-bold rounded-xl'
            }
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`/api/torneo/vincular?id=${inscripcionId}`, {
                    method: 'DELETE',
                });

                if (res.ok) {
                    // 1. Eliminamos localmente para que la UI responda instantáneamente
                    setInscritos(prev => prev.filter(item => item.inscripcionTorneo_id !== inscripcionId));
                    
                    // 2. Notificamos al Dashboard para refrescar el buscador de "VincularEquipos"
                    if (onSuccess) onSuccess();

                    Swal.fire({
                        title: '¡ELIMINADO!',
                        text: 'El equipo ha sido removido del torneo.',
                        icon: 'success',
                        background: '#111',
                        color: '#fff',
                        confirmButtonColor: '#facf00',
                        timer: 2000,
                        showConfirmButton: false
                    });
                } else {
                    throw new Error("No se pudo procesar la eliminación");
                }
            } catch (error) {
                console.error("Error:", error);
                Swal.fire({
                    title: 'ERROR',
                    text: 'Hubo un problema al conectar con el servidor.',
                    icon: 'error',
                    background: '#111',
                    color: '#fff',
                    confirmButtonColor: '#facf00'
                });
            }
        }
    };

    return (
        <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl w-full max-w-md">
            {/* Header del Componente */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black uppercase italic flex items-center gap-2 text-white">
                    <Users size={20} className="text-[#facf00]" /> Equipos Inscritos
                </h3>
                <span className="text-[10px] bg-white/5 px-3 py-1 rounded-full text-zinc-500 font-black">
                    {inscritos.length} TOTAL
                </span>
            </div>

            {/* Lista de Equipos */}
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar min-h-[150px]">
                {cargando ? (
                    <div className="flex flex-col items-center justify-center py-10 text-zinc-600">
                        <Loader2 size={24} className="animate-spin mb-2" />
                        <span className="text-[10px] font-black uppercase italic">Sincronizando...</span>
                    </div>
                ) : inscritos.length > 0 ? (
                    inscritos.map((item) => (
                        <div key={item.inscripcionTorneo_id} className="flex items-center justify-between p-3 bg-black/40 rounded-2xl border border-white/5 group hover:border-red-500/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-zinc-900 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
                                    {item.equipo.logo_url ? (
                                        <img src={item.equipo.logo_url} alt="logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <Shield size={18} className="text-zinc-700" />
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-black uppercase tracking-tighter text-zinc-200">
                                        {item.equipo.nombre_equipo}
                                    </span>
                                    <span className="text-[8px] text-zinc-600 font-bold uppercase">
                                        {item.equipo.categoria_equipo.categoria_equipo}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => eliminarEquipo(item.inscripcionTorneo_id)}
                                className="p-2.5 bg-zinc-900/50 rounded-xl text-zinc-500 hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95"
                                title="Eliminar del torneo"
                            >
                                <div className="rotate-45">
                                    <Plus size={16} strokeWidth={3} />
                                </div>
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-white/5 rounded-[2rem]">
                        <p className="text-zinc-600 text-[9px] uppercase font-black tracking-[0.2em]">
                            Sin equipos inscritos
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EquiposInscritos;