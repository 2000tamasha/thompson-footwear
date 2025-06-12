const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  // Railway MySQL connection settings
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  // SSL configuration for Railway
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection with better error handling
db.getConnection()
  .then((connection) => {
    console.log('✅ MySQL connected successfully!');
    console.log('📊 Connection details:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
    connection.release(); // Release the connection back to pool
  })
  .catch(err => {
    console.error('❌ DB connection error:', err);
    console.error('🔍 Connection attempted with:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      hasPassword: !!process.env.DB_PASSWORD
    });
  });

module.exports = db;