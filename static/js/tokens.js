const stripe = Stripe('pk_test_51QXlhbCxTyABNLz7k8MYbDMSrZlCZJSgSLtIDMbAclSNHYAzGeI1NBNkcR4eP2fFs34X2FhUGGDP1BUbsgoounWN00N5Qr9rkS');
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

const TOKEN_PRICE = 0.5; 
let totalAmount = 0;
let tokensToBuy = 0;

// Actualizar el monto al seleccionar opciones fijas
document.querySelectorAll('.fixed-option').forEach(button => {
  button.addEventListener('click', () => {
    tokensToBuy = parseInt(button.dataset.tokens);
    totalAmount = parseFloat(button.dataset.amount);
    document.getElementById('custom-tokens').value = '';
    document.getElementById('custom-amount').innerText = `Total: $${totalAmount}`;
  });
});

// Calcular el monto para la cantidad personalizada
document.getElementById('custom-tokens').addEventListener('input', (e) => {
  tokensToBuy = parseInt(e.target.value) || 0;
  totalAmount = tokensToBuy * TOKEN_PRICE;
  document.getElementById('custom-amount').innerText = `Total: $${totalAmount.toFixed(2)}`;
});

// Procesar el pago
document.getElementById('pay-button').addEventListener('click', async () => {
  if (tokensToBuy === 0 || totalAmount === 0) {
    alert('Por favor selecciona una cantidad válida de tokens.');
    return;
  }

  const { token, error } = await stripe.createToken(cardElement);
  if (error) {
    alert('Error en la tarjeta: ' + error.message);
    return;
  }

  const response = await fetch('/api/payment/pay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 1,
      tokens: tokensToBuy,
      amount: totalAmount,
      stripeToken: token.id
    })
  });

  const result = await response.json();
  if (result.success) {
    alert(`Pago exitoso. Has comprado ${tokensToBuy} tokens.`);
  } else {
    alert('Error al procesar el pago: ' + result.message);
  }
});
