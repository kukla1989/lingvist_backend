const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class Word extends Model {}

Word.init(
  {
    word: { type: DataTypes.STRING, allowNull: false },
    translation: { type: DataTypes.STRING, allowNull: false },
    sentence: { type: DataTypes.STRING, allowNull: false },
    word_place: { type: DataTypes.INTEGER, allowNull: false },
    ukr_sentence: { type: DataTypes.STRING, allowNull: false },
    ukr_word_place: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: "Word" }
);

module.exports = Word;
