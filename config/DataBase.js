const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'book',
  password: process.env.DB_PASSWORD,
  port: 5432,
});

module.exports = pool;



