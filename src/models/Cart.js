const pool = require("../db/pool");

async function getCart(userId) {
  const { rows } = await pool.query(
    `SELECT product_id AS "productId", quantity FROM cart_items WHERE user_id = $1 ORDER BY id`,
    [userId]
  );
  return rows;
}

// Adds a new line item, or increments the quantity if the product is already in the cart.
async function addToCart(userId, productId, quantity) {
  await pool.query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, product_id)
     DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
    [userId, productId, quantity]
  );
}

module.exports = { getCart, addToCart };
