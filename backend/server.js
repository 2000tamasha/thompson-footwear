// server.js – Final Working Version by Sharan Adhikari 24071844

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

//  Middleware 
// For Stripe webhook (must come before express.json())
app.use('/webhook', express.raw({ type: 'application/json' }));

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies for all other routes
app.use(express.json());

//  Route Imports
const productRoutes = require('./routes/productRoutes');
const orderRoutes   = require('./routes/orderRoutes');
const userRoutes    = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const reviewRoutes  = require('./routes/reviewRoutes');
const adminRoutes   = require('./routes/adminRoutes');

//  API Routes
// Prefix all with /api
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/contact',  contactRoutes);
app.use('/api/reviews',  reviewRoutes);
app.use('/api/admin',    adminRoutes);

// Stripe Checkout Endpoint
app.post('/create-checkout-session', async (req, res) => {
  const { items } = req.body;
  
  // Determine the base URL based on environment
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || `https://${req.get('host')}`
    : 'http://localhost:3000';
  
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
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${baseUrl}/cart`,
    });
    res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe Error:', error.message);
    res.status(500).json({ error: 'Failed to create Stripe session' });
  }
});

// Success route to handle Stripe redirects
app.get('/success', (req, res) => {
  const sessionId = req.query.session_id;
 
  res.send(`
    <html>
      <head><title>Payment Successful</title></head>
      <body>
        <h1>Payment Successful!</h1>
        <p>Your order has been submitted successfully.</p>
        <p>Session ID: ${sessionId}</p>
        <script>
          // Redirect to your frontend after 3 seconds
          setTimeout(() => {
            window.location.href = '${process.env.FRONTEND_URL || 'http://localhost:3000'}/order-confirmation';
          }, 3000);
        </script>
      </body>
    </html>
  `);
});

// Stripe Webhook to Save Orders 
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
      session.customer_details?.name  || 'Guest User',
      'Stripe Checkout Address',
      session.customer_details?.phone || 'N/A',
      '[]',
      session.amount_total / 100
    ], (err) => {
      if (err) console.error('Failed to save Stripe order:', err);
      else    console.log('Order saved from Stripe webhook');
    });
  }

  res.json({ received: true });
});

//  Health Check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 404 Handler 
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

//  Start Server 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});