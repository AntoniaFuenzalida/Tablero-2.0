const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '35.184.184.109',
  user: 'admin',
  password: 'Tableroutalca7',
  port: 3306,
  database: 'tablero',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "America/Santiago",
});

module.exports = pool.promise();