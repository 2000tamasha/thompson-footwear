const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Add new user or login existing
router.post('/login', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existing.length > 0) {
      // Just log in
      return res.status(200).json({ message: 'Login successful', user: existing[0] });
    }

    // Register new user
    await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
    res.status(201).json({ message: 'User registered and logged in', user: { name, email } });
  } catch (err) {
    console.error('User login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
