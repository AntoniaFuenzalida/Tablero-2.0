const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'mysql',
  user: 'admin',
  password: 'admin',
  port: 3306,
  database: 'tablero',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '-03:00', // UTC-3 para Chile (equivalente a America/Santiago)
});

module.exports = pool.promise();