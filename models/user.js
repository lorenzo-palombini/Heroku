"use strict";
const bcrypt = require("bcrypt");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Un utente ha tante liste assegnate -> count
      user.hasMany(models.lists);
    }
  }
  user.init(
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { args: true, msg: "Email already taken!" },
        // Invece di validare l'input sul FE lo controlliamo in fase di salvataggio sul BE
        validate: {
          notEmpty: { msg: "Email can't be empty" },
          isEmail: { msg: "Please add a valid Email" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        // Invece di validare l'input sul FE lo controlliamo in fase di salvataggio sul BE
        validate: {
          notEmpty: { msg: "Password can't be empty" },
          len: {
            args: [6, 255],
            msg: "Password length must be between 6 and 255",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "users",
      tableName: "users",
      // Gli hooks sono degli eventi che si scatenato in situazioni particolari
      // In questo caso prima di creare un nuovo user la password verrà criptata
      hooks: {
        beforeCreate(user) {
          user.password = bcrypt.hashSync(user.password, 12);
        },
      },
    }
  );
  return user;
};
