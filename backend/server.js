// server.js – Railway Production Ready by Sharan Adhikari 24071844
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// Middleware 
// For Stripe webhook (must come before express.json())
app.use('/webhook', express.raw({ type: 'application/json' }));

// Enable CORS for frontend and localhost
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));

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
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/contact',  contactRoutes);
app.use('/api/reviews',  reviewRoutes);
app.use('/api/admin',    adminRoutes);

// Stripe Checkout Endpoint
app.post('/create-checkout-session', async (req, res) => {
  const { items } = req.body;
  
  // Determine URLs based on environment
  const frontendUrl = process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000';
  
  console.log('Creating checkout session with frontend URL:', frontendUrl);
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items.map(item => ({
        price_data: {
          currency: 'aud',
          product_data: { 
            name: item.name,
            description: item.description || 'Product from your store'
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${frontendUrl}/cart`,
      customer_email: req.body.email || undefined,
      metadata: {
        order_items: JSON.stringify(items)
      }
    });
    
    console.log('✅ Checkout session created:', session.id);
    res.json({ id: session.id });
  } catch (error) {
    console.error('❌ Stripe Error:', error.message);
    res.status(500).json({ error: 'Failed to create Stripe session' });
  }
});

// Stripe Webhook to Save Orders 
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

app.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log('✅ Webhook verified:', event.type);
  } catch (err) {
    console.error('❌ Webhook verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('💰 Payment completed for session:', session.id);
    
    try {
      // Get session details with line items
      const sessionWithItems = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items']
      });
      
      // Save order to database
      const query = `
        INSERT INTO orders (user_email, full_name, address, phone, items, total_amount, stripe_session_id, order_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const orderData = [
        session.customer_details?.email || 'guest@example.com',
        session.customer_details?.name  || 'Guest User',
        JSON.stringify(session.customer_details?.address) || 'N/A',
        session.customer_details?.phone || 'N/A',
        session.metadata?.order_items || '[]',
        session.amount_total / 100, // Convert from cents
        session.id,
        'completed'
      ];
      
      db.query(query, orderData, (err, result) => {
        if (err) {
          console.error('❌ Failed to save order:', err);
        } else {
          console.log('✅ Order saved successfully with ID:', result.insertId);
        }
      });
      
    } catch (error) {
      console.error('❌ Error processing webhook:', error);
    }
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
});

// Health Check
app.get('/', (req, res) => {
  res.json({ 
    message: 'API is running! 🚀', 
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    stripe_configured: !!process.env.STRIPE_SECRET_KEY,
    database_configured: !!process.env.DB_HOST
  });
});

// Test database connection endpoint
app.get('/test-db', (req, res) => {
  db.query('SELECT 1 as test', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database connection failed', details: err.message });
    } else {
      res.json({ message: 'Database connected successfully', results });
    }
  });
});

// 404 Handler 
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start Server 
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 Stripe configured: ${!!process.env.STRIPE_SECRET_KEY}`);
  console.log(`💾 Database configured: ${!!process.env.DB_HOST}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
  }
});