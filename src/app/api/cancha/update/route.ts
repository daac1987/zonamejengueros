import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
    try {
        const body = await request.json();

        // Extraemos los datos del cuerpo de la petición
        const {
            cancha_id,
            nombre_cancha,
            telefono_cancha,
            encargado_cancha,
            grama_cancha,
            precio_cancha,
            horario_cancha,
            servicios_cancha,
            sede_url,
            foto_cancha_uno_url,
            foto_cancha_dos_url
        } = body;

        if (!cancha_id) {
            return NextResponse.json({ error: "ID de cancha requerido" }, { status: 400 });
        }

        // Actualizamos en la base de datos usando Prisma
        const canchaActualizada = await prisma.cancha.update({
            where: {
                cancha_id: parseInt(cancha_id),
            },
            data: {
                nombre_cancha,
                telefono_cancha,
                encargado_cancha,
                grama_cancha,
                // CAMBIO AQUÍ: Convertimos a número entero antes de enviar a Prisma
                precio_cancha: parseInt(precio_cancha) || 0,
                horario_cancha,
                servicios_cancha,
                // Asegúrate de que estos nombres coincidan con tu schema.prisma
                sede_url: sede_url,
                foto_sede_uno_url: foto_cancha_uno_url,
                foto_sede_dos_url: foto_cancha_dos_url,
            },
        });

        return NextResponse.json({
            message: "Perfil actualizado correctamente",
            data: canchaActualizada
        });

    } catch (error) {
        console.error("Error en API Update:", error);
        return NextResponse.json(
            { error: "Error interno al actualizar los datos" },
            { status: 500 }
        );
    }
}