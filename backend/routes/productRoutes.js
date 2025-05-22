// productRoutes.js – Updated

const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);       //  Add product
router.put('/:id', updateProduct);     //  Update
router.delete('/:id', deleteProduct);  // Delete

module.exports = router;
