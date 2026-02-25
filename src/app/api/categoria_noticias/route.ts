import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categorias = await prisma.categoria_noticia.findMany({
      orderBy: {
        categoria_noticia: 'asc', // Opcional: ordenarlos alfabéticamente
      },
    });

    return NextResponse.json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return NextResponse.json(
      { error: 'Error al cargar las categorías' },
      { status: 500 }
    );
  }
}