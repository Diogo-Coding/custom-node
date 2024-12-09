const nodemailer = require("nodemailer");

async function sendEmail({ to, cc, bcc, subject, text, html }) {
  // Opciones del correo
  const mailOptions = {
    from: "address@example.com", // Cambia esto por tu correo desde el cual se envía el correo
    cc,
    bcc,
    to,
    subject,
    text,
    html,
  };

  try {
    // Configuración del transporte SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST, // Cambia esto por tu servidor SMTP
      port: process.env.MAIL_PORT, // O usa 465 si el servidor requiere SSL
      secure: false, // Cambia a true para el puerto 465
      auth: {
        user: process.env.MAIL_USERNAME, // Cambia esto por tu correo
        pass: process.env.MAIL_PASSWORD, // Cambia esto por tu contraseña
      },
      tls: true,
    });

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);

    // Guardar log en base de datos

    return info;
  } catch (error) {
    
    // Guardar error en base de datos

    throw error;
  }
}

module.exports = sendEmail;
