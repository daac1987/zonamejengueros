import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const {
      nombre_torneo,
      encargado_torneo,
      telefono_torneo,
      provincia_torneo,
      ubicacion_torneo,
      cantidad_equipos_torneo,
      cantidad_jugadores_id,
      categoria_equipo_id,
      precio_inscripcion_torneo,
      especificaciones_torneo,
      premioUno_torneo,
      premioDos_torneo,
      premioTres_torneo,
      logo_url,
      usuario_id,
      estado_torneo = 'INSCRIPCIONES', // Valor por defecto
      fecha_inicio,
      cancha_id,
    } = data;

    // Validación básica
    if (!nombre_torneo || !usuario_id) {
      return NextResponse.json(
        { error: 'Faltan datos obligatorios (Nombre o Usuario)' },
        { status: 400 }
      );
    }

    // Usamos una transacción para asegurar integridad de datos
    const resultado = await prisma.$transaction(async (tx) => {

      // 1. Crear el torneo
      const nuevoTorneo = await tx.torneo.create({
        data: {
          nombre_torneo,
          encargado_torneo,
          telefono_torneo,
          provincia_torneo,
          ubicacion_torneo,
          cantidad_equipos_torneo: parseInt(cantidad_equipos_torneo) || 0,
          // Si tu DB no tiene este campo, asegúrate de haber migrado antes
          precio_inscripcion_torneo: parseFloat(precio_inscripcion_torneo) || 0,
          especificaciones_torneo,
          premioUno_torneo,
          premioDos_torneo,
          premioTres_torneo,
          logo_url,
          cantidad_jugadores: {
            connect: { cantidad_jugadores_id: parseInt(cantidad_jugadores_id) }
          },
          categoria_equipo: {
            connect: { categoria_equipo_id: parseInt(categoria_equipo_id) }
          },
          estado_torneo,
          fecha_inicio: new Date(fecha_inicio),
        },
      });

      // 2. Crear la relación en la tabla intermedia usuario_torneo
      await tx.usuario_torneo.create({
        data: {
          usuario_id: Number(usuario_id),
          torneo_id: nuevoTorneo.torneo_id,
        },
      });

      // 3. Registrar la sede si seleccionó una cancha
      if (cancha_id && cancha_id !== "0") {
        await tx.sede_torneo.create({
          data: {
            torneo_id: nuevoTorneo.torneo_id,
            cancha_id: parseInt(cancha_id)
          }
        });
      }

      return nuevoTorneo;
    });

    return NextResponse.json(resultado, { status: 201 });

  } catch (error: any) {
    console.error("ERROR_REGISTRO_TORNEO:", error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un torneo con este nombre' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al registrar: ' + (error.message || 'Error interno') },
      { status: 500 }
    );
  }
}

export async function GET() {
    try {
        const torneosRaw = await prisma.torneo.findMany({
            include: {
                categoria_equipo: true,
                cantidad_jugadores: true,
                sede_torneo: {
                    include: {
                        cancha: true
                    }
                },
                usuario_torneo: true
            },
            orderBy: { fecha_inicio: 'asc' }
        });

        // Aplanamos el JSON para que el frontend reciba nombres limpios
        const torneosPlano = torneosRaw.map(t => ({
            id: t.torneo_id,
            nombre: t.nombre_torneo,
            organizador: t.encargado_torneo,
            telefono: t.telefono_torneo,
            zona: t.provincia_torneo,
            ubicacion: t.ubicacion_torneo,
            cupos_totales: t.cantidad_equipos_torneo,
            // Extraemos solo el string o número de las relaciones
            tipo: t.cantidad_jugadores?.cantidad_jugadores || "N/A",
            categoria: t.categoria_equipo?.categoria_equipo || "Libre",
            precio: t.precio_inscripcion_torneo,
            fecha_inicio: t.fecha_inicio,
            estado: t.estado_torneo,
            logo: t.logo_url,
            premio: t.premioUno_torneo,
            especificaciones: t.especificaciones_torneo,
            sede: t.sede_torneo,
            usuario: t.usuario_torneo?.[0]?.usuario_id || "Desconocido"
        }));

        return NextResponse.json(torneosPlano);
    } catch (error) {
        console.error("GET_TORNEOS_ERROR:", error);
        return NextResponse.json({ error: 'Error al obtener torneos' }, { status: 500 });
    }
}