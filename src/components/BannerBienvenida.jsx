'use client';

import { useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Trophy, Megaphone, Users } from 'lucide-react';

const MySwal = withReactContent(Swal);

export const BannerBienvenida = () => {

  useEffect(() => {
    // Verificamos si ya se mostró antes
    const visto = localStorage.getItem('zona_mejengueros_intro');

    if (!visto) {
      MySwal.fire({
        html: (
          <div className="text-left p-2">
            {/* HEADER */}
            <div className="mb-6">
              <span className="text-[#facf00] font-black italic text-[10px] tracking-widest uppercase block mb-1">
                BIENVENIDO A LA COMUNIDAD
              </span>
              <h2 className="text-4xl font-black italic text-white uppercase leading-none">
                ZONA <span className="text-[#facf00]">MEJENGUEROS</span>
              </h2>
            </div>

            {/* PROPÓSITO */}
            <p className="text-zinc-400 text-sm font-medium mb-8 leading-relaxed">
              Nacimos para profesionalizar las mejengas en Costa Rica. Aquí no solo juegas,
              gestionas tu equipo como un profesional y te enteras de todo lo que pasa en la cancha.
            </p>

            {/* FUNCIONALIDADES */}
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-[#1a1a1a] border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                <div className="bg-[#facf00]/10 p-3 rounded-xl">
                  <Trophy className="text-[#facf00]" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-black italic text-xs uppercase">Torneos Élite</h4>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tight">
                    Tablas de posiciones y estadísticas en tiempo real.
                  </p>
                </div>
              </div>

              <div className="bg-[#1a1a1a] border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                <div className="bg-[#facf00]/10 p-3 rounded-xl">
                  <Megaphone className="text-[#facf00]" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-black italic text-xs uppercase">Noticias Locales</h4>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tight">
                    Enterate de fichajes, retos y resultados diarios.
                  </p>
                </div>
              </div>

              <div className="bg-[#1a1a1a] border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                <div className="bg-[#facf00]/10 p-3 rounded-xl">
                  <Users className="text-[#facf00]" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-black italic text-xs uppercase">Gestión de Capitanes</h4>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tight">
                    Administra tu plantilla y asegura tu lugar en la comunidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ),
        background: '#111',
        showConfirmButton: true,
        confirmButtonText: '¡A JUGAR!',
        buttonsStyling: false,
        allowOutsideClick: false,
        customClass: {
          popup: 'rounded-[3rem] border border-white/5 shadow-2xl px-6 py-10', // Aumentamos un poco el aire del modal
          confirmButton: `
          w-full 
          bg-[#facf00] 
          text-black 
          py-5 
          px-12 
          rounded-2xl 
          font-black 
          italic 
          uppercase 
          tracking-[0.15em] 
          text-xs 
          hover:scale-[1.02] 
          transition-all 
          active:scale-95 
          border-b-4 
          border-black/20
          mt-8 `
        },
        showClass: {
          popup: 'animate__animated animate__fadeInUp animate__faster'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutDown animate__faster'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem('zona_mejengueros_intro', 'true');
        }
      });
    }
  }, []);

  return null; // Necesario para que React no de error al usarlo como <BannerBienvenida />
};