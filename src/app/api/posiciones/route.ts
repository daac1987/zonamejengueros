import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const torneo_id = searchParams.get('torneo_id');

        if (!torneo_id) {
            return NextResponse.json({ error: "Falta el torneo_id" }, { status: 400 });
        }

        // Buscamos en inscripciones_torneo (la tabla pivot)
        const inscripciones = await prisma.inscripciones_torneo.findMany({
            where: {
                torneo_id: Number(torneo_id)
            },
            include: {
                // Traemos los datos del equipo para saber quién es
                equipo: {
                    select: {
                        nombre_equipo: true,
                        logo_url: true,
                    }
                },
                // Traemos la tabla de posiciones vinculada a este inscripcionTorneo_id
                tabla_posiciones: true 
            }
        });

        // Formateamos la respuesta para que sea plana y fácil de leer en el componente
        const resultado = inscripciones.map((ins) => {
            // Como tabla_posiciones es una relación 1 a muchos en el modelo (aunque sea 1 a 1 en lógica)
            // tomamos el primer registro del array
            const stats = ins.tabla_posiciones[0];

            return {
                inscripcion_id: ins.inscripcionTorneo_id,
                equipo_id: ins.equipo_id,
                nombre_equipo: ins.equipo.nombre_equipo,
                escudo: ins.equipo.logo_url,
                // Si existe registro en la tabla de posiciones lo mostramos, si no, en 0
                pj: stats?.partidos_jugados ?? 0,
                puntos: stats?.puntos_ganados ?? 0,
                dg: stats?.diferencia_gol ?? 0,
                posicion_id: stats?.posicion_id ?? null
            };
        });

        // Opcional: Ordenar por puntos antes de enviar
        resultado.sort((a, b) => b.puntos - a.puntos || b.dg - a.dg);

        return NextResponse.json(resultado);

    } catch (error) {
        console.error("Error al obtener inscripciones y posiciones:", error);
        return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { inscripcion_id, pj, puntos, dg } = body;

        // 1. Validación de ID
        if (!inscripcion_id) {
            return NextResponse.json(
                { error: "El inscripcion_id es requerido para actualizar" },
                { status: 400 }
            );
        }

        // 2. Actualizar los datos en tabla_posiciones
        // Usamos updateMany porque en tu esquema la relación aparece como array tabla_posiciones[]
        const actualizacion = await prisma.tabla_posiciones.updateMany({
            where: {
                inscripcionTorneo_id: Number(inscripcion_id)
            },
            data: {
                partidos_jugados: pj !== undefined ? Number(pj) : undefined,
                puntos_ganados: puntos !== undefined ? Number(puntos) : undefined,
                diferencia_gol: dg !== undefined ? Number(dg) : undefined,
            }
        });

        if (actualizacion.count === 0) {
            return NextResponse.json(
                { error: "No se encontró el registro de posición para esta inscripción" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Estadísticas actualizadas correctamente" });

    } catch (error) {
        console.error("Error al actualizar tabla de posiciones:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}