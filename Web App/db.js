const { Pool } = require('pg');
const pool = new Pool({
  user: 'testuser',
  host: 'localhost',
  database: 'animal_shelter',
  password: 'testpass',
  port: 5432,
});

module.exports = pool;
