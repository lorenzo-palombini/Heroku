"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // I todos appartengono alle liste -> left outer join
      todo.belongsTo(models.lists);
    }
  }
  todo.init(
    {
      id: {
        type: DataTypes.BIGINT(12),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      todo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      completed: { type: DataTypes.BOOLEAN, allowNull: false },
      listId: {
        type: DataTypes.BIGINT(12),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "todos",
    }
  );
  return todo;
};
