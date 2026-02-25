import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id_raw = searchParams.get('id');

        if (!id_raw || id_raw === 'undefined') {
            return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
        }

        const usuarioId = parseInt(id_raw);

        // Buscamos al usuario e incluimos su relación con la tabla cancha
        const usuarioConCancha = await prisma.usuario.findUnique({
            where: { usuario_id: usuarioId },
            include: {
                usuario_cancha: {
                    include: {
                        cancha: true // Aquí es donde están los datos reales
                    }
                }
            }
        });

        if (!usuarioConCancha || !usuarioConCancha.usuario_cancha?.[0]?.cancha) {
            return NextResponse.json({ error: "Datos de cancha no encontrados" }, { status: 404 });
        }

        // Extraemos la cancha del array de relaciones
        const canchaData = usuarioConCancha.usuario_cancha[0].cancha;

        // Mapeamos los datos exactamente como los espera tu función 'cargarDatos'
        const respuestaDashboard = {
            nombre_cancha: canchaData.nombre_cancha,
            telefono_cancha: canchaData.telefono_cancha,
            encargado_cancha: canchaData.encargado_cancha,
            grama_cancha: canchaData.grama_cancha,
            precio_cancha: canchaData.precio_cancha,
            horario_cancha: canchaData.horario_cancha,
            servicios_cancha: canchaData.servicios_cancha,
            sede_url: canchaData.sede_url,
            // Ajuste de nombres de fotos según tu frontend:
            foto_sede_uno_url: canchaData.foto_sede_uno_url,
            foto_sede_dos_url: canchaData.foto_sede_dos_url,
            // Pasamos el ID de la cancha por si lo necesitas
            cancha_id: canchaData.cancha_id
        };

        return NextResponse.json(respuestaDashboard);

    } catch (error: any) {
        console.error("Error en Dashboard Cancha:", error.message);
        return NextResponse.json({ error: "Error interno", detalle: error.message }, { status: 500 });
    }
}