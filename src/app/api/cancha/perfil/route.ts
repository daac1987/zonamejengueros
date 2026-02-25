import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        // Ahora buscamos el parámetro 'id' asumiendo que es el ID de la cancha
        const idStr = searchParams.get('id');

        if (!idStr) {
            return NextResponse.json({ error: "Falta ID de la cancha" }, { status: 400 });
        }

        const numericId = parseInt(idStr);
        if (isNaN(numericId)) {
            return NextResponse.json({ error: "ID de cancha inválido" }, { status: 400 });
        }

        // Buscamos directamente en el modelo 'cancha'
        const canchaData = await prisma.cancha.findUnique({
            where: {
                cancha_id: numericId
            },
            include: {
                cantidad_jugadores: true,
                sede_equipo: true,
                // Incluimos la relación con el usuario para obtener el usuario_id
                usuario_cancha: {
                    select: {
                        usuario_id: true
                    }
                }
            }
        });

        // Verificamos si existe la cancha
        if (!canchaData) {
            return NextResponse.json({ error: "Cancha no encontrada" }, { status: 404 });
        }

        // Estructuramos la respuesta para que mantenga el formato que espera tu frontend
        // y que incluya el usuario_id de forma accesible
        const respuesta = {
            ...canchaData,
            // Extraemos el primer usuario_id vinculado si existe
            usuario_id: canchaData.usuario_cancha?.[0]?.usuario_id || null
        };

        return NextResponse.json(respuesta);

    } catch (error: any) {
        console.error("ERROR EN API CANCHA BY ID:", error.message);
        return NextResponse.json(
            { error: "Error interno del servidor", detalle: error.message },
            { status: 500 }
        );
    }
}