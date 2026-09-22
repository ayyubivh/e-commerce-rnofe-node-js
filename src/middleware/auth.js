const { verifyToken } = require("../utils/jwt");
const { findById } = require("../models/User");

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing or malformed Authorization header. Expected: Bearer <token>" });
  }

  try {
    const payload = verifyToken(token);
    const user = findById(payload.id);
    if (!user) {
      return res.status(401).json({ error: "User for this token no longer exists" });
    }
    req.user = { id: user.id, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = requireAuth;
