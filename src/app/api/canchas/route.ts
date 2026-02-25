import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const canchas = await prisma.cancha.findMany({
            include: {
                usuario_cancha: true, 
            },
            orderBy: {
                nombre_cancha: 'asc'
            }
        });

        const canchasFormateadas = canchas.map(c => {
            // Extraemos el usuario_id de la relación (asumiendo que hay al menos uno)
            const idRelacionado = c.usuario_cancha.length > 0 
                ? c.usuario_cancha[0].usuario_id 
                : null;

            return {
                id: c.cancha_id,
                // CAMBIO AQUÍ: Usamos la constante que extrajimos de la relación
                usuario_id: idRelacionado,
                nombre: c.nombre_cancha,
                zona: c.provincia_cancha || "San José",
                // Mapeo simple de tipo si es ID numérico o string
                tipo: c.cantidad_jugadores_id,
                tipo_nombre: c.cantidad_jugadores_id ? `${c.cantidad_jugadores_id} VS ${c.cantidad_jugadores_id}` : "5 VS 5",
                gramilla: c.grama_cancha || "Sintética",
                precio: c.precio_cancha || 0,
                foto_cancha_url: c.sede_url || null,
                rating: "4.8"
            };
        });

        return NextResponse.json(canchasFormateadas);
    } catch (error) {
        console.error("Error en GET canchas:", error);
        return NextResponse.json({ error: "Error al cargar las sedes" }, { status: 500 });
    }
}