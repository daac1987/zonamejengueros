import { Resend } from 'resend';

// Inicializamos Resend con la variable de entorno
const resend = new Resend(process.env.RESEND_API_KEY);

export const enviarCorreoVerificacion = async (email: string, url: string) => {
  try {
    const { data, error } = await resend.emails.send({
      /* IMPORTANTE: Si no has configurado un dominio propio en Resend, 
         DEBES usar 'onboarding@resend.dev' como remitente y solo 
         podrás enviar correos a la dirección con la que te registraste.
      */
      from: 'Liga Pro <verificacion@zonamejengueros.com>',
      to: email,
      subject: '⚽ Activa tu cuenta de Capitán',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 15px;">
          <h2 style="color: #333;">¡Bienvenido a la Liga!</h2>
          <p>Haz clic en el botón de abajo para verificar tu cuenta y poder iniciar sesión:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" style="background-color: #facf00; color: black; padding: 15px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
              VERIFICAR MI CORREO
            </a>
          </div>
          <p style="font-size: 12px; color: #888;">Si el botón no funciona, copia este link: ${url}</p>
        </div>
      `,
    });

    if (error) {
      console.error("Error detallado de Resend:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Excepción al enviar correo:", error);
    return { success: false, error };
  }
};