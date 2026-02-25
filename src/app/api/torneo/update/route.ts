import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';// Ajusta la ruta a tu instancia de prisma

export async function PUT(request: Request) {
    try {
        const body = await request.json();

        // Desestructuramos los campos del body
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
        const canchaId = sede_torneo?.[0]?.cancha_id;
        // Validamos que el ID exista
        if (!torneo_id) {
            return NextResponse.json({ error: "ID del torneo requerido" }, { status: 400 });
        }

        const torneoActualizado = await prisma.torneo.update({
            where: {
                torneo_id: Number(torneo_id)
            },
            data: {
                nombre_torneo,
                telefono_torneo,
                provincia_torneo,
                ubicacion_torneo,
                encargado_torneo,
                // Convertimos a Int los campos que vienen del formulario como string
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
                // Convertimos el string ISO a objeto Date para Prisma
                fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : undefined,

                // tabla intermedia
                // Lógica para actualizar el ID de la cancha en la tabla sede_torneo
                sede_torneo: (canchaId && canchaId !== 'otra') ? {
                    updateMany: {
                        where: {
                            // Filtramos para asegurarnos de actualizar el registro correcto
                            // Si solo hay uno por torneo, esto basta:
                            torneo_id: Number(torneo_id)
                        },
                        data: {
                            cancha_id: Number(canchaId)
                        }
                    }
                } : undefined
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