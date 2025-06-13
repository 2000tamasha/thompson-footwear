// server.js – Railway Deployment Fixed Version

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// Middleware 
// For Stripe webhook (must come before express.json())
app.use('/webhook', express.raw({ type: 'application/json' }));

// CORS Configuration - Updated for production
const corsOptions = {
  origin: [
    'https://thompson-footwear-production-d96f.up.railway.app',
    'http://localhost:3000', // Keep for local development
    'http://localhost:3001'  // In case fo  different port
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature']
};

app.use(cors(corsOptions));

// Parse JSON bodies for all other routes
app.use(express.json());

// Route Imports
const productRoutes = require('./routes/productRoutes');
const orderRoutes   = require('./routes/orderRoutes');
const userRoutes    = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const reviewRoutes  = require('./routes/reviewRoutes');
const adminRoutes   = require('./routes/adminRoutes');

// API Routes
// Prefix all with /api
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/contact',  contactRoutes);
app.use('/api/reviews',  reviewRoutes);
app.use('/api/admin',    adminRoutes);

// Stripe Checkout Endpoint - Fixed URLs for production
app.post('/create-checkout-session', async (req, res) => {
  const { items } = req.body;
  try {
    // Determine base URLs based on environment
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://thompson-footwear-production-d96f.up.railway.app'
      : 'http://localhost:3000';

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
      success_url: `${baseUrl}/success`,
      cancel_url:  `${baseUrl}/cart`,
    });
    res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe Error:', error.message);
    res.status(500).json({ error: 'Failed to create Stripe session' });
  }
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

// Health Check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Thompson Footwear API is running!',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 404 Handler 
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handler
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? {} : error.message
  });
});

// Start Server - Railway uses dynamic port binding
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // Important for Railway

app.listen(PORT, HOST, () => {
  console.log(`🚀 Thompson Footwear Server running on ${HOST}:${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for production domain`);
});