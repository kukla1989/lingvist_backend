const { Router } = require("express");
const User = require("../models/user");
const { hashPassword, comparePassword, generateToken } = require("../utils/auth");
const asyncHandler = require("../utils/asyncHandler");

const router = Router();

router.post("/register", asyncHandler(async (req, res) => {
  const { name, password } = req.body;
  const hashed = await hashPassword(password);
  const user = await User.create({ name, password: hashed });
  res.json({ message: "User registered", id: user.id });
}));

router.post("/login", asyncHandler(async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findOne({ where: { name } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await comparePassword(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = generateToken(user.id);
  res.json({ token });
}));

module.exports = router;
