const { Pool } = require("pg");

// Connection settings come from the environment (see .env.example).
// Hosted databases that are reached over the public internet usually require SSL: set DATABASE_SSL=true.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error", err);
});

module.exports = pool;
