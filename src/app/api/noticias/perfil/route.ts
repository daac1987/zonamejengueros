import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id_raw = searchParams.get('id') || searchParams.get('usuario_id');

        if (!id_raw || id_raw === 'undefined') {
            return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
        }

        const targetId = parseInt(id_raw);

        // 1. Buscamos primero al USUARIO y sus vínculos de entidad
        const usuarioData = await prisma.usuario.findUnique({
            where: { usuario_id: targetId },
            include: {
                usuario_cancha: { include: { cancha: true } },
                usuario_torneo: { include: { torneo: true } },
                usuario_equipo: { include: { equipo: true } },
                // Incluimos las noticias directamente desde el usuario
                publicacion_noticia: {
                    orderBy: { fecha_noticia: 'desc' },
                    include: {
                        noticia: {
                            include: { categoria_noticia: true }
                        }
                    }
                }
            }
        });

        if (!usuarioData) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }

        // 2. Extraemos los datos de la entidad (Cancha, Torneo o Equipo)
        const relCancha = usuarioData.usuario_cancha?.[0]?.cancha;
        const relTorneo = usuarioData.usuario_torneo?.[0]?.torneo;
        const relEquipo = usuarioData.usuario_equipo?.[0]?.equipo;

        const entidadInfo = {
            entidad_id: relCancha?.cancha_id || relTorneo?.torneo_id || relEquipo?.equipo_id || usuarioData.usuario_id,
            entidad_nombre: relCancha?.nombre_cancha || relTorneo?.nombre_torneo || relEquipo?.nombre_equipo || "Personal",
            entidad_foto: relCancha?.sede_url || relTorneo?.logo_url || relEquipo?.logo_url || null,
            tipo_perfil: relCancha ? 'cancha' : relTorneo ? 'torneo' : relEquipo ? 'equipo' : 'usuario'
        };

        // 3. Mapeamos las noticias (si existen)
        const noticiasMapeadas = usuarioData.publicacion_noticia
            .filter(pub => pub.noticia)
            .map(pub => ({
                noticia_id: pub.noticia.noticia_id,
                titulo_noticia: pub.noticia.titulo_noticia,
                texto_noticia: pub.noticia.texto_noticia,
                foto_noticia_url: pub.noticia.foto_noticia_url,
                fecha_creacion: pub.fecha_noticia,
                nombre_categoria: pub.noticia.categoria_noticia?.categoria_noticia || "General",
                ...entidadInfo // Adjuntamos los datos de la entidad a cada noticia
            }));

        // 4. RETORNO IMPORTANTE:
        // Si no hay noticias, devolvemos un objeto con la info de la entidad y el array vacío
        // para que tu Frontend siempre tenga los datos del perfil.
        return NextResponse.json({
            perfil: entidadInfo,
            noticias: noticiasMapeadas
        });

    } catch (error: any) {
        console.error("Error en API:", error.message);
        return NextResponse.json({ error: "Error interno", detalle: error.message }, { status: 500 });
    }
}