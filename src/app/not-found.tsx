'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-black">
      
      {/* Fondo Decorativo: Una Tarjeta Roja Gigante difuminada */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600 opacity-10 blur-[120px] rounded-full" />

      <div className="relative z-10 text-center max-w-2xl">
        
        {/* Icono de Tarjeta Roja */}
        <div className="inline-block w-24 h-36 bg-red-600 rounded-lg shadow-[0_0_50px_rgba(220,38,38,0.5)] mb-8 animate-bounce mx-auto border-4 border-red-500 flex items-center justify-center">
            <span className="text-black font-black text-4xl italic">404</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none text-white mb-4">
          ¡FUERA DE <br />
          <span className="text-red-600">LUGAR!</span>
        </h1>

        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-12 italic px-4">
          El árbitro ha pitado. La página que buscas no está en la cancha o se fue al camerino antes de tiempo.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link href="/" className="w-full md:w-auto">
            <button className="w-full bg-[#facf00] text-black px-8 py-4 rounded-xl font-black italic uppercase tracking-widest hover:bg-white transition-all active:scale-95">
              VOLVER A LA CANCHA
            </button>
          </Link>
          
          <Link href="/contacto" className="w-full md:w-auto">
            <button className="w-full bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-black italic uppercase tracking-widest hover:bg-white/10 transition-all">
              REPORTAR ERROR
            </button>
          </Link>
        </div>

        {/* Detalle visual de líneas de cancha */}
        <div className="mt-20 opacity-20">
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-white to-transparent" />
            <p className="text-[10px] font-black text-gray-500 uppercase mt-4 tracking-[0.5em]">
                VAR SYSTEM CHECK: PAGE_NOT_FOUND
            </p>
        </div>
      </div>
    </div>
  );
}