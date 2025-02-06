import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: process.env.SMTP_PORT == 465, // Usar SSL/TLS si el puerto es 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  debug: true,
  logger: true,
});

export const sendEmail = async (to, subject, tokensAdded, amount) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="text-align: center; color: #4CAF50;">LYONSVIP - Confirmación de Pago</h2>
      <p>¡Hola!</p>
      <p>Te confirmamos que tu transacción ha sido procesada con éxito. A continuación, los detalles:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">Cantidad de Tokens:</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${tokensAdded}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">Monto Total:</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${parseFloat(amount).toFixed(2)}</td>
        </tr>
      </table>
      <p style="text-align: center; font-size: 14px; color: #666;">
        <em>Si tienes alguna consulta o necesitas soporte, por favor contáctanos a través de nuestra plataforma.</em>
      </p>
      <p style="text-align: center; color: #999; font-size: 12px;">
        © 2024 LYONSVIP ENTERPRISE LTD. Todos los derechos reservados.
      </p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"LYONSVIP" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: htmlContent,
    });

    console.log(`Correo enviado exitosamente a ${to}`);
    console.log("Detalles del mensaje enviado:", info.messageId);
  } catch (error) {
    console.error("Error enviando correo:", error.message);
  }
};
