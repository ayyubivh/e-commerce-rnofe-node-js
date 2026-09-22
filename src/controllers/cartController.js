const { getProductById } = require("../models/Product");
const { findById } = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = getProductById(productId);
  if (!product) {
    return res.status(404).json({ error: `Product with id ${productId} not found` });
  }

  const user = findById(req.user.id);
  const existingItem = user.cart.find((item) => item.productId === product.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    user.cart.push({ productId: product.id, quantity });
  }

  res.status(201).json({ message: "Product added to cart", cart: user.cart });
});

module.exports = { addToCart };
