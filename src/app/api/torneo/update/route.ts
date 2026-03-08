import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';// Ajusta la ruta a tu instancia de prisma

export async function PUT(request: Request) {
    try {
        const body = await request.json();

        const {
            torneo_id,
            nombre_torneo,
            telefono_torneo,
            provincia_torneo,
            ubicacion_torneo,
            encargado_torneo,
            cantidad_equipos_torneo,
            cantidad_jugadores_id,
            categoria_equipo_id,
            especificaciones_torneo,
            precio_inscripcion_torneo,
            premioUno_torneo,
            premioDos_torneo,
            premioTres_torneo,
            logo_url,
            estado_torneo,
            fecha_inicio,
            sede_torneo,
        } = body;

        if (!torneo_id) {
            return NextResponse.json({ error: "ID del torneo requerido" }, { status: 400 });
        }

        const idTorneoNum = Number(torneo_id);
        const canchaId = sede_torneo?.[0]?.cancha_id;

        // --- LÓGICA DE SEDE ---
        let sedeLogic = undefined;

        if (canchaId && canchaId !== 'otra') {
            const idCanchaNum = Number(canchaId);

            // Verificamos si ya existe la relación en la tabla intermedia
            const sedeExistente = await prisma.sede_torneo.findFirst({
                where: { torneo_id: idTorneoNum }
            });

            if (sedeExistente) {
                // SI EXISTE: Usamos updateMany para cambiar la cancha_id
                sedeLogic = {
                    updateMany: {
                        where: { torneo_id: idTorneoNum },
                        data: { cancha_id: idCanchaNum }
                    }
                };
            } else {
                // NO EXISTE: Usamos create para insertar el nuevo registro
                sedeLogic = {
                    create: {
                        cancha_id: idCanchaNum
                    }
                };
            }
        }

        const torneoActualizado = await prisma.torneo.update({
            where: { torneo_id: idTorneoNum },
            data: {
                nombre_torneo,
                telefono_torneo,
                provincia_torneo,
                ubicacion_torneo,
                encargado_torneo,
                cantidad_equipos_torneo: parseInt(cantidad_equipos_torneo),
                cantidad_jugadores_id: parseInt(cantidad_jugadores_id),
                categoria_equipo_id: parseInt(categoria_equipo_id),
                especificaciones_torneo,
                precio_inscripcion_torneo: parseInt(precio_inscripcion_torneo),
                premioUno_torneo,
                premioDos_torneo,
                premioTres_torneo,
                logo_url,
                estado_torneo,
                fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : undefined,
                
                // Aplicamos la lógica de Sede (Create o UpdateMany)
                sede_torneo: sedeLogic
            }
        });

        return NextResponse.json(torneoActualizado, { status: 200 });

    } catch (error: any) {
        console.error("Error actualizando torneo:", error);
        return NextResponse.json(
            { error: "Error interno del servidor", details: error.message },
            { status: 500 }
        );
    }
}