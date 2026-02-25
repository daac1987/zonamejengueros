import Image from "next/image";
import EquiposCarousel from "@/src/components/EquiposCarousel";
import AboutSection from '@/src/components/AboutSection';
import NewsAndFields from "@/src/components/NewsAndFields";


export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Capa de brillo radial */}
      

      {/* Tu contenido */}
      <EquiposCarousel />
      <AboutSection />
      <NewsAndFields />
      
    </main>
  );
}
