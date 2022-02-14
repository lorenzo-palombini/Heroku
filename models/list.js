"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class list extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
// Una lista ha tanti todos -> count      
      list.hasMany(models.todos);
// Una lista appartiene a degli utenti -> left outer join      
      list.belongsTo(models.users);
    }
  }
  list.init(
    {
      id: {
        type: DataTypes.BIGINT(12),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        // Invece di validare l'input sul FE lo controlliamo in fase di salvataggio sul BE
        validate: {
          notEmpty: { msg: "Name can't be empty" },
          len: { args: [6, 255], msg: "Name length must be between 6 and 255" },
        },
      },
      userId: {
        type: DataTypes.BIGINT(12),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "lists",
    }
  );
  return list;
};
