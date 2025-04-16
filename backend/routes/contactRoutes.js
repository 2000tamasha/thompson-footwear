// routes/contactRoutes.js – By Sharan Adhikari 24071844

const express = require('express');
const router = express.Router();
const db = require('../config/db');

//  Save contact message to database
router.post('/', async (req, res) => {
  const { full_name, email, message } = req.body;

  try {
    await db.query(
      'INSERT INTO contact_messages (full_name, email, message) VALUES (?, ?, ?)',
      [full_name, email, message]
    );
    res.status(201).json({ message: 'Message received successfully' });
  } catch (err) {
    console.error(' Error saving contact message:', err);
    res.status(500).json({ error: 'Failed to save contact message' });
  }
});

//  (Optional) Get all messages for admin
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;
