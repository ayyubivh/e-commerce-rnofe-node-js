const bcrypt = require("bcryptjs");
const { findByEmail, createUser, toPublicUser } = require("../models/User");
const { signToken } = require("../utils/jwt");
const asyncHandler = require("../utils/asyncHandler");

const SALT_ROUNDS = 10;

const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // createUser returns null when the email is taken (enforced by the UNIQUE constraint in the database).
  const user = await createUser({ email, passwordHash });
  if (!user) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }

  const token = signToken({ id: user.id, email: user.email });
  res.status(201).json({ user: await toPublicUser(user), token });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await findByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = signToken({ id: user.id, email: user.email });
  res.status(200).json({ user: await toPublicUser(user), token });
});

module.exports = { register, login };
