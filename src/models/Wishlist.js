const pool = require("../db/pool");

async function getWishlist(userId) {
  const { rows } = await pool.query(
    `SELECT product_id FROM wishlist_items WHERE user_id = $1 ORDER BY id`,
    [userId]
  );
  return rows.map((r) => r.product_id);
}

// Safe to call twice: the UNIQUE constraint plus ON CONFLICT means a duplicate is silently ignored.
async function addToWishlist(userId, productId) {
  await pool.query(
    `INSERT INTO wishlist_items (user_id, product_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, product_id) DO NOTHING`,
    [userId, productId]
  );
}

module.exports = { getWishlist, addToWishlist };
