const { Router } = require("express");
const { User, Word, UserWord } = require("../models/index.js");
const { authMiddleware } = require("../utils/auth");
const asyncHandler = require("../utils/asyncHandler");
const { translate, removeBraces } = require("../utils/dictionaryAPI");

const router = Router();

router.get("/", authMiddleware, asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const words = await user.getWords({
      joinTableAttributes: ["countRepeat"],
    });

    const wordsTransformed = words.map(({
                                          word,
                                          definition,
                                          translation,
                                          UserWords,
                                          sentence,
                                          word_place,
                                          ukr_sentence,
                                          updatedAt,
                                          id,
                                        }) => ({
      word,
      definition,
      translation,
      sentence,
      word_place,
      ukr_sentence,
      countRepeat: UserWords.countRepeat,
      lastDate: updatedAt,
      wordId: id,
    }))

    res.json(wordsTransformed);
  }
))
;

router.post("/add", authMiddleware, asyncHandler(async (req, res) => {
  try {
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
      existingWord = await Word.findOne({ where: { word, definition } })
    } else {
      existingWord = await Word.findOne({ where: { word, sentence } })
    }

    if (!existingWord) {
      const ukr_sentence = await translate(example);
      existingWord = await Word.create({
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
    console.log("ALREADY LINKED:", alreadyLinked);

    if (alreadyLinked) {
      return res.json({ msg: "Word already linked" })
    }

    const wordRecord = await Word.findByPk(existingWord.id);
    const user = await User.findByPk(userId);

    await user.addWord(wordRecord, {
      through: { countRepeat: 1 }
    });

    res.json({ success: true, msg: 'word successfully added' });
  } catch (e) {
    console.log("DB ERROR:", e.message);
    console.log("DETAIL:", e.parent?.detail);
    throw e;
  }
}));

router.patch(
  "/:wordId/repeat",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { wordId } = req.params;
    const { userId } = req;

    const userWord = await UserWord.findOne({
      where: {
        UserId: userId,
        WordId: wordId,
      },
    });

    if (!userWord) {
      return res.status(404).json({ error: "Word not found for this user" });
    }

    userWord.countRepeat += 1;
    await userWord.save();

    res.json({
      success: true,
      countRepeat: userWord.countRepeat,
    });
  })
);


router.delete("/:wordId", authMiddleware, asyncHandler(async (req, res) => {
  const { wordId } = req.params;
  const user = await User.findByPk(req.userId);
  const word = await Word.findByPk(wordId);

  const deleted = user.removeWord(word);

  if (deleted === 0) {
    return res.status(404).json({ error: "Word not found for this user" });
  }

  res.json({ success: true });
}));


module.exports = router;
