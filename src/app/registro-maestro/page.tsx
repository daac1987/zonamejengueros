'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut as LogOutIcon } from 'lucide-react';
import FormCancha from '@/src/components/registro/FormCancha'; 
import FormEquipo from '@/src/components/registro/FormEquipo';
import FormTorneo from '@/src/components/registro/FormTorneo';

type TipoRegistro = 'EQUIPO' | 'CANCHA' | 'TORNEO' | null;

export default function RegistroMaestroPage() {
    const [tipo, setTipo] = useState<TipoRegistro>(null);
    const router = useRouter();

    const OPCIONES = [
        { id: 'EQUIPO', icon: '⚽', titulo: 'MI EQUIPO', desc: 'Gestiona tu plantel y busca retos.' },
        { id: 'CANCHA', icon: '🏟️', titulo: 'MI CANCHA', desc: 'Publica tu sede y horarios.' },
        { id: 'TORNEO', icon: '🏆', titulo: 'MI TORNEO', desc: 'Crea ligas y gestiona inscripciones.' },
    ];

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 max-w-7xl mx-auto font-sans">

            {!tipo ? (
                /* --- SELECTOR DE INICIO (ESTILO CAPTURAS) --- */
                <div className="text-center animate-in fade-in zoom-in duration-300">
                    
                    {/* Botón de Cerrar Sesión en el selector */}
                    <div className="flex justify-center mb-10">
                        <button
                            onClick={() => { localStorage.clear(); router.push('/auth') }}
                            className="flex items-center gap-3 px-6 py-3 bg-zinc-900/50 rounded-2xl text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all border border-white/5 group"
                        >
                            <span className="text-[10px] font-black uppercase italic tracking-widest">Cerrar Sesión</span>
                            <LogOutIcon size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white mb-4 uppercase leading-none">
                        REGISTRO <span className="text-[#facf00]">OFICIAL</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-12">Escoge tu rol en la comunidad de Mejengueros</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {OPCIONES.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setTipo(opt.id as TipoRegistro)}
                                className="bg-[#111] border border-white/5 p-10 rounded-3xl text-left hover:border-[#facf00] hover:bg-[#facf00]/5 transition-all group relative overflow-hidden"
                            >
                                <span className="text-5xl mb-6 block group-hover:scale-110 transition-transform">{opt.icon}</span>
                                <h3 className="text-2xl font-black italic text-white uppercase group-hover:text-[#facf00]">{opt.titulo}</h3>
                                <p className="text-gray-500 text-xs font-bold mt-2 uppercase leading-tight">{opt.desc}</p>
                                <div className="absolute -bottom-2 -right-2 text-white/5 font-black italic text-6xl group-hover:text-[#facf00]/10">{opt.id}</div>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <>

                    {/* Renderizado Condicional de Componentes */}
                    {tipo === 'CANCHA' && <FormCancha onBack={() => setTipo(null)} />}
                    
                    {tipo === 'EQUIPO' && <FormEquipo onBack={() => setTipo(null)} />}

                    {tipo === 'TORNEO' && <FormTorneo onBack={() => setTipo(null)} />}    

                </>
            )}
        </div>
    );
}