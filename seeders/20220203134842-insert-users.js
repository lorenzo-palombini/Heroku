"use strict";
const bcrypt = require("bcrypt");
const faker = require("@withshepherd/faker");
faker.setLocale("it");

module.exports = {
  up: (queryInterface, Sequelize) => {
    let userData = [];
    for (let i = 0; i < 50; i++) {
      userData.push({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: bcrypt.hashSync("users", 12),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert("users", userData, {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
