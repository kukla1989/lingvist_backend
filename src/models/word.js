const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Word = sequelize.define('Word', {
    word: { type: DataTypes.STRING, allowNull: false },
    translation: { type: DataTypes.STRING, allowNull: false },
    sentence: { type: DataTypes.STRING, allowNull: true },
    word_place: { type: DataTypes.INTEGER, allowNull: true },
    ukr_sentence: { type: DataTypes.STRING, allowNull: true },
    definition: { type: DataTypes.STRING, allowNull: false },
  },
);

module.exports = Word;
