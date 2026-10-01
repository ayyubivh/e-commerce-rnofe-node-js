const pool = require("../db/pool");
const { getCart } = require("./Cart");
const { getWishlist } = require("./Wishlist");

const UNIQUE_VIOLATION = "23505";

function toUser(row) {
  return row && { id: row.id, email: row.email, passwordHash: row.password_hash };
}

async function findByEmail(email) {
  const { rows } = await pool.query(
    "SELECT id, email, password_hash FROM users WHERE LOWER(email) = LOWER($1)",
    [email]
  );
  return toUser(rows[0]);
}

async function findById(id) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return undefined;
  const { rows } = await pool.query("SELECT id, email, password_hash FROM users WHERE id = $1", [numericId]);
  return toUser(rows[0]);
}

// Returns the new user, or null if the email is already registered. The UNIQUE constraint on
// users.email makes this safe even when two requests register the same email at once.
async function createUser({ email, passwordHash }) {
  try {
    const { rows } = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, password_hash",
      [email, passwordHash]
    );
    return toUser(rows[0]);
  } catch (err) {
    if (err.code === UNIQUE_VIOLATION) return null;
    throw err;
  }
}

// The user as returned by the API: no password hash, plus their cart and wishlist.
async function toPublicUser(user) {
  const [cart, wishlist] = await Promise.all([getCart(user.id), getWishlist(user.id)]);
  return { id: user.id, email: user.email, cart, wishlist };
}

module.exports = {
  findByEmail,
  findById,
  createUser,
  toPublicUser,
};
