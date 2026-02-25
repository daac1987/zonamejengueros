import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const idStr = searchParams.get('id');

        if (!idStr) {
            return NextResponse.json({ error: "Falta ID de usuario" }, { status: 400 });
        }

        const numericId = parseInt(idStr);
        if (isNaN(numericId)) {
            return NextResponse.json({ error: "ID de usuario inválido" }, { status: 400 });
        }

        // Buscamos directamente en la tabla puente usando el usuario_id
        const vinculacion = await prisma.usuario_equipo.findFirst({
            where: {
                usuario_id: numericId
            },
            include: {
                equipo: {
                    include: {
                        categoria_equipo: true,
                        cantidad_jugadores: true,
                        sede_equipo: true,
                        usuario_equipo: {
                            include: {
                                usuario: true
                            }
                        }
                    }
                },
            }
        });

        // Verificamos si existe la vinculación y el equipo
        if (!vinculacion || !vinculacion.equipo) {
            return NextResponse.json({ error: "Este usuario no tiene un equipo asignado" }, { status: 404 });
        }

        // Retornamos únicamente la data del equipo
        return NextResponse.json(vinculacion.equipo);

    } catch (error: any) {
        console.error("ERROR EN API PERFIL EQUIPO (USUARIO_EQUIPO):", error.message);
        return NextResponse.json(
            { error: "Error interno del servidor", detalle: error.message },
            { status: 500 }
        );
    }
}