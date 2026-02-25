'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Phone, User, Lock, Send, LogOut, Trophy, Calendar } from 'lucide-react';
import Link from 'next/link';

interface TorneoSeguroProps {
    torneo: {
        id: string;
        torneo_id: string;
        nombre_torneo: string;
        encargado_torneo: string;
        telefono_torneo: string;
        estado_torneo: string;
        precio_inscripcion_torneo: number | string;
    };
}

export default function TorneoSeguro({ torneo }: TorneoSeguroProps) {
    const [sesionActiva, setSesionActiva] = useState(false);

    useEffect(() => {
        const usuario = localStorage.getItem('usuario');
        if (usuario) {
            setSesionActiva(true);
        }
    }, []);

    const ejecutarCerrarSesion = () => {
        localStorage.removeItem('usuario');
        setSesionActiva(false);
        Swal.fire({
            title: 'SESIÓN FINALIZADA',
            text: 'Tu sesión se ha cerrado correctamente.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: '#1a1a1a',
            color: '#fff'
        });
    };

    const manejarAccionPrincipal = async () => {
        if (sesionActiva) {
            ejecutarCerrarSesion();
            return;
        }

        const { value: formValues } = await Swal.fire({
            title: 'INICIAR SESIÓN',
            html: `
                <input id="swal-input1" class="swal2-input" placeholder="Correo electrónico" style="color: black; border-radius: 12px; font-family: sans-serif;">
                <input id="swal-input2" type="password" class="swal2-input" placeholder="Contraseña" style="color: black; border-radius: 12px; font-family: sans-serif;">
            `,
            focusConfirm: false,
            background: '#1a1a1a',
            color: '#fff',
            confirmButtonText: 'INGRESAR',
            confirmButtonColor: '#facf00',
            showCancelButton: true,
            cancelButtonText: 'CANCELAR',
            preConfirm: () => {
                const email = (document.getElementById('swal-input1') as HTMLInputElement).value;
                const password = (document.getElementById('swal-input2') as HTMLInputElement).value;
                if (!email || !password) {
                    Swal.showValidationMessage('Por favor ingresa ambos campos');
                }
                return { email, password };
            },
            customClass: {
                popup: 'rounded-[2rem] border border-[#facf00]/20',
                confirmButton: 'rounded-xl font-bold text-black px-8 py-3',
                cancelButton: 'rounded-xl font-bold px-8 py-3'
            }
        });

        if (formValues) {
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formValues)
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('usuario', JSON.stringify(data.usuario));
                    setSesionActiva(true);
                    Swal.fire({
                        title: '¡BIENVENIDO!',
                        text: 'Ahora puedes inscribir a tu equipo.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false,
                        background: '#1a1a1a',
                        color: '#fff'
                    });
                } else {
                    Swal.fire({
                        title: 'ACCESO DENEGADO',
                        text: data.error || 'Credenciales incorrectas',
                        icon: 'error',
                        confirmButtonColor: '#facf00',
                        background: '#1a1a1a',
                        color: '#fff'
                    });
                }
            } catch (error) {
                Swal.fire('ERROR', 'No se pudo conectar con el servidor', 'error');
            }
        }
    };

    return (
        <div className="group bg-[#facf00] p-1 rounded-[2.6rem] shadow-[0_20px_50px_rgba(250,207,0,0.3)] transition-all duration-500 hover:shadow-[0_25px_60px_rgba(250,207,0,0.4)] w-full max-w-md mx-auto">
            <div className="bg-[#facf00] p-8 rounded-[2.5rem] text-black relative overflow-hidden h-full border-2 border-black/5">
                
                {/* Decoración de fondo idéntica */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:bg-white/40 transition-colors" />

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="font-[1000] italic text-4xl uppercase tracking-tighter leading-[0.85]">
                            RESERVA TU<br /><span className="text-black/40">CUPO</span>
                        </h3>
                        <div className="bg-black text-[#facf00] p-2 rounded-lg -rotate-12">
                            <Trophy size={20} strokeWidth={3} />
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        {/* Inscripción/Precio */}
                        <div className="flex items-center gap-3">
                            <div className="bg-black/10 p-2 rounded-xl"><Calendar size={18} /></div>
                            <div>
                                <p className="text-[10px] font-black uppercase opacity-50 mb-0.5">Inscripción</p>
                                <p className="text-lg font-black italic uppercase leading-none">
                                    ₡{Number(torneo.precio_inscripcion_torneo).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Encargado del Torneo */}
                        <div className="flex items-center gap-3">
                            <div className="bg-black/10 p-2 rounded-xl"><User size={18} /></div>
                            <div>
                                <p className="text-[10px] font-black uppercase opacity-50 mb-0.5">Organizador</p>
                                <p className="text-sm font-bold uppercase leading-none">{torneo.encargado_torneo}</p>
                            </div>
                        </div>

                        {/* Bloque de número con Blur dinámico */}
                        <div className="relative mt-6">
                            <div className={`
                                flex items-center gap-4 bg-black text-[#facf00] p-4 rounded-2xl transition-all duration-700
                                ${!sesionActiva ? 'blur-md opacity-40 select-none grayscale' : 'animate-in zoom-in-95'}
                            `}>
                                <div className="bg-[#facf00] text-black p-2 rounded-lg">
                                    <Phone size={20} fill="currentColor" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase opacity-60 tracking-widest">WhatsApp Soporte</p>
                                    <p className="text-xl font-[1000] italic leading-none">
                                        {sesionActiva ? torneo.telefono_torneo : "3XX XXX XXXX"}
                                    </p>
                                </div>
                            </div>
                            
                            {!sesionActiva && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="flex items-center gap-2 bg-[#facf00] border-2 border-black text-black px-4 py-1.5 rounded-full shadow-xl rotate-2">
                                        <Lock size={12} strokeWidth={3} />
                                        <span className="text-[10px] font-black uppercase">Bloqueado</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="space-y-3">

                        <button
                            onClick={manejarAccionPrincipal}
                            className={`w-full py-5 rounded-2xl font-[1000] italic uppercase tracking-[0.2em] text-lg flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95
                            ${sesionActiva 
                                ? 'bg-red-600 text-white hover:bg-red-700' 
                                : 'bg-black text-[#facf00] hover:scale-[1.02]'
                            }`}
                        >
                            {sesionActiva ? (
                                <>CERRAR SESIÓN <LogOut size={20} /></>
                            ) : (
                                <>INICIA SESION <Send size={20} /></>
                            )}
                        </button>
                    </div>
                    
                    {!sesionActiva && (
                        <p className="text-[9px] text-center mt-4 font-black uppercase opacity-40 tracking-widest">
                            Inicia sesión para desbloquear datos
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}