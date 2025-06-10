const mysql = require('mysql2/promise');

// No need for dotenv in Railway production
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306, // make sure this is here
});

db.getConnection()
  .then(() => console.log('✅ MySQL connected!'))
  .catch(err => console.error('❌ DB connection error:', err));

module.exports = db;
