import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { equipo_id, ...data } = body;

        const updated = await prisma.equipo.update({
            where: { equipo_id: parseInt(equipo_id) },
            data: {
                nombre_equipo: data.nombre_equipo,
                telefono_equipo: data.telefono_equipo,
                provincia_equipo: data.provincia_equipo,
                ubicacion_equipo: data.ubicacion_equipo,
                encargado_equipo: data.encargado_equipo,
                logros_equipo: data.logros_equipo,
                categoria_equipo_id: data.categoria_equipo_id ? parseInt(data.categoria_equipo_id) : null,
                cantidad_jugadores_id: data.cantidad_jugadores_id ? parseInt(data.cantidad_jugadores_id) : null,
                logo_url: data.logo_url,
                foto_equipo_uno_url: data.foto_equipo_uno_url,
                foto_equipo_dos_url: data.foto_equipo_dos_url,
            },
        });

        return NextResponse.json(updated);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}