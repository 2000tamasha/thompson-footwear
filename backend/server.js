// sharan adhikari 24071844
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const productRoutes = require('./routes/productRoutes');
app.use('/products', productRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send(' API is running...');
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
