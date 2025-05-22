// productController.js – Updated by Sharan Adhikari 24071844

const db = require('../config/db');

// GET /api/products
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

    res.json(result[0]);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, price, category, description, image_url, stock, size_us, size_uk, size_eu, style_code, long_description, color_variants } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: "Required fields: name, price, category" });
    }

    const query = `
      INSERT INTO products 
      (name, price, category, description, image_url, stock, size_us, size_uk, size_eu, style_code, long_description, color_variants)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [name, price, category, description, image_url, stock, size_us, size_uk, size_eu, style_code, long_description, color_variants];
    await db.query(query, values);

    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price, category, description, image_url, stock, size_us, size_uk, size_eu, style_code, long_description, color_variants } = req.body;

    const query = `
      UPDATE products SET
      name = ?, price = ?, category = ?, description = ?, image_url = ?, stock = ?, 
      size_us = ?, size_uk = ?, size_eu = ?, style_code = ?, long_description = ?, color_variants = ?
      WHERE id = ?
    `;
    const values = [name, price, category, description, image_url, stock, size_us, size_uk, size_eu, style_code, long_description, color_variants, productId];
    await db.query(query, values);

    res.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    await db.query("DELETE FROM products WHERE id = ?", [productId]);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
