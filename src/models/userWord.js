const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
const Word = require("./words");

class UserWord extends Model {}

UserWord.init(
  {
    count_repeat: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { sequelize, modelName: "UserWord" }
);

// зв’язки
User.belongsToMany(Word, { through: UserWord });
Word.belongsToMany(User, { through: UserWord });

module.exports = UserWord;
