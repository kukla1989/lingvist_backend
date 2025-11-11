const { Router } = require("express");
const UserWord = require("../models/userWord");
const Words = require("../models/Words");
const Word = require("../models/words");
const { authMiddleware } = require("../utils/auth");
const asyncHandler = require("../utils/asyncHandler");
const { translate, removeBraces } = require("../utils/dictionaryAPI");

const router = Router();

router.get("/", authMiddleware, asyncHandler(async (req, res) => {
  const words = await UserWord.findAll({ where: { userId: req.userId }, include: [Word] });
  res.json(words);
}));

router.post("/add", authMiddleware, asyncHandler(async (req, res) => {
  let { word, translation, definition, example } = req.body;
  let sentence = example;
  const { userId } = req;

  definition = removeBraces(definition);
  sentence = removeBraces(sentence);

  let position;
  if (sentence) {
    position = sentence.split(' ')
      .findIndex(sentenceWord => sentenceWord.toLowerCase().startsWith(word.toLowerCase()));
  }
  const word_place = position === -1 ? null : position;

  let existingWord

  if (!sentence) {
    existingWord = await Words.findOne({ where: { word, definition } })
  } else {
    existingWord = await Words.findOne({ where: { word, sentence } })
  }

  if (!existingWord) {
    const ukr_sentence = await translate(example);
    existingWord = await Words.create({
      word,
      translation,
      sentence,
      word_place,
      ukr_sentence,
      definition
    });
  }

  const alreadyLinked = await UserWord.findOne({
    where: { UserId: userId, WordId: existingWord.id },
  });

  if (alreadyLinked) {
    return res.json({ msg: "Word already linked" })
  }

  await UserWord.create({
    UserId: userId,
    WordId: existingWord.id,
    count_repeat: 5,
  })

  res.json({ success: true, msg: 'word successfully added' });
}));

module.exports = router;
