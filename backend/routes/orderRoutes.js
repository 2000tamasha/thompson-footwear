// routes/orderRoutes.js – Created by Sharan Adhikari

const express = require('express');
const router = express.Router();
const db = require('../config/db');

//  Save a new order (called after checkout)
router.post('/', async (req, res) => {
  const { user_email, full_name, address, phone, items, total_amount } = req.body;

  const query = `
    INSERT INTO orders (user_email, full_name, address, phone, items, total_amount)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    await db.query(query, [
      user_email,
      full_name,
      address,
      phone,
      JSON.stringify(items), // Save array as string
      total_amount
    ]);

    res.status(201).json({ message: 'Order saved successfully' });
  } catch (err) {
    console.error(' Order save failed:', err);
    res.status(500).json({ error: 'Could not save order' });
  }
});

//  Fetch all orders (for admin panel)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(' Fetch orders failed:', err);
    res.status(500).json({ error: 'Could not retrieve orders' });
  }
});

module.exports = router;
