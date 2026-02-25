import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) { // Asegúrate de que se llame 'request'
    try {
        const { searchParams } = new URL(request.url); // Cambiado 'req' por 'request'
        const idStr = searchParams.get('id');

        if (!idStr) {
            return NextResponse.json({ error: "Falta ID de usuario" }, { status: 400 });
        }

        const numericId = parseInt(idStr);
        if (isNaN(numericId)) {
            return NextResponse.json({ error: "ID de usuario inválido" }, { status: 400 });
        }

        // Buscamos la relación y traemos todo el objeto del torneo sin filtrar campos
        const relacion = await prisma.usuario_torneo.findFirst({
            where: { usuario_id: numericId },
            include: {
                torneo: {
                    include: {
                        cantidad_jugadores: true,
                        categoria_equipo: true,
                        // Incluimos las sedes y las canchas
                        sede_torneo: {
                            include: {
                                cancha: true
                            }
                        }
                    }
                }
            }
        });

        if (!relacion || !relacion.torneo) {
            return NextResponse.json({ error: 'Torneo no encontrado' }, { status: 404 });
        }

        // Creamos una copia del objeto torneo e inyectamos el usuario_id
        const respuesta = {
            ...relacion.torneo,
            usuario_id: relacion.usuario_id // Esto añade el campo sin mover nada de sitio
        };
        return NextResponse.json(respuesta);
    } catch (error) {
        console.error("Error en API Perfil:", error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}