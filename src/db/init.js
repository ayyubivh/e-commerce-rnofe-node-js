const pool = require("./pool");
const products = require("../data/products");

// Creates the tables on first run and seeds the product catalog. Safe to run on every startup.
async function initDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env and point it at a PostgreSQL database.");
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at    TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id          INTEGER PRIMARY KEY,
      name        TEXT NOT NULL,
      description TEXT NOT NULL,
      price       NUMERIC(10, 2) NOT NULL,
      category    TEXT NOT NULL,
      stock       INTEGER NOT NULL,
      image       TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      quantity   INTEGER NOT NULL CHECK (quantity > 0),
      UNIQUE (user_id, product_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS wishlist_items (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      UNIQUE (user_id, product_id)
    )
  `);

  for (const p of products) {
    await pool.query(
      `INSERT INTO products (id, name, description, price, category, stock, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO NOTHING`,
      [p.id, p.name, p.description, p.price, p.category, p.stock, p.image]
    );
  }
}

module.exports = initDb;
