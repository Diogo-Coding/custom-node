const sql = require('mysql2/promise')

const auth_pool = sql.createPool({
  host: process.env.AUTH_DB_HOST,
  user: process.env.AUTH_DB_USER,
  password: process.env.AUTH_DB_PASS,
  database: process.env.AUTH_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

module.exports = {
  auth_pool
};

