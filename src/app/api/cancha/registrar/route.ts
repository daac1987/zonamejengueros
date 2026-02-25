import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client'; // Importamos Prisma para acceder a los tipos

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { 
      usuario_id,
      nombre_cancha,
      telefono_cancha,
      provincia_cancha,
      ubicacion_cancha,
      encargado_cancha,
      horario_cancha,
      grama_cancha,
      cantidad_jugadores_id,
      precio_cancha,
      servicios_cancha,
      sede_url,
      foto_sede_uno_url,
      foto_sede_dos_url
    } = data;

    // Tipamos explícitamente el parámetro 'tx' como Prisma.TransactionClient
    const resultado = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      
      // 1. Crear la cancha
      const nuevaCancha = await tx.cancha.create({
        data: {
          nombre_cancha,
          telefono_cancha,
          provincia_cancha,
          ubicacion_cancha,
          encargado_cancha,
          horario_cancha,
          grama_cancha,
          cantidad_jugadores_id : Number(cantidad_jugadores_id),
          precio_cancha: Number(precio_cancha),
          servicios_cancha,
          sede_url,
          foto_sede_uno_url,
          foto_sede_dos_url,
        },
      });

      // 2. Crear la relación en usuario_cancha
      await tx.usuario_cancha.create({
        data: {
          usuario_id: Number(usuario_id),
          cancha_id: nuevaCancha.cancha_id,
        },
      });

      return nuevaCancha;
    });

    return NextResponse.json({ 
      message: "Sede registrada con éxito", 
      cancha: resultado 
    }, { status: 201 });

  } catch (error) {
    console.error("Error registrando cancha:", error);
    return NextResponse.json({ error: "No se pudo registrar la sede" }, { status: 500 });
  }
}