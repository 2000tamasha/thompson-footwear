const express = require('express');
const router = express.Router();
const db = require('../config/db');

// SIGNUP – Create new user
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existing.length > 0) {
      return res.status(400).json({ message: 'User already exists. Please login.' });
    }

    // Create new user, is_admin defaults to 0
    await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );

    res.status(201).json({ message: 'User registered successfully', user: { name, email, is_admin: 0 } });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// LOGIN – Check user credentials
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (users.length > 0) {
      const user = users[0];
      return res.status(200).json({
        message: 'Login successful',
        user: {
          name: user.name,
          email: user.email,
          is_admin: user.is_admin //  Send is_admin to frontend
        }
      });
    } else {
      return res.status(401).json({ message: 'User not found. Please sign up.' });
    }
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
