import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) return NextResponse.json({ error: "Token faltante" }, { status: 400 });

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_provisional') as { usuarioId: number };

    // Actualizar usuario en la base de datos
    await prisma.usuario.update({
      where: { usuario_id: decoded.usuarioId },
      data: { email_verificado: true },
    });

    // Redirigir al usuario al login con un mensaje de éxito
    return NextResponse.redirect(new URL('/auth?verified=true', req.url));
    
  } catch (error) {
    return NextResponse.json({ error: "El enlace ha expirado o es inválido" }, { status: 400 });
  }
}