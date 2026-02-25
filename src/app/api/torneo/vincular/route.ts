import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { equipo_id, torneo_id } = body;

        // 1. Validaciones básicas
        if (!equipo_id || !torneo_id) {
            return NextResponse.json(
                { error: "Faltan datos obligatorios (equipo_id o torneo_id)" },
                { status: 400 }
            );
        }

        // 2. Verificar si ya existe la inscripción para evitar duplicados
        const existeInscripcion = await prisma.inscripciones_torneo.findFirst({
            where: {
                equipo_id: Number(equipo_id),
                torneo_id: Number(torneo_id)
            }
        });

        if (existeInscripcion) {
            return NextResponse.json(
                { error: "El equipo ya está inscrito en este torneo" },
                { status: 400 }
            );
        }

        // 3. Crear la inscripción y la entrada en tabla_posiciones en una sola transacción
        const resultado = await prisma.$transaction(async (tx) => {
            // A. Crear el registro de inscripción
            const inscripcion = await tx.inscripciones_torneo.create({
                data: {
                    equipo_id: Number(equipo_id),
                    torneo_id: Number(torneo_id),
                    fecha_inscripcion: new Date()
                }
            });

            // B. Crear el registro en tabla_posiciones vinculado a la inscripción recién creada
            await tx.tabla_posiciones.create({
                data: {
                    inscripcionTorneo_id: inscripcion.inscripcionTorneo_id,
                    puntos_ganados: 0,
                    partidos_jugados: 0,
                    diferencia_gol: 0
                }
            });

            return inscripcion;
        });

        return NextResponse.json(resultado, { status: 201 });

    } catch (error) {
        console.error("Error al inscribir equipo y crear tabla:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id'); // inscripcionTorneo_id

        if (!id) {
            return NextResponse.json({ error: "ID de inscripción requerido" }, { status: 400 });
        }

        const idNumero = Number(id);

        await prisma.$transaction(async (tx) => {
            // 1. Borramos los registros en la tabla de posiciones vinculados a esta inscripción
            // Usamos deleteMany por seguridad, aunque suele ser 1 a 1
            await tx.tabla_posiciones.deleteMany({
                where: {
                    inscripcionTorneo_id: idNumero
                }
            });

            // 2. Ahora que la tabla de posiciones está limpia, borramos la inscripción
            await tx.inscripciones_torneo.delete({
                where: {
                    inscripcionTorneo_id: idNumero
                }
            });
        });

        return NextResponse.json({ message: "Equipo y estadísticas eliminados con éxito" });
    } catch (error) {
        console.error("Error al eliminar vinculación:", error);
        return NextResponse.json({ error: "No se pudo eliminar el registro" }, { status: 500 });
    }
}