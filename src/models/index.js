const User = require("./user");
const Word = require("./word");
const UserWord = require("./userWord");

User.belongsToMany(Word, { through: UserWord });
Word.belongsToMany(User, { through: UserWord });

module.exports = { User, Word, UserWord };
