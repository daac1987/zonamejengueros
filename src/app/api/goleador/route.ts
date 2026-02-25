import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Ajusta la ruta a tu configuración de prisma

// GET: Obtener goleadores de un torneo específico
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const torneoId = searchParams.get('torneo_id');

    if (!torneoId) {
        return NextResponse.json({ error: 'Falta torneo_id' }, { status: 400 });
    }

    try {
        const goleadores = await prisma.goleador.findMany({
            where: {
                inscripciones_torneo: {
                    torneo_id: Number(torneoId)
                }
            },
            include: {
                inscripciones_torneo: {
                    include: {
                        equipo: true
                    }
                }
            },
            orderBy: {
                goles_jugador: 'desc'
            }
        });
        return NextResponse.json(goleadores);
    } catch (error) {
        return NextResponse.json({ error: 'Error al obtener goleadores' }, { status: 500 });
    }
}

// POST: Crear un nuevo goleador
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nombre_jugador, goles_jugador, inscripcionTorneo_id } = body;

        // Validación básica
        if (!nombre_jugador || !inscripcionTorneo_id) {
            return NextResponse.json({ error: 'Campos obligatorios faltantes' }, { status: 400 });
        }

        const nuevoGoleador = await prisma.goleador.create({
            data: {
                nombre_jugador: nombre_jugador,
                goles_jugador: Number(goles_jugador) || 0,
                inscripcionTorneo_id: Number(inscripcionTorneo_id)
            }
        });

        return NextResponse.json(nuevoGoleador, { status: 201 });
    } catch (error) {
        console.error("Error en POST goleador:", error);
        return NextResponse.json({ error: 'Error al crear el goleador' }, { status: 500 });
    }
}

// PATCH: Actualizar goles de un jugador existente
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { jugador_id, nombre_jugador, goles_jugador } = body;

        if (!jugador_id) {
            return NextResponse.json({ error: 'Falta jugador_id' }, { status: 400 });
        }

        const actualizado = await prisma.goleador.update({
            where: { jugador_id: Number(jugador_id) },
            data: { 
                nombre_jugador: nombre_jugador, // Ahora actualiza el nombre
                goles_jugador: Number(goles_jugador) 
            }
        });

        return NextResponse.json(actualizado);
    } catch (error) {
        return NextResponse.json({ error: 'Error al actualizar datos' }, { status: 500 });
    }
}

// DELETE: Eliminar un goleador
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('jugador_id');

        if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

        await prisma.goleador.delete({
            where: { jugador_id: Number(id) }
        });

        return NextResponse.json({ message: 'Eliminado correctamente' });
    } catch (error) {
        return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
    }
}