import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '2');

        const canchas = await prisma.cancha.findMany({
            take: limit,
            orderBy: { cancha_id: 'desc' }, // O por fecha si tienes ese campo
        });
        return NextResponse.json(canchas);
    } catch (error) {
        return NextResponse.json({ error: "Error al cargar canchas" }, { status: 500 });
    }
}