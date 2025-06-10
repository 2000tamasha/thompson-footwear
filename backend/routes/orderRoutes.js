const express = require('express');
const router = express.Router();
const db = require('../config/db');

const validateOrderData = (req, res, next) => {
  const { user_email, full_name, address, phone, items, total_amount } = req.body;
  
  if (!user_email || !full_name || !address || !phone || !items || !total_amount) {
    return res.status(400).json({ 
      error: 'Missing required fields: user_email, full_name, address, phone, items, total_amount' 
    });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user_email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Items must be a non-empty array' });
  }
  
  if (typeof total_amount !== 'number' || total_amount <= 0) {
    return res.status(400).json({ error: 'Total amount must be a positive number' });
  }
  
  if (phone.length < 10) {
    return res.status(400).json({ error: 'Phone number must be at least 10 digits' });
  }
  
  next();
};

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

const requireAdmin = (req, res, next) => {
  next();
};

router.post('/', validateOrderData, async (req, res) => {
  const { user_email, full_name, address, phone, items, total_amount } = req.body;

  const query = `
    INSERT INTO orders (user_email, full_name, address, phone, items, total_amount, created_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;

  try {
    const validatedItems = items.map(item => {
      if (!item.name || !item.price || !item.quantity) {
        throw new Error('Each item must have name, price, and quantity');
      }
      return {
        name: item.name.trim(),
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity),
        ...(item.id && { id: item.id })
      };
    });

    const calculatedTotal = validatedItems.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
    
    if (Math.abs(calculatedTotal - total_amount) > 0.01) {
      return res.status(400).json({ 
        error: 'Total amount mismatch. Calculated: ' + calculatedTotal.toFixed(2) 
      });
    }

    const [result] = await db.query(query, [
      user_email.trim().toLowerCase(),
      full_name.trim(),
      address.trim(),
      phone.trim(),
      JSON.stringify(validatedItems),
      total_amount
    ]);

    res.status(201).json({ 
      message: 'Order saved successfully',
      orderId: result.insertId 
    });
  } catch (err) {
    console.error('Order save failed:', err.message);
    
    if (err.message.includes('item must have')) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Could not save order' });
    }
  }
});

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Fetch orders failed:', err);
    res.status(500).json({ error: 'Could not retrieve orders' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  const orderId = parseInt(req.params.id);
  
  if (!orderId || orderId <= 0) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }
  
  try {
    const [rows] = await db.query(
      'SELECT * FROM orders WHERE id = ?', 
      [orderId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = {
      ...rows[0],
      items: JSON.parse(rows[0].items)
    };
    
    res.json(order);
  } catch (err) {
    console.error('Fetch order failed:', err);
    res.status(500).json({ error: 'Could not retrieve order' });
  }
});

router.patch('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const orderId = parseInt(req.params.id);
  const { status } = req.body;
  
  if (!orderId || orderId <= 0) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }
  
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: 'Status must be one of: ' + validStatuses.join(', ') 
    });
  }
  
  try {
    const [result] = await db.query(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, orderId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ message: 'Order status updated successfully' });
  } catch (err) {
    console.error('Update order status failed:', err);
    res.status(500).json({ error: 'Could not update order status' });
  }
});

// Test route to check if new routes are working
router.get('/test', (req, res) => {
  res.json({ message: 'Test route is working' });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await db.query('DELETE FROM orders WHERE id = ?', [id]);
    
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

module.exports = router;