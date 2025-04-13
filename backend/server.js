// server.js – Final Stripe Integrated Version by Sharan Adhikari

require('dotenv').config(); // Load .env variables

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Stripe Secret Key from .env

const app = express();

//  Middleware setup
app.use('/webhook', express.raw({ type: 'application/json' })); // Required for Stripe webhook
app.use(cors());
app.use(bodyParser.json());

//  Product Routes
const productRoutes = require('./routes/productRoutes');
app.use('/products', productRoutes);

//  Stripe Checkout Endpoint
app.post('/create-checkout-session', async (req, res) => {
  const { items } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items.map(item => ({
        price_data: {
          currency: 'aud',
          product_data: { name: item.name },
          unit_amount: item.price, // in cents
        },
        quantity: item.quantity
      })),
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cart',
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe Error:', error.message);
    res.status(500).json({ error: 'Failed to create Stripe session' });
  }
});

//  Stripe Webhook to receive order confirmation
const endpointSecret = 'whsec_123456789123456789123456';

app.post('/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    //  Save order logic here 
    console.log(' Payment confirmed. Session:', {
      email: session.customer_details?.email,
      amount_total: session.amount_total,
      session_id: session.id,
    });
  }

  res.json({ received: true });
});

//  Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

//  Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
