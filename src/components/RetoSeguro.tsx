'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Phone, MapPin, User, Lock, Send, LogOut } from 'lucide-react';

interface Equipo {
    telefono_equipo: string;
    encargado_equipo?: string;
    provincia_equipo?: string;
    ubicacion_equipo?: string;
}

interface SeccionRetoProps {
    equipo: Equipo;
}

export default function SeccionReto({ equipo }: SeccionRetoProps) {
    const [sesionActiva, setSesionActiva] = useState(false);

    // Al cargar el componente, verificamos si hay sesión en el navegador
    useEffect(() => {
        const usuario = localStorage.getItem('usuario');
        if (usuario) {
            setSesionActiva(true);
        }
    }, []);

    // Función para limpiar la sesión
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
        // SI YA ESTÁ LOGUEADO: El botón funciona para Cerrar Sesión
        if (sesionActiva) {
            ejecutarCerrarSesion();
            return;
        }

        // SI NO ESTÁ LOGUEADO: Mostramos el formulario de Login
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
                // Llamada a tu API de login
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
                        text: 'Ahora puedes ver el contacto del equipo.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false,
                        background: '#1a1a1a',
                        color: '#fff'
                    });
                } else {
                    // Manejo de errores (incluyendo el 403 de email no verificado)
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
                
                {/* Decoración de fondo */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:bg-white/40 transition-colors" />

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="font-[1000] italic text-4xl uppercase tracking-tighter leading-[0.85]">
                            ¿QUIERES<br /><span className="text-black/40">RETARLOS?</span>
                        </h3>
                        <div className="bg-black text-[#facf00] p-2 rounded-lg -rotate-12">
                            <Send size={20} strokeWidth={3} />
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="bg-black/10 p-2 rounded-xl"><User size={18} /></div>
                            <div>
                                <p className="text-[10px] font-black uppercase opacity-50 mb-0.5">Encargado</p>
                                <p className="text-lg font-black italic uppercase leading-none">{equipo.encargado_equipo || "CAPITÁN"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-black/10 p-2 rounded-xl"><MapPin size={18} /></div>
                            <div>
                                <p className="text-[10px] font-black uppercase opacity-50 mb-0.5">Ubicación</p>
                                <p className="text-sm font-bold uppercase leading-none">{equipo.provincia_equipo}, {equipo.ubicacion_equipo}</p>
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
                                    <p className="text-[9px] font-black uppercase opacity-60 tracking-widest">WhatsApp Directo</p>
                                    <p className="text-xl font-[1000] italic leading-none">
                                        {sesionActiva ? equipo.telefono_equipo : "3XX XXX XXXX"}
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

                    {/* BOTÓN PRINCIPAL: Cambia según el estado de sesión */}
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