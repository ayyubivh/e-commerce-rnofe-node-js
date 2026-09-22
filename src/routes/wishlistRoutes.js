const { Router } = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const requireAuth = require("../middleware/auth");
const { addToWishlist } = require("../controllers/wishlistController");

const router = Router();

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Add a product to the logged-in user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Product added to wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product added to wishlist
 *                 wishlist:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   example: [3]
 *       200:
 *         description: Product was already in the wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product already in wishlist
 *                 wishlist:
 *                   type: array
 *                   items:
 *                     type: integer
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  "/",
  requireAuth,
  [body("productId").isInt({ min: 1 }).withMessage("productId must be a positive integer")],
  validate,
  addToWishlist
);

module.exports = router;
