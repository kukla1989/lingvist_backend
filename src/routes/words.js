const { Router } = require("express");
const Word = require("../models/words");
const asyncHandler = require("../utils/asyncHandler");
const { fetchWordTranslation } = require("../utils/dictionaryAPI");


const router = Router();

router.get("/", asyncHandler(async (req, res) => {
  const words = await Word.findAll();
  res.json(words);
}));

router.post("/", asyncHandler(async (req, res) => {
  const { word, translation, sentence, word_place, ukr_sentence, ukr_word_place } = req.body;

  if (!word || !translation || !sentence || !ukr_sentence || word_place == null || ukr_word_place == null) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const newWord = await Word.create({ word, translation, sentence, word_place, ukr_sentence, ukr_word_place });
  res.status(201).json(newWord);
}));

router.post("/new", asyncHandler(async (req, res) => {
  console.log(fetchWordTranslation, 'fetchWordTranslation~~Q!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  const { word } = req.body;
  if (!word) return res.status(400).json({ error: "Word is required" });

  const wordInfo = await fetchWordTranslation(word);
  res.status(201).json(wordInfo);
}));

module.exports = router;
