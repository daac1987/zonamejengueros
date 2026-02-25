import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET para obtener equipos ya inscritos en un torneo específico
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const equipo_id = searchParams.get('equipo_id');

    if (!equipo_id) {
        return NextResponse.json({ error: "equipo_id es requerido" }, { status: 400 });
    }

    try {
        const inscritos = await prisma.inscripciones_torneo.findMany({
            where: { equipo_id: Number(equipo_id) },
            include: {
                torneo: {
                    include: {
                        usuario_torneo:true
                    }
                }
          }, 
        });
        return NextResponse.json(inscritos);
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener inscritos" }, { status: 500 });
    }
}