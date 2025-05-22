const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'admin',
  password: 'admin',
  port: 3306,
  database: 'tablero',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "America/Santiago",
});

module.exports = pool.promise();