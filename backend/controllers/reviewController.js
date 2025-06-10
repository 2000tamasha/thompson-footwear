const db = require('../config/db');

// Add a new review
exports.addReview = async (req, res) => {
  const { productId } = req.params;
  const { user_email, rating, review_text } = req.body;

  if (!user_email || !rating) {
    return res.status(400).json({ message: 'User email and rating are required.' });
  }

  try {
    await db.query(
      'INSERT INTO product_reviews (product_id, user_email, rating, review_text) VALUES (?, ?, ?, ?)',
      [productId, user_email, rating, review_text]
    );
    res.status(201).json({ message: 'Review added successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Database error.', error: err });
  }
};

// Get all reviews for a product
exports.getReviews = async (req, res) => {
  const { productId } = req.params;
  try {
    const [reviews] = await db.query(
      'SELECT * FROM product_reviews WHERE product_id = ? ORDER BY created_at DESC',
      [productId]
    );
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Database error.', error: err });
  }
};

// Get average rating for a product
exports.getAverageRating = async (req, res) => {
  const { productId } = req.params;
  try {
    const [result] = await db.query(
      'SELECT AVG(rating) as average FROM product_reviews WHERE product_id = ?',
      [productId]
    );
    res.json({ average: result[0].average });
  } catch (err) {
    res.status(500).json({ message: 'Database error.', error: err });
  }
};
