import nodemailer from 'nodemailer';

export const enviarCorreoVerificacion = async (email: string, url: string) => {
  // 1. Configuramos el transportador con variables de entorno
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, 
    port: parseInt(process.env.EMAIL_PORT || '465'),
    secure: true, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Definimos las opciones del mensaje
  const mailOptions = {
    from: `"Liga Pro" <${process.env.EMAIL_USER}>`,
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
  };

  // 3. Enviamos el correo
  return await transporter.sendMail(mailOptions);
};