import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Ejemplo de cómo debería verse tu lógica en el route.ts
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { usuario_id, nombre_equipo, cancha_id, ...datosEquipo } = body;

        // VALIDACIÓN CRÍTICA
        const userId = parseInt(usuario_id);
        if (isNaN(userId)) {
            return Response.json({ error: "ID de usuario no válido" }, { status: 400 });
        }

        const resultado = await prisma.$transaction(async (tx) => {
            // 1. Crear el equipo
            const equipo = await tx.equipo.create({
                data: {
                    nombre_equipo,
                    ...datosEquipo, // Otros campos (provincia, ubicación, etc.)
                    categoria_equipo_id: parseInt(body.categoria_equipo_id),
                    cantidad_jugadores_id: parseInt(body.cantidad_jugadores_id),
                }
            });

            // 2. Vincular usuario con equipo (Donde tenías el error)
            await tx.usuario_equipo.create({
                data: {
                    usuario_id: userId, // Ahora es un número garantizado
                    equipo_id: equipo.equipo_id
                }
            });

            // 3. Registrar la sede si seleccionó una cancha
            if (cancha_id && cancha_id !== "0") {
                await tx.sede_equipo.create({
                    data: {
                        equipo_id: equipo.equipo_id,
                        cancha_id: parseInt(cancha_id)
                    }
                });
            }

            return equipo;
        });

        return Response.json(resultado, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Error interno" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const relaciones = await prisma.usuario_equipo.findMany({
            include: {
                equipo: {
                    include: {
                        categoria_equipo: true,
                        cantidad_jugadores: true,
                        sede_equipo: {
                            include: {
                                cancha: true
                            }
                        }
                    }
                }
            }
        });

        const equiposFormateados = relaciones.map((rel) => {
            const e = rel.equipo;

            // Obtenemos la primera sede si existe
            const sedePrincipal = e.sede_equipo[0]?.cancha;

            return {
                id: e.equipo_id,
                // --- AQUÍ ESTÁ EL DATO QUE NECESITAS ---
                usuario_id: rel.usuario_id, 
                // ---------------------------------------
                nombre: e.nombre_equipo,
                telefono: e.telefono_equipo,
                provincia: e.provincia_equipo,
                ubicacion_especifica: e.ubicacion_equipo,
                encargado: e.encargado_equipo,
                logros_equipo: e.logros_equipo,
                escudo_url: e.logo_url,
                fotos: [e.foto_equipo_uno_url, e.foto_equipo_dos_url].filter(Boolean),
                fecha_creacion: e.fecha_equipo,

                categoria_nombre: e.categoria_equipo?.categoria_equipo || "Sin categoría",
                modalidad: e.cantidad_jugadores?.cantidad_jugadores || "No definida",

                sede: sedePrincipal ? {
                    id: sedePrincipal.cancha_id,
                    nombre: sedePrincipal.nombre_cancha,
                } : null
            };
        });

        return NextResponse.json(equiposFormateados);
    } catch (error) {
        console.error("Error al obtener equipos con relaciones:", error);
        return NextResponse.json({ error: "Error al cargar equipos" }, { status: 500 });
    }
}