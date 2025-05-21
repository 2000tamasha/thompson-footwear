// server.js – Fully Updated Version by Sharan Adhikari

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

//  Middleware
app.use('/webhook', express.raw({ type: 'application/json' })); // Stripe raw payload
app.use(cors());
app.use(bodyParser.json());

//  Routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes'); // New contact route

//  Prefix all routes with /api
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);

//  Stripe Checkout
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
          unit_amount: item.price,
        },
        quantity: item.quantity,
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

// Stripe Webhook – Save order after payment
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

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

    const query = `
      INSERT INTO orders (user_email, full_name, address, phone, items, total_amount)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
      session.customer_details?.email || 'guest',
      session.customer_details?.name || 'Guest User',
      'Stripe Checkout Address',
      session.customer_details?.phone || 'N/A',
      '[]',
      session.amount_total / 100
    ], (err) => {
      if (err) {
        console.error(' Failed to save Stripe order:', err);
      } else {
        console.log(' Order saved from Stripe webhook');
      }
    });
  }

  res.json({ received: true });
});

//  Default Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

//  Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
