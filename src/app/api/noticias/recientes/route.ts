import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const usuario_id_raw = searchParams.get('id') || searchParams.get('usuario_id');

        if (!usuario_id_raw || usuario_id_raw === 'undefined' || usuario_id_raw === 'null') {
            return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
        }

        const usuario_id = parseInt(usuario_id_raw);

        // Buscamos las publicaciones con relaciones anidadas
        const publicaciones = await prisma.publicacion_noticia.findMany({
            where: { usuario_id: usuario_id },
            orderBy: { fecha_noticia: 'desc' },
            take: 2, 
            include: {
                noticia: {
                    include: {
                        categoria_noticia: true // Trae el nombre de la categoría (Ej: Torneos, Fichajes)
                    }
                } 
            }
        });

        // Mapeamos para que el Frontend reciba nombres de variables planos y directos
        const noticiasParaPerfil = publicaciones
            .filter(pub => pub.noticia) 
            .map(pub => ({
                noticia_id: pub.noticia.noticia_id,
                titulo_noticia: pub.noticia.titulo_noticia,
                texto_noticia: pub.noticia.texto_noticia,
                foto_noticia_url: pub.noticia.foto_noticia_url,
                fecha_noticia: pub.fecha_noticia,
                
                // --- DATOS DE LA CATEGORÍA (Relación anidada) ---
                // Si categoria_noticia es una tabla relacionada, extraemos el nombre aquí:
                nombre_categoria: pub.noticia.categoria_noticia?.categoria_noticia || "General",
                id_categoria: pub.noticia.categoria_noticia?.categoria_noticia_id || null
            }));

        return NextResponse.json(noticiasParaPerfil);

    } catch (error: any) {
        console.error("Error en API Perfil Noticias:", error);
        return NextResponse.json({ error: "Error interno", detalle: error.message }, { status: 500 });
    }
}