const { getProductById } = require("../models/Product");
const { findById } = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const product = getProductById(productId);
  if (!product) {
    return res.status(404).json({ error: `Product with id ${productId} not found` });
  }

  const user = findById(req.user.id);

  if (user.wishlist.includes(product.id)) {
    return res.status(200).json({ message: "Product already in wishlist", wishlist: user.wishlist });
  }

  user.wishlist.push(product.id);
  res.status(201).json({ message: "Product added to wishlist", wishlist: user.wishlist });
});

module.exports = { addToWishlist };
