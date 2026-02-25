import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        // 1. Extraer el ID de los searchParams (ej: /api/cancha/perfil?id=5)
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "Falta el ID de la cancha" }, { status: 400 });
        }

        // 2. Buscar la cancha en la base de datos
        const cancha = await prisma.cancha.findUnique({
            where: {
                cancha_id: parseInt(id)
            },
            include: {
                // Incluimos la cantidad de jugadores para traer el texto (ej: "5 vs 5")
                cantidad_jugadores: true,
                // Si necesitas saber qué usuario la administra
                usuario_cancha: {
                    select: {
                        usuario_id: true
                    }
                }
            }
        });

        if (!cancha) {
            return NextResponse.json({ error: "Cancha no encontrada" }, { status: 404 });
        }

        return NextResponse.json(cancha);

    } catch (error) {
        console.error("Error al obtener perfil de cancha:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}