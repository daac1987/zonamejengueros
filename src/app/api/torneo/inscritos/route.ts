import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET para obtener equipos ya inscritos en un torneo específico
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const torneo_id = searchParams.get('torneo_id');

    if (!torneo_id) {
        return NextResponse.json({ error: "torneo_id es requerido" }, { status: 400 });
    }

    try {
        const inscritos = await prisma.inscripciones_torneo.findMany({
            where: { torneo_id: Number(torneo_id) },
            include: {
                equipo: {
                    include: {
                        categoria_equipo: true,
                        usuario_equipo: {
                            select: {
                                usuario_id: true,
                            }
                        }
                    }
                }
            }
        });
        return NextResponse.json(inscritos);
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener inscritos" }, { status: 500 });
    }
}
