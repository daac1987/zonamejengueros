'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  // Estados para capturar los datos
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loadingToast = toast.loading(
      isLogin ? 'Verificando credenciales...' : 'Registrando nuevo capitán...'
    );

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email, password } : { nombre, email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          // --- LÓGICA DE LOGIN ---
          localStorage.setItem('usuario_id', data.usuario.usuario_id);
          localStorage.setItem('nombre_usuario', data.usuario.nombre_usuario);

          if (data.usuario.tipoPerfil) {
            localStorage.setItem('tipo_perfil', data.usuario.tipoPerfil);
          }

          toast.success(`¡BIENVENIDO, ${data.usuario.nombre_usuario.toUpperCase()}!`, {
            id: loadingToast,
          });

          if (!data.usuario.tienePerfil) {
            router.push('/registro-maestro');
          } else {
            switch (data.usuario.tipoPerfil) {
              case 'CANCHA': router.push('/dashboard-cancha'); break;
              case 'EQUIPO': router.push('/dashboard-equipo'); break;
              case 'TORNEO': router.push('/dashboard-torneo'); break;
              default: router.push('/dashboard'); break;
            }
          }
        } else {
          // --- NUEVA LÓGICA DE REGISTRO CON VERIFICACIÓN ---
          toast.success('¡FICHAJE INICIADO!', {
            description: 'Te enviamos un enlace a tu correo. Debes confirmar tu cuenta para poder entrar al camerino.',
            id: loadingToast,
            duration: 8000,
          });

          // Limpiamos el formulario
          setNombre('');
          setEmail('');
          setPassword('');

          // Opcionalmente, cambiar a la pestaña de login
          setTimeout(() => setIsLogin(true), 3000);
        }
      } else {
        toast.error('JUGADA INVÁLIDA', {
          description: data.error || 'Revisa los datos ingresados.',
          id: loadingToast,
        });
      }
    } catch (error) {
      toast.error('FALLO DE SISTEMA', {
        description: 'No se pudo conectar con el estadio.',
        id: loadingToast,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4 bg-transparent text-white font-sans">
      <div className="w-full max-w-md">

        {/* Switch Estilizado */}
        <div className="flex bg-[#111] p-1 rounded-xl mb-8 border border-white/5">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-lg font-black italic uppercase text-xs transition-all ${isLogin ? 'bg-[#facf00] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-lg font-black italic uppercase text-xs transition-all ${!isLogin ? 'bg-[#facf00] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            Registrarse
          </button>
        </div>

        {/* Tarjeta de Formulario */}
        <div className="bg-[#111] border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#facf00] opacity-10 blur-[80px] rounded-full" />

          <div className="relative z-10">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">
              {isLogin ? 'BIENVENIDO, CAPITÁN' : 'CREA TU CUENTA'}
            </h2>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-8 italic">
              {isLogin ? 'Ingresa para gestionar tus retos' : 'Únete a la red de fútbol más grande de CR'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#facf00] uppercase ml-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 p-4 rounded-xl focus:border-[#facf00] outline-none text-white font-bold transition-all text-sm"
                    placeholder="Ej. Andrés Miranda"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#facf00] uppercase ml-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 p-4 rounded-xl focus:border-[#facf00] outline-none text-white font-bold transition-all text-sm"
                  placeholder="capitan@mejenga.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#facf00] uppercase ml-1">Contraseña</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 p-4 rounded-xl focus:border-[#facf00] outline-none text-white font-bold transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#facf00] text-black py-5 rounded-xl font-black italic uppercase tracking-widest hover:bg-white transition-all transform hover:-translate-y-1 active:scale-95 shadow-[0_10px_30px_rgba(250,207,0,0.15)] mt-4"
              >
                {isLogin ? 'ENTRAR AL CAMERINO' : 'FINALIZAR FICHAJE'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}