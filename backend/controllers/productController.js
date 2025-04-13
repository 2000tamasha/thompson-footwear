//sharan adhiokari 24071844

const db = require('../config/db');

// GET /api/products?category=kids
const getAllProducts = async (req, res) => {
  try {
    const category = req.query.category;

    let query = "SELECT * FROM products";
    let values = [];

    if (category) {
      query += " WHERE category = ?";
      values.push(category);
    }

    const [products] = await db.query(query, values);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const [result] = await db.query("SELECT * FROM products WHERE id = ?", [productId]);

    if (result.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = result[0];
    res.json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
};
