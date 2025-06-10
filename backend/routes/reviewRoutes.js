const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/:productId', reviewController.addReview);
router.get('/:productId', reviewController.getReviews);
router.get('/:productId/average', reviewController.getAverageRating);

module.exports = router;
