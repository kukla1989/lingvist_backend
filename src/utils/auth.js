const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

const hashPassword = (password) => bcrypt.hash(password, 10);
const comparePassword = (password, hash) => bcrypt.compare(password, hash);
const generateToken = (userId) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });

// middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { hashPassword, comparePassword, generateToken, authMiddleware };
