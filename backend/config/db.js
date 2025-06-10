const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306, // parses string to number
});

db.getConnection()
  .then(() => {
    console.log('✅ MySQL connected!');
  })
  .catch(err => {
    console.error('❌ DB connection error:', err);
  });

module.exports = db;
