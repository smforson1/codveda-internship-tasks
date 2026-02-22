const pool = require('./db');

async function initDB() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id       SERIAL PRIMARY KEY,
      name     VARCHAR(100) NOT NULL,
      price    NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

    // Index on name column for faster lookups
    await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
  `);

    console.log('Database initialized: products table ready.');
}

module.exports = initDB;
