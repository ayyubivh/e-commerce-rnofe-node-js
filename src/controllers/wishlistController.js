const { getProductById } = require("../models/Product");
const { getWishlist, addToWishlist: addItemToWishlist } = require("../models/Wishlist");
const asyncHandler = require("../utils/asyncHandler");

const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const product = await getProductById(productId);
  if (!product) {
    return res.status(404).json({ error: `Product with id ${productId} not found` });
  }

  const current = await getWishlist(req.user.id);
  if (current.includes(product.id)) {
    return res.status(200).json({ message: "Product already in wishlist", wishlist: current });
  }

  await addItemToWishlist(req.user.id, product.id);
  res.status(201).json({ message: "Product added to wishlist", wishlist: [...current, product.id] });
});

module.exports = { addToWishlist };
