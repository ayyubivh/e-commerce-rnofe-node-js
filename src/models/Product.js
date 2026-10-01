const pool = require("../db/pool");

const COLUMNS = "id, name, description, price, category, stock, image";

// NUMERIC columns come back from pg as strings; the API exposes price as a number.
function toProduct(row) {
  return { ...row, price: Number(row.price) };
}

async function getAllProducts() {
  const { rows } = await pool.query(`SELECT ${COLUMNS} FROM products ORDER BY id`);
  return rows.map(toProduct);
}

async function getProductById(id) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return undefined;
  const { rows } = await pool.query(`SELECT ${COLUMNS} FROM products WHERE id = $1`, [numericId]);
  return rows[0] ? toProduct(rows[0]) : undefined;
}

module.exports = { getAllProducts, getProductById };
