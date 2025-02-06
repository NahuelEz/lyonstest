import Stripe from "stripe";

const stripe = new Stripe("sk_test_51QXlhbCxTyABNLz7uIQeI7DKeoJW9o8d9VG6tbecFce97JQsgpt4qfD1s8Ml44SMtC8S4VVqAsdKrADfwhy9Ap5Z00PthyM2Dq");

async function createPaymentIntent() {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5000,
      currency: "usd",
      payment_method: "pm_card_visa",
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    console.log("Intento de pago creado:", paymentIntent);
  } catch (error) {
    console.error("Error en intento de pago:", error.message);
  }
}

createPaymentIntent();
