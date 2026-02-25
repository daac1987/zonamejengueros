import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        // 1. Buscamos al usuario e INCLUIMOS sus relaciones
        const usuario = await prisma.usuario.findFirst({
            where: { email_usuario: email },
            include: {
                usuario_equipo: true,
                usuario_cancha: true,
                usuario_torneo: true,
            },
        });

        if (!usuario || !usuario.contrasena_usuario) {
            return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
        }

        // 2. Comparamos contraseña
        const passwordValida = await bcrypt.compare(password, usuario.contrasena_usuario);

        if (!passwordValida) {
            return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
        }

        // --- PASO 2.5: VALIDACIÓN DE EMAIL ---
        if (!usuario.email_verificado) {
            return NextResponse.json({
                error: "CUENTA PENDIENTE: Por favor confirma tu correo electrónico."
            }, { status: 403 });
        }

        // --- NUEVO: REGISTRO DE ÚLTIMA SESIÓN ---
        // Actualizamos el campo en la base de datos antes de enviar la respuesta exitosa
        // 1. Creamos la fecha actual del servidor
        const fechaServidor = new Date();

        // 2. Restamos 6 horas (en milisegundos: 6 * 60 * 60 * 1000)
        // Esto ajusta UTC a la hora de Costa Rica
        const horaCostaRica = new Date(fechaServidor.getTime() - (6 * 60 * 60 * 1000));
        await prisma.usuario.update({
            where: { usuario_id: usuario.usuario_id },
            data: {
                ultima_sesion: horaCostaRica // Esto genera el timestamp actual ajustado a Costa Rica
            }
        });

        // 3. Determinamos el tipo de perfil
        let tipoPerfil = null;
        if (usuario.usuario_cancha.length > 0) {
            tipoPerfil = 'CANCHA';
        } else if (usuario.usuario_equipo.length > 0) {
            tipoPerfil = 'EQUIPO';
        } else if (usuario.usuario_torneo.length > 0) {
            tipoPerfil = 'TORNEO';
        }

        const tienePerfil = tipoPerfil !== null;

        // 4. Respondemos al Frontend
        return NextResponse.json({
            usuario: {
                usuario_id: usuario.usuario_id,
                nombre_usuario: usuario.nombre_usuario,
                tienePerfil: tienePerfil,
                tipoPerfil: tipoPerfil
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}