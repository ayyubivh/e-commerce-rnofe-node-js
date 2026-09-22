const { getAllProducts, getProductById } = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

const listProducts = asyncHandler(async (req, res) => {
  res.status(200).json({ products: getAllProducts() });
});

const getProduct = asyncHandler(async (req, res) => {
  const product = getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: `Product with id ${req.params.id} not found` });
  }
  res.status(200).json({ product });
});

module.exports = { listProducts, getProduct };
