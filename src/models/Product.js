const products = require("../data/products");

function getAllProducts() {
  return products;
}

function getProductById(id) {
  return products.find((p) => p.id === Number(id));
}

module.exports = { getAllProducts, getProductById };
