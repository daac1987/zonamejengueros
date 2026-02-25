import Link from 'next/link';
import Image from 'next/image';
import '../css_components/Navbar.css';

export default function Navbar() {
  return (
    // Cambiamos p-3 por py-1 (padding vertical mínimo) y px-6 (padding horizontal)
    <nav className="sticky top-0 z-50 flex items-center justify-center py-1 px-6 bg-transparent backdrop-blur-md border-b border-white/5 h-14">

      <div className="flex items-center pt-1">
        <Link href="/">
          <Image
            src="/logo4.png"
            alt="Mejengueros Logo"
            // Reducimos un poco el tamaño para que no fuerce la altura del nav
            width={130}
            height={40}
            className="object-contain"
            priority
          />
        </Link>
      </div>
      {/* Reducimos el tamaño de fuente con text-sm para que se vea más elegante */}
      <ul className="flex gap-6 text-white text-sm">
        <li>
          <Link href="/" className="font-semibold hover:text-[#facf00] transition-colors tracking-widest">
            INICIO
          </Link>
        </li>


        <li>
          <Link href="/auth" className="font-semibold hover:text-[#facf00] transition-colors tracking-widest">
            REGISTRO
          </Link>
        </li>
        <li>
          <Link href="/contacto" className="font-semibold hover:text-[#facf00] transition-colors tracking-widest">
            CONTACTO
          </Link>
        </li>
      </ul>
    </nav>
  );
}