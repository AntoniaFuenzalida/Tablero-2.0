const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'tablero',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '-03:00', // UTC-3 para Chile (equivalente a America/Santiago)
});

module.exports = pool.promise();