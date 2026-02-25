import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. OBTENER NOTICIAS
export async function GET(req: Request) {

    const { searchParams } = new URL(req.url);
    const usuario_id_raw = searchParams.get('usuario_id');

    // 1. Validamos si es un ID válido para evitar errores de Prisma con "undefined" o "null"
    const usuario_id = (usuario_id_raw && usuario_id_raw !== 'undefined' && usuario_id_raw !== 'null')
        ? parseInt(usuario_id_raw)
        : null;

    try {
        const publicaciones = await prisma.publicacion_noticia.findMany({
            where: usuario_id ? { usuario_id: usuario_id } : {},
            orderBy: { fecha_noticia: 'desc' },
            include: {
                noticia: true,
                usuario: {
                    include: {
                        usuario_cancha: { include: { cancha: true } },
                        usuario_equipo: { include: { equipo: true } },
                        usuario_torneo: { include: { torneo: true } }
                    }
                }
            }
        });

        const noticiasFormateadas = publicaciones.map(pub => {
            const user = pub.usuario;
            // Extraemos los datos de las relaciones (accediendo al primer elemento del array)
            const datosCancha = user?.usuario_cancha?.[0]?.cancha;
            const datosEquipo = user?.usuario_equipo?.[0]?.equipo;
            const datosTorneo = user?.usuario_torneo?.[0]?.torneo;

            // 2. Determinamos la RUTA DINÁMICA basada en el tipo de usuario
            let rutaBase = "equipos"; // Valor por defecto
            if (datosCancha) {
                rutaBase = "canchas";
            } else if (datosTorneo) {
                rutaBase = "torneos";
            } else if (datosEquipo) {
                rutaBase = "equipos";
            }

            // 3. Determinamos el NOMBRE REAL del autor por prioridad
            const nombreReal =
                datosCancha?.nombre_cancha ||
                datosEquipo?.nombre_equipo ||
                datosTorneo?.nombre_torneo ||
                user?.nombre_usuario ||
                "Club";

            // 4. Retornamos el objeto formateado para el Frontend
            return {
                ...pub.noticia,
                fecha_noticia: pub.fecha_noticia,
                usuario_id: pub.usuario_id,
                nombre_autor: nombreReal,
                tipo_ruta: rutaBase, // <--- Esto permite el Link dinámico en el cliente
                foto_autor: datosEquipo?.logo_url ||
                    datosTorneo?.logo_url ||
                    datosCancha?.sede_url ||
                    null
            };

        });

        return NextResponse.json(noticiasFormateadas);
    } catch (error) {
        console.error("Error en GET noticias:", error);
        return NextResponse.json({ error: "Error al cargar noticias" }, { status: 500 });
    }
}

// 2. CREAR NOTICIA (Para el método handleCreateNews de tu Dashboard)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { titulo_noticia, texto_noticia, foto_noticia_url, categoria_noticia_id, usuario_id } = body;

        // Usamos una transacción para asegurarnos de que se crean ambas entradas
        const resultado = await prisma.$transaction(async (tx) => {
            // Primero creamos la noticia base
            const nuevaNoticia = await tx.noticia.create({
                data: {
                    titulo_noticia,
                    texto_noticia,
                    foto_noticia_url,
                    categoria_noticia_id: Number(categoria_noticia_id)
                }
            });

            // Luego creamos la relación con el usuario
            await tx.publicacion_noticia.create({
                data: {
                    usuario_id: parseInt(usuario_id),
                    noticia_id: nuevaNoticia.noticia_id,
                    fecha_noticia: new Date()
                }
            });

            return nuevaNoticia;
        });

        return NextResponse.json(resultado);
    } catch (error: any) {
        console.error("Error al crear noticia:", error.message);
        return NextResponse.json({ error: "No se pudo publicar la noticia" }, { status: 500 });
    }
}

// 3. ELIMINAR NOTICIA (Para el método handleDeleteNews de tu Dashboard)
export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    try {
        const noticiaId = parseInt(id);

        // Usamos una transacción para asegurarnos de que se borre todo o nada
        await prisma.$transaction([
            // 1. Borramos primero la relación en la tabla intermedia
            prisma.publicacion_noticia.deleteMany({
                where: { noticia_id: noticiaId }
            }),
            // 2. Ahora sí podemos borrar la noticia original
            prisma.noticia.delete({
                where: { noticia_id: noticiaId }
            })
        ]);

        return NextResponse.json({ message: 'Noticia eliminada' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error al eliminar la noticia' }, { status: 500 });
    }

}
