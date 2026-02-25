import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { enviarCorreoVerificacion } from '@/lib/mail'; // Crea esta función luego

export async function POST(req: Request) {
  try {
    const { nombre, email, password } = await req.json();

    // 1. Encriptamos la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Guardamos en MySQL con email_verificado en false
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre_usuario: nombre,
        email_usuario: email,
        contrasena_usuario: hashedPassword,
        email_verificado: false, // Por defecto no verificado
      },
    });

    // 3. Generamos un Token de verificación
    // Usa una palabra secreta en tu .env como JWT_SECRET
    const token = jwt.sign(
      { usuarioId: nuevoUsuario.usuario_id },
      process.env.JWT_SECRET || 'clave_secreta_provisional',
      { expiresIn: '24h' }
    );

    // 4. Construimos el enlace de verificación
    const urlVerificacion = `${process.env.NEXT_PUBLIC_URL}/api/auth/verify?token=${token}`;

    // 5. ENVIAR EL CORREO (Llamada a tu servicio de mail)
    await enviarCorreoVerificacion(email, urlVerificacion);
    console.log("Enlace de verificación para pruebas:", urlVerificacion);

    return NextResponse.json({ 
      message: "Revisa tu correo para activar tu cuenta." 
    }, { status: 201 });

  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Este correo ya está en la liga." }, { status: 400 });
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}