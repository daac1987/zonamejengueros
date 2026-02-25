'use client';
import { useState } from 'react';

export default function ContactoPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Función preparada para el futuro Backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Aquí irá tu fetch('/api/contact', { method: 'POST', ... })
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* LADO IZQUIERDO: TEXTO E INFO */}
        <div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-6">
            PATEA EL <br /><span className="text-[#facf00]">BALÓN.</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-12 italic">
            ¿Quieres anunciar tu cancha? ¿Problemas con un reto? <br />
            Escríbenos y nuestro equipo te responderá en breve.
          </p>

          <div className="space-y-8">
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 bg-[#111] border border-white/10 rounded-full flex items-center justify-center text-[#facf00] group-hover:bg-[#facf00] group-hover:text-black transition-all">
                📧
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase">Email Oficial</p>
                <p className="font-bold text-white uppercase italic">info@mejengueros.com</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 bg-[#111] border border-white/10 rounded-full flex items-center justify-center text-[#facf00] group-hover:bg-[#facf00] group-hover:text-black transition-all">
                📱
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase">WhatsApp Soporte</p>
                <p className="font-bold text-white uppercase italic">+506 8888-8888</p>
              </div>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: FORMULARIO */}
        <div className="bg-[#111] border border-white/5 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          {/* Decoración de fondo */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#facf00] opacity-5 blur-3xl rounded-full" />

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-[#facf00] uppercase ml-2">Nombre Completo</label>
                <input 
                  required
                  type="text" 
                  placeholder="Ej. Juan Pérez"
                  className="bg-black/50 border border-white/10 p-4 rounded-xl focus:border-[#facf00] outline-none text-white font-bold transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-[#facf00] uppercase ml-2">Asunto</label>
                <select className="bg-black/50 border border-white/10 p-4 rounded-xl focus:border-[#facf00] outline-none text-white font-bold transition-all appearance-none">
                  <option>SOPORTE TÉCNICO</option>
                  <option>PUBLICIDAD</option>
                  <option>REPORTE DE CANCHAS</option>
                  <option>REPORTE DE EQUIPO</option>
                  <option>OTRO</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-[#facf00] uppercase ml-2">Correo Electrónico</label>
              <input 
                required
                type="email" 
                placeholder="tu@email.com"
                className="bg-black/50 border border-white/10 p-4 rounded-xl focus:border-[#facf00] outline-none text-white font-bold transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-[#facf00] uppercase ml-2">Tu Mensaje</label>
              <textarea 
                required
                rows={4}
                placeholder="Cuéntanos cómo podemos ayudarte..."
                className="bg-black/50 border border-white/10 p-4 rounded-xl focus:border-[#facf00] outline-none text-white font-bold transition-all resize-none"
              />
            </div>

            <button 
              disabled={status !== 'idle'}
              type="submit"
              className={`w-full py-5 rounded-xl font-black italic uppercase tracking-widest transition-all ${
                status === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-[#facf00] text-black hover:bg-white active:scale-95'
              }`}
            >
              {status === 'idle' && 'Enviar Mensaje'}
              {status === 'loading' && 'Procesando...'}
              {status === 'success' && '¡Enviado con Éxito!'}
            </button>
          </form>
        </div>

      </div>

            {/* Botón de Regreso Estilizado */}
      <div className="mt-12 text-center">
        <button
          onClick={() => window.history.back()}
          className="text-[#facf00] font-black italic text-xs uppercase tracking-widest border-b border-[#facf00] pb-1 hover:text-white hover:border-white transition-all"
        >
          ← Volver atrás
        </button>
      </div>
    </div>
  );
}