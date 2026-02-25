"use client";

import React, { useState, useEffect } from 'react';
import { ListOrdered, Loader2, Shield, Edit3 } from 'lucide-react';
import Swal from 'sweetalert2';

const TablaPosiciones = ({ torneo_id }: { torneo_id: number }) => {
    const [inscritos, setInscritos] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);

    // 1. Cargar datos de la tabla
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

    // 2. Función para actualizar estadísticas vía PATCH
    const actualizarEstadisticas = async (equipo: any) => {
        const { value: formValues } = await Swal.fire({
            title: `<span class="text-white uppercase font-black italic">Editar: ${equipo.nombre_equipo}</span>`,
            background: '#111',
            html: `
                <div class="flex flex-col gap-4 p-4 text-left">
                    <div>
                        <label class="text-[10px] font-black text-zinc-500 uppercase ml-1">Partidos Jugados</label>
                        <input id="pj" type="number" class="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:border-[#facf00] outline-none transition-all" value="${equipo.pj}">
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-zinc-500 uppercase ml-1">Diferencia de Goles</label>
                        <input id="dg" type="number" class="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:border-[#facf00] outline-none transition-all" value="${equipo.dg}">
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-zinc-500 uppercase ml-1">Puntos Totales</label>
                        <input id="pts" type="number" class="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:border-[#facf00] outline-none transition-all" value="${equipo.puntos}">
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'GUARDAR CAMBIOS',
            cancelButtonText: 'CANCELAR',
            confirmButtonColor: '#facf00',
            cancelButtonColor: '#27272a',
            customClass: {
                popup: 'rounded-[3rem] border border-white/5 shadow-2xl',
                confirmButton: 'rounded-xl font-black text-black px-6 py-3 order-2',
                cancelButton: 'rounded-xl font-black text-white px-6 py-3 order-1'
            },
            preConfirm: () => {
                const pj = (document.getElementById('pj') as HTMLInputElement).value;
                const dg = (document.getElementById('dg') as HTMLInputElement).value;
                const pts = (document.getElementById('pts') as HTMLInputElement).value;
                return { pj, dg, pts };
            }
        });

        if (formValues) {
            try {
                const res = await fetch('/api/posiciones', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        inscripcion_id: equipo.inscripcion_id,
                        pj: formValues.pj,
                        dg: formValues.dg,
                        puntos: formValues.pts
                    })
                });

                if (res.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡ACTUALIZADO!',
                        background: '#111',
                        color: '#fff',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    cargarInscritos(); // Refrescar la tabla
                }
            } catch (error) {
                Swal.fire('Error', 'No se pudo actualizar', 'error');
            }
        }
    };

    return (
        <div className="bg-[#111] p-8 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden">
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

            {/* TABLA */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10 text-[10px] font-black uppercase text-zinc-500">
                            <th className="pb-4 px-2 w-16">Pos</th>
                            <th className="pb-4">Equipo</th>
                            <th className="pb-4">PJ</th>
                            <th className="pb-4">DG</th>
                            <th className="pb-4 text-[#facf00]">PTS</th>
                            <th className="pb-4 text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs font-bold uppercase tracking-tighter">
                        {cargando ? (
                            <tr>
                                <td colSpan={6} className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-2 text-zinc-600">
                                        <Loader2 className="animate-spin" size={20} />
                                        <span className="text-[10px] font-black italic">Sincronizando tabla...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : inscritos.length > 0 ? (
                            inscritos.map((e, i) => (
                                <tr key={e.inscripcion_id} className="border-b border-white/5 group hover:bg-zinc-900/40 transition-colors">
                                    {/* POSICIÓN */}
                                    <td className="py-4 px-2 text-[#facf00] font-black text-lg">
                                        {i + 1}
                                    </td>

                                    {/* EQUIPO */}
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-black rounded-lg border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                                {e.escudo ? (
                                                    <img src={e.escudo} alt="logo" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Shield size={14} className="text-zinc-800" />
                                                )}
                                            </div>
                                            <span className="text-zinc-200">{e.nombre_equipo}</span>
                                        </div>
                                    </td>

                                    {/* PJ */}
                                    <td className="py-4 text-zinc-400 font-medium">
                                        {e.pj}
                                    </td>

                                    {/* DG */}
                                    <td className={`py-4 font-medium ${e.dg > 0 ? 'text-green-500' : e.dg < 0 ? 'text-red-500' : 'text-zinc-500'}`}>
                                        {e.dg > 0 ? `+${e.dg}` : e.dg}
                                    </td>

                                    {/* PTS */}
                                    <td className="py-4 font-black text-[#facf00] text-sm">
                                        {e.puntos}
                                    </td>

                                    {/* ACCIÓN */}
                                    <td className="py-4 text-center">
                                        <button 
                                            onClick={() => actualizarEstadisticas(e)}
                                            className="w-8 h-8 flex items-center justify-center mx-auto bg-zinc-900 rounded-lg text-zinc-500 hover:text-[#facf00] hover:bg-[#facf00]/10 transition-all active:scale-95"
                                            title="Editar estadísticas"
                                        >
                                            <Edit3 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="py-16 text-center text-zinc-600 italic uppercase text-[10px] border-2 border-dashed border-white/5 rounded-[2rem]">
                                    No hay equipos vinculados al torneo todavía
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