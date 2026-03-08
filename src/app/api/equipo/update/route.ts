import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { equipo_id, sede_equipo, ...data } = body;

        if (!equipo_id) return NextResponse.json({ error: "ID faltante" }, { status: 400 });

        const idEquipoInt = parseInt(equipo_id);

        // 1. Preparamos la lógica de la sede
        let sedeLogic = {};

        if (Array.isArray(sede_equipo) && sede_equipo.length > 0) {
            const nuevaCanchaId = sede_equipo[0].cancha_id;

            if (nuevaCanchaId && nuevaCanchaId !== 'otra') {
                const idCanchaInt = parseInt(nuevaCanchaId);

                // Verificamos si ya existe una sede para este equipo
                const sedeExistente = await prisma.sede_equipo.findFirst({
                    where: { equipo_id: idEquipoInt }
                });

                if (sedeExistente) {
                    // SI EXISTE: Actualizamos
                    sedeLogic = {
                        updateMany: {
                            where: { equipo_id: idEquipoInt },
                            data: { cancha_id: idCanchaInt }
                        }
                    };
                } else {
                    // NO EXISTE: Creamos
                    sedeLogic = {
                        create: {
                            cancha_id: idCanchaInt
                        }
                    };
                }
            }
        }

        // 2. Ejecutamos la actualización principal del equipo
        const updated = await prisma.equipo.update({
            where: { equipo_id: idEquipoInt },
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
                
                // Aplicamos la lógica (create o updateMany)
                sede_equipo: Object.keys(sedeLogic).length > 0 ? sedeLogic : undefined
            },
        });

        return NextResponse.json(updated);
    } catch (error: any) {
        console.error("Error en API update:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}