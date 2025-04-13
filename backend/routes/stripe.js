const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_123456789123456789123456')

router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: req.body.items.map(item => ({
      price_data: {
        currency: 'aud',
        product_data: {
          name: item.name
        },
        unit_amount: item.price, // in cents
      },
      quantity: item.quantity
    })),
    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/cart',
  });

  res.json({ id: session.id });
});

module.exports = router;
