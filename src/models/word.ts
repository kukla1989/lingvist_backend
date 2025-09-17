import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Word extends Model {
  public id!: number;
  public text!: string;
}

Word.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    translation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Word",
  }
);

export default Word;
