"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Shield, Edit3, Trophy, Plus, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

const TablaGoleadorActualizar = ({ torneo_id }: { torneo_id: number }) => {
    const [goleadores, setGoleadores] = useState<any[]>([]);
    const [equiposInscritos, setEquiposInscritos] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);

    // 1. Cargar Goleadores
    const cargarGoleadores = async () => {
        try {
            setCargando(true);
            const res = await fetch(`/api/goleador?torneo_id=${torneo_id}`);
            const data = await res.json();
            setGoleadores(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al obtener goleadores:", error);
        } finally {
            setCargando(false);
        }
    };

    // 2. Cargar Equipos para el Select
    const cargarEquipos = async () => {
        try {
            const res = await fetch(`/api/torneo/inscritos?torneo_id=${torneo_id}`);
            const data = await res.json();
            setEquiposInscritos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al cargar equipos:", error);
        }
    };

    useEffect(() => {
        if (torneo_id) {
            cargarGoleadores();
            cargarEquipos();
        }
    }, [torneo_id]);

    // 3. Crear Nuevo Goleador
    const nuevoGoleador = async () => {
        const opcionesEquipos = equiposInscritos.reduce((acc, eq) => {
            acc[eq.inscripcionTorneo_id] = eq.equipo?.nombre_equipo || 'Equipo sin nombre';
            return acc;
        }, {});

        const { value: formValues } = await Swal.fire({
            title: '<span class="text-white uppercase font-black italic">Nuevo Goleador</span>',
            background: '#111',
            html: `
                <div class="flex flex-col gap-4 p-4 text-left">
                    <div>
                        <label class="text-[10px] font-black text-zinc-500 uppercase ml-1">Seleccionar Equipo</label>
                        <select id="swal-equipo" class="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:border-[#facf00] outline-none transition-all">
                            <option value="">Seleccione un equipo...</option>
                            ${Object.entries(opcionesEquipos).map(([id, nombre]) => 
                                `<option value="${id}">${nombre}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-zinc-500 uppercase ml-1">Nombre del Jugador</label>
                        <input id="swal-nombre" type="text" class="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:border-[#facf00] outline-none transition-all" placeholder="Ej: Juan Pérez">
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-zinc-500 uppercase ml-1">Goles Iniciales</label>
                        <input id="swal-goles" type="number" class="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:border-[#facf00] outline-none transition-all" value="0">
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'REGISTRAR',
            confirmButtonColor: '#facf00',
            preConfirm: () => {
                const inscripcionTorneo_id = (document.getElementById('swal-equipo') as HTMLSelectElement).value;
                const nombre_jugador = (document.getElementById('swal-nombre') as HTMLInputElement).value;
                const goles_jugador = (document.getElementById('swal-goles') as HTMLInputElement).value;
                if (!inscripcionTorneo_id || !nombre_jugador) {
                    Swal.showValidationMessage('Equipo y Nombre son obligatorios');
                    return false;
                }
                return { inscripcionTorneo_id, nombre_jugador, goles_jugador };
            }
        });

        if (formValues) {
            try {
                const res = await fetch('/api/goleador', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...formValues,
                        goles_jugador: parseInt(formValues.goles_jugador)
                    })
                });
                if (res.ok) {
                    Swal.fire({ icon: 'success', title: '¡REGISTRADO!', background: '#111', color: '#fff', timer: 1500, showConfirmButton: false });
                    cargarGoleadores();
                }
            } catch (error) {
                Swal.fire('Error', 'No se pudo crear', 'error');
            }
        }
    };

    // 4. Actualizar Nombre y Goles
    const actualizarGoleador = async (jugador: any) => {
        const { value: formValues } = await Swal.fire({
            title: `<span class="text-white uppercase font-black italic">Editar: ${jugador.nombre_jugador}</span>`,
            background: '#111',
            html: `
                <div class="flex flex-col gap-4 p-4 text-left">
                    <div>
                        <label class="text-[10px] font-black text-zinc-500 uppercase ml-1">Nombre del Jugador</label>
                        <input id="edit-nombre" type="text" class="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:border-[#facf00] outline-none transition-all" value="${jugador.nombre_jugador}">
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-zinc-500 uppercase ml-1">Cantidad de Goles</label>
                        <input id="edit-goles" type="number" class="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:border-[#facf00] outline-none transition-all" value="${jugador.goles_jugador}">
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'ACTUALIZAR',
            confirmButtonColor: '#facf00',
            preConfirm: () => {
                return {
                    nombre: (document.getElementById('edit-nombre') as HTMLInputElement).value,
                    goles: (document.getElementById('edit-goles') as HTMLInputElement).value
                }
            }
        });

        if (formValues) {
            try {
                const res = await fetch('/api/goleador', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        jugador_id: jugador.jugador_id,
                        nombre_jugador: formValues.nombre,
                        goles_jugador: parseInt(formValues.goles)
                    })
                });
                if (res.ok) {
                    Swal.fire({ icon: 'success', title: '¡ACTUALIZADO!', background: '#111', color: '#fff', timer: 1500, showConfirmButton: false });
                    cargarGoleadores();
                }
            } catch (error) {
                Swal.fire('Error', 'No se pudo actualizar', 'error');
            }
        }
    };

    // 5. Eliminar Goleador
    const eliminarGoleador = async (id: number, nombre: string) => {
        const { isConfirmed } = await Swal.fire({
            title: `<span class="text-white uppercase font-black italic">¿Eliminar a ${nombre}?</span>`,
            text: "Esta acción eliminará permanentemente al goleador.",
            icon: 'warning',
            background: '#111',
            color: '#fff',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#27272a',
            confirmButtonText: 'SÍ, ELIMINAR',
            cancelButtonText: 'CANCELAR'
        });

        if (isConfirmed) {
            try {
                const res = await fetch(`/api/goleador?jugador_id=${id}`, { method: 'DELETE' });
                if (res.ok) {
                    Swal.fire({ icon: 'success', title: 'ELIMINADO', background: '#111', color: '#fff', timer: 1500, showConfirmButton: false });
                    cargarGoleadores();
                }
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar', 'error');
            }
        }
    };

    return (
        <div className="bg-[#111] p-8 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                <div>
                    <h3 className="text-xl font-black uppercase italic flex items-center gap-2">
                        <Trophy size={24} className="text-[#facf00]" />
                        Gestión de Goleadores
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase ml-8">Administración de pichichis</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={nuevoGoleador}
                        className="bg-[#facf00] text-black px-6 py-2.5 rounded-xl font-black italic text-xs uppercase flex items-center gap-2 hover:bg-white transition-all active:scale-95 shadow-lg shadow-[#facf00]/10"
                    >
                        <Plus size={16} strokeWidth={4} />
                        Nuevo Goleador
                    </button>
                    {!cargando && (
                        <span className="text-[10px] font-black text-zinc-400 bg-white/5 px-4 py-2.5 rounded-xl border border-white/5">
                            {goleadores.length} JUGADORES
                        </span>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10 text-[10px] font-black uppercase text-zinc-500">
                            <th className="pb-4 px-2 w-16">Pos</th>
                            <th className="pb-4">Jugador</th>
                            <th className="pb-4">Equipo</th>
                            <th className="pb-4 text-center">Goles</th>
                            <th className="pb-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs font-bold uppercase tracking-tighter">
                        {cargando ? (
                            <tr><td colSpan={5} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-zinc-600" size={24} /></td></tr>
                        ) : goleadores.length > 0 ? (
                            goleadores.map((g, i) => (
                                <tr key={g.jugador_id} className="border-b border-white/5 group hover:bg-zinc-900/40 transition-colors">
                                    <td className="py-4 px-2 text-[#facf00] font-black text-lg">{i + 1}</td>
                                    <td className="py-4 text-zinc-200">{g.nombre_jugador}</td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2 text-zinc-500">
                                            <Shield size={12} />
                                            <span className="truncate max-w-[150px]">{g.inscripciones_torneo?.equipo?.nombre_equipo || 'Sin Equipo'}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-center font-black text-[#facf00] text-lg">{g.goles_jugador}</td>
                                    <td className="py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => actualizarGoleador(g)} 
                                                className="w-8 h-8 flex items-center justify-center bg-zinc-900 rounded-lg text-zinc-500 hover:text-[#facf00] hover:bg-[#facf00]/10 transition-all"
                                            >
                                                <Edit3 size={14} />
                                            </button>
                                            <button 
                                                onClick={() => eliminarGoleador(g.jugador_id, g.nombre_jugador)} 
                                                className="w-8 h-8 flex items-center justify-center bg-zinc-900 rounded-lg text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={5} className="py-16 text-center text-zinc-600 uppercase text-[10px]">No hay goleadores registrados</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TablaGoleadorActualizar;