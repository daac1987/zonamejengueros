"use client";

import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Shield, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2'; // Importamos SweetAlert

interface Equipo {
    id: number;
    nombre: string;
    escudo_url?: string;
    categoria_nombre: string;
    modalidad: string;
    equipo_id?: number;
}

const VincularEquipos = ({ torneo_id, onSuccess }: { torneo_id: number, onSuccess?: () => void }) => {
    const [busqueda, setBusqueda] = useState<string>("");
    const [vinculados, setVinculados] = useState<number[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [equiposDisponibles, setEquiposDisponibles] = useState<Equipo[]>([]);

    useEffect(() => {
        const cargarTodo = async () => {
            try {
                setCargando(true);
                const [resEquipos, resInscritos] = await Promise.all([
                    fetch('/api/equipos'),
                    fetch(`/api/torneo/inscritos?torneo_id=${torneo_id}`)
                ]);

                const todosLosEquipos = await resEquipos.json();
                const yaInscritos = await resInscritos.json();

                const db = Array.isArray(todosLosEquipos) ? todosLosEquipos : [];
                const inscritos = Array.isArray(yaInscritos) ? yaInscritos : [];

                const filtrados = db.filter(equipo => 
                    !inscritos.some(ins => (ins.equipo_id || ins.id) === equipo.id)
                );

                setEquiposDisponibles(filtrados);
            } catch (error) {
                console.error("Error al sincronizar equipos:", error);
            } finally {
                setCargando(false);
            }
        };

        if (torneo_id) cargarTodo();
    }, [torneo_id]);

    const handleVincularLocal = async (equipo: Equipo) => {
        if (vinculados.includes(equipo.id)) return;

        // --- INICIO DE SWEETALERT CONFIRMACIÓN ---
        const result = await Swal.fire({
            title: '¿INSCRIBIR EQUIPO?',
            text: `¿Deseas vincular a ${equipo.nombre} a este torneo?`,
            icon: 'question',
            showCancelButton: true,
            background: '#111',
            color: '#fff',
            confirmButtonColor: '#facf00',
            cancelButtonColor: '#27272a',
            confirmButtonText: 'SÍ, INSCRIBIR',
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
                const response = await fetch('/api/torneo/vincular', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        equipo_id: equipo.id,
                        torneo_id: Number(torneo_id)
                    }),
                });

                if (!response.ok) throw new Error('Error al vincular');

                setVinculados((prev) => [...prev, equipo.id]);
                
                // Éxito
                Swal.fire({
                    title: '¡INSCRITO!',
                    text: 'El equipo ha sido añadido correctamente.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#111',
                    color: '#fff',
                });

                if (onSuccess) onSuccess(); 
            } catch (error: any) {
                Swal.fire({
                    title: 'ERROR',
                    text: error.message,
                    icon: 'error',
                    background: '#111',
                    color: '#fff',
                });
            }
        }
    };

    const equiposVisibles = equiposDisponibles.filter(e =>
        e.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
        !vinculados.includes(e.id)
    );

    return (
        <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl w-full max-w-md">
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black uppercase italic flex items-center gap-2 text-[#facf00]">
                        <Users size={20} /> Inscribir Equipos
                    </h3>
                    {!cargando && (
                        <span className="text-[10px] bg-[#facf00]/10 px-3 py-1 rounded-full text-[#facf00] font-black">
                            {equiposVisibles.length} DISPONIBLES
                        </span>
                    )}
                </div>

                <div className="relative group">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#facf00] transition-colors" />
                    <input
                        type="text"
                        placeholder="BUSCAR EQUIPO..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full bg-black border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#facf00]/50 transition-all text-white placeholder:text-zinc-700"
                    />
                </div>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar min-h-[200px]">
                {cargando ? (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
                        <Loader2 size={24} className="animate-spin mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-500">Accediendo...</span>
                    </div>
                ) : equiposVisibles.length > 0 ? (
                    equiposVisibles.map((e) => (
                        <div key={e.id} className="flex items-center justify-between p-3 bg-zinc-900/30 rounded-2xl border border-white/5 hover:border-[#facf00]/30 hover:bg-zinc-900/50 transition-all group">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-black rounded-xl overflow-hidden border border-white/10 flex-shrink-0 flex items-center justify-center">
                                    {e.escudo_url ? (
                                        <img src={e.escudo_url} alt={e.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <Shield size={18} className="text-zinc-800" />
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-black uppercase tracking-tighter text-zinc-200 leading-tight">{e.nombre}</span>
                                    <span className="text-[8px] text-zinc-600 font-bold uppercase">{e.categoria_nombre}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleVincularLocal(e)} // Pasamos el objeto 'e' completo
                                className="p-2.5 bg-zinc-900 rounded-xl text-[#facf00] hover:bg-[#facf00] hover:text-black transition-all shadow-lg active:scale-95"
                            >
                                <Plus size={16} strokeWidth={3} />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-white/5 rounded-[2rem]">
                        <p className="text-zinc-600 text-[9px] uppercase font-black tracking-[0.2em]">
                            {busqueda ? "Sin coincidencias" : "Todos están inscritos"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VincularEquipos;