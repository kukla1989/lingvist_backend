const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Word = require("./word");
const User = require("./user");

const UserWord = sequelize.define('UserWords', {
    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id"
      },
    },
    WordId: {
      type: DataTypes.INTEGER,
      references: {
        model: Word,
        key: "id",
      }
    },
    countRepeat: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
      field: "countRepeat"
    },
  },
);

module.exports = UserWord;
