//sharan adhikari 24071844
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /products - optional filters
router.get('/', (req, res) => {
  const { size, age_group, category } = req.query;

  let sql = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (size) {
    sql += ' AND size = ?';
    params.push(size);
  }

  if (age_group) {
    sql += ' AND age_group = ?';
    params.push(age_group);
  }

  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

module.exports = router;
