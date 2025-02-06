import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
console.log("Clave secreta cargada:", stripeSecretKey);
const stripe = new Stripe(stripeSecretKey);

export const createPaymentIntent = async (amount, stripeToken) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convertir a centavos
        currency: "usd",
        payment_method: stripeToken,
        confirm: true,
        automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never',
        },
    });
    

    console.log("Pago procesado exitosamente:", paymentIntent);
    return paymentIntent;
  } catch (error) {
    console.error("Error al procesar el pago con Stripe:", error.message);
    throw new Error(error.message);
  }
};
