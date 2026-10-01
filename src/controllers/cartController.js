const { getProductById } = require("../models/Product");
const { getCart, addToCart: addItemToCart } = require("../models/Cart");
const asyncHandler = require("../utils/asyncHandler");

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await getProductById(productId);
  if (!product) {
    return res.status(404).json({ error: `Product with id ${productId} not found` });
  }

  await addItemToCart(req.user.id, product.id, quantity);
  const cart = await getCart(req.user.id);

  res.status(201).json({ message: "Product added to cart", cart });
});

module.exports = { addToCart };
