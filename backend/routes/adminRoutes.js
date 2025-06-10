const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all reviews
router.get('/reviews', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM product_reviews ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// DELETE review by id
router.delete('/reviews/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM product_reviews WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports = router;
