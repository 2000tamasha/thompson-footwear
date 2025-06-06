// sharan adhikari 24071844
const mysql = require('mysql2/promise'); //  Use promise wrapper
require('dotenv').config();

//  Create a connection pool that supports async/await
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.getConnection()
  .then(() => {
    console.log('MySQL connected!');
  })
  .catch((err) => {
    console.error('Database connection failed:', err.stack);
  });

module.exports = db;
