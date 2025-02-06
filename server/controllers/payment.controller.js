import { Op } from "sequelize";
import { createPaymentIntent } from "../services/stripeService.js";
import Payment from "../models/payment.js";
import UserService from "../services/user.service.js";
import Transaction from "../models/Transaction.js";
import { sendEmail } from "../services/mailService.js";

const DUPLICATE_CHECK_MINUTES = process.env.DUPLICATE_CHECK_MINUTES
  ? parseInt(process.env.DUPLICATE_CHECK_MINUTES)
  : 1;

export const processPayment = async (req, res) => {
  const { userId, amount, stripeToken, tokens } = req.body;

  try {
    console.log("Validando usuario...");

    const user = await UserService.getUserInfo(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    console.log("Verificando duplicidad de transacción...");

    const duplicateCheckInterval = new Date(Date.now() - DUPLICATE_CHECK_MINUTES * 60 * 1000);

    const recentTransaction = await Transaction.findOne({
      where: {
        user_id: userId,
        payment_method: stripeToken,
        createdAt: {
          [Op.gte]: duplicateCheckInterval,
        },
      },
    });

    if (recentTransaction) {
      return res.status(400).json({
        success: false,
        message: "Ya existe una transacción reciente con el mismo método de pago.",
      });
    }

    console.log("Procesando pago con Stripe...");

    const paymentResult = await createPaymentIntent(amount, stripeToken);

    const savedPayment = await Payment.create({
      id: paymentResult.id,
      amount: paymentResult.amount,
      currency: paymentResult.currency,
      status: paymentResult.status,
      paymentMethod: paymentResult.payment_method,
    });

    console.log("Pago guardado en la base de datos:", savedPayment);

    const transaction = await Transaction.create({
      user_id: userId,
      amount: amount,
      tokens_added: tokens,
      payment_method: stripeToken,
      transaction_date: new Date(),
      payment_id: paymentResult.id
    });

    console.log("Transacción guardada en la base de datos:", transaction);

    await user.increment("tokens", { by: tokens });

    console.log(`Tokens actualizados para el usuario ${userId}: ${tokens} tokens añadidos.`);

    const emailSubject = "Confirmación de tu compra de tokens";
    const emailBody = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #ff9900;">Confirmación de Compra</h2>
        <p>Hola <strong>${user.email}</strong>,</p>
        <p>
          Tu compra de <strong>${tokens} tokens</strong> por un monto de 
          <strong>$${parseFloat(amount).toFixed(2)}</strong> ha sido procesada con éxito.
        </p>
        <h3>Detalles del Pago</h3>
        <ul>
          <li><strong>ID de Transacción:</strong> ${transaction.id}</li>
          <li><strong>Método de Pago:</strong> ${transaction.payment_method}</li>
          <li><strong>Fecha:</strong> ${new Date(transaction.transaction_date).toLocaleString()}</li>
        </ul>
        <p>Gracias por tu compra. Si tienes alguna duda, no dudes en contactarnos.</p>
        <p>Atentamente,</p>
        <p><strong>Equipo de LYONSVIP</strong></p>
      </div>
    `;

    await sendEmail(user.email, emailSubject, emailBody);

    console.log(`Correo de confirmación enviado a ${user.email}`);

    res.status(200).json({
      success: true,
      message: "Pago procesado exitosamente, guardado y correo enviado.",
      paymentResult,
    });
  } catch (error) {
    console.error("Error procesando el pago:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
