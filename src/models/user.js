const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    is_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
    countwords_learned: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
);

module.exports = User;
