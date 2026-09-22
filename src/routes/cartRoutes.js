const { Router } = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const requireAuth = require("../middleware/auth");
const { addToCart } = require("../controllers/cartController");

const router = Router();

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add a product to the logged-in user's cart
 *     tags: [Cart]
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
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 default: 1
 *                 example: 2
 *     responses:
 *       201:
 *         description: Product added to cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product added to cart
 *                 cart:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CartItem'
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
  [
    body("productId").isInt({ min: 1 }).withMessage("productId must be a positive integer"),
    body("quantity")
      .optional()
      .isInt({ min: 1 })
      .withMessage("quantity must be a positive integer")
      .toInt(),
  ],
  validate,
  addToCart
);

module.exports = router;
