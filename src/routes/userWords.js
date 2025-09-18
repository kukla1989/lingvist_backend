const { Router } = require("express");
const UserWord = require("../models/userWord");
const Word = require("../models/words");
const { authMiddleware } = require("../utils/auth");
const asyncHandler = require("../utils/asyncHandler");

const router = Router();

router.get("/", authMiddleware, asyncHandler(async (req, res) => {
  const words = await UserWord.findAll({ where: { userId: req.userId }, include: [Word] });
  res.json(words);
}));

router.post("/add", authMiddleware, asyncHandler(async (req, res) => {
  const { wordId } = req.body;

  let record = await UserWord.findOne({ where: { userId: req.userId, wordId } });
  if (record) {
    record.count_repeat += 1;
    await record.save();
  } else {
    record = await UserWord.create({ userId: req.userId, wordId });
  }

  res.json(record);
}));

module.exports = router;
