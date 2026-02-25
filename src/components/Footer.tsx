'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {

  return (
    <footer className="w-full bg-transparent backdrop-blur-md border-b border-t border-white/5 pt-16 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Columna 1: Branding */}
          <div className="md:col-span-1">
            <Image
              src="/logo4.png"
              alt="Mejengueros Logo"
              width={140}
              height={40}
              className="mb-6"
            />
            <p className="text-gray-500 text-sm font-bold italic leading-relaxed uppercase tracking-tighter">
              La plataforma definitiva para el fútbol amateur en Costa Rica. <br />
              <span className="text-[#facf00]">Donde nacen las leyendas de barrio.</span>
            </p>
          </div>

          {/* Columna 2: Navegación */}
          <div>
            <h4 className="text-white font-black italic mb-6 uppercase tracking-widest text-sm">Navegación</h4>
            <ul className="space-y-3 text-gray-500 font-bold text-xs uppercase">
              <li><Link href="/" className="hover:text-[#facf00] transition-colors">Inicio</Link></li>
              <li><Link href="/equipos" className="hover:text-[#facf00] transition-colors">Equipos</Link></li>
              <li><Link href="/canchas" className="hover:text-[#facf00] transition-colors">Canchas</Link></li>
              <li><Link href="/torneos" className="hover:text-[#facf00] transition-colors">Torneos</Link></li>
              <li><Link href="/noticias" className="hover:text-[#facf00] transition-colors">Noticias</Link></li>
            </ul>
          </div>

          {/* Columna 3: Soporte */}
          <div>
            <h4 className="text-white font-black italic mb-6 uppercase tracking-widest text-sm">Soporte</h4>
            <ul className="space-y-3 text-gray-500 font-bold text-xs uppercase">
              <li><Link href="/contacto" className="hover:text-[#facf00] transition-colors">Contacto</Link></li>
              <li><Link href="/reglas" className="hover:text-[#facf00] transition-colors">Reglamento de Retos</Link></li>
              <li><Link href="/terminos" className="hover:text-[#facf00] transition-colors">Términos y condiciones</Link></li>
            </ul>
          </div>

          {/* Columna 4: Social & Newsletter */}
          <div>
            <h4 className="text-white font-black italic mb-6 uppercase tracking-widest text-sm">Síguenos</h4>
            <div className="flex gap-4 mb-6">
              <div className="w-10 h-10 bg-[#111] rounded-full flex items-center justify-center hover:bg-[#facf00] hover:text-black transition-all cursor-pointer">
                <span className="font-black text-xs uppercase">IG</span>
              </div>
              <div className="w-10 h-10 bg-[#111] rounded-full flex items-center justify-center hover:bg-[#facf00] hover:text-black transition-all cursor-pointer">
                <span className="font-black text-xs uppercase">FB</span>
              </div>
              <div className="w-10 h-10 bg-[#111] rounded-full flex items-center justify-center hover:bg-[#facf00] hover:text-black transition-all cursor-pointer">
                <span className="font-black text-xs uppercase">TK</span>
              </div>
            </div>
          </div>
        </div>

        {/* Línea final y Copyright */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">
            © 2026 MEJENGUEROS S.A. TODOS LOS DERECHOS RESERVADOS.
          </p>
          <div className="flex gap-6">
            <span className="text-gray-700 text-[10px] font-black italic uppercase">Desarrollado con pasión por el fútbol</span>
          </div>
        </div>
      </div>
    </footer>
  );
}