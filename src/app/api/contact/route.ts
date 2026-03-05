import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { nombre, email, asunto, mensaje } = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'Web Zona Mejengueros <verificacion@zonamejengueros.com>', // Tu dominio verificado
      to: 'davic1987@gmail.com', // A donde quieres que llegue el mensaje
      subject: `📩 NUEVO CONTACTO: ${asunto}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #facf00;">Nuevo mensaje desde la Web</h2>
          <p><strong>De:</strong> ${nombre} (${email})</p>
          <p><strong>Asunto:</strong> ${asunto}</p>
          <hr />
          <p><strong>Mensaje:</strong></p>
          <p style="white-space: pre-wrap;">${mensaje}</p>
        </div>
      `,
    });

    if (error) return NextResponse.json({ error }, { status: 400 });

    return NextResponse.json({ message: "Correo enviado" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}