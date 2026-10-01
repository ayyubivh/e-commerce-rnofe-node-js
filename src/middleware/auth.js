const { verifyToken } = require("../utils/jwt");
const { findById } = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const requireAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing or malformed Authorization header. Expected: Bearer <token>" });
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // Outside the try/catch on purpose: a database failure is a 500, not an "invalid token".
  const user = await findById(payload.id);
  if (!user) {
    return res.status(401).json({ error: "User for this token no longer exists" });
  }

  req.user = { id: user.id, email: user.email };
  next();
});

module.exports = requireAuth;
