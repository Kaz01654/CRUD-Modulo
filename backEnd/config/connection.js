require('dotenv').config()
const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PSSWD,
  port: process.env.DB_PORT,
  pool: {
    max: process.env.DB_MAX_CON,
    min: process.env.DB_MIN_CON,
    acquire: process.env.DB_ACQ,
    idle: process.env.DB_IDLE
  }
})

pool.on('error', (err, client) => {
  console.error('Unexpected Error:', err);
  process.exit(-1);
});

module.exports = pool;