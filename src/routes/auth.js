const { Op } = require("sequelize");  // ✅ import operators

const { Router } = require("express");
const User = require("../models/user");
const { hashPassword, comparePassword, generateToken } = require("../utils/auth");
const asyncHandler = require("../utils/asyncHandler");

const router = Router();

router.post("/register", asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const isNameTaken = await User.findOne({ where: { name } })
  if (isNameTaken !== null) {
    return res.status(400).json({ error: "Name is taken" });
  }

  const isEmailTaken = await User.findOne({ where: { email } })
  if (isEmailTaken !== null) {
    return res.status(400).json({ error: "Email is taken" });
  }

  const hashed = await hashPassword(password);
  const user = await User.create({ name, email, password: hashed });
  res.json({ message: "User registered", id: user.id });
}));

router.post("/login", asyncHandler(async (req, res) => {
  const { namEmail, password } = req.body;
  const user = await User.findOne({
    where: {
      [Op.or]: [
        { name: namEmail },
        { email: namEmail }
      ]
    }
  });

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await comparePassword(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = generateToken(user.id);
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email }
  });
}));

module.exports = router;
