"use strict";
const faker = require("@withshepherd/faker");
faker.setLocale("it");

module.exports = {
  up: (queryInterface, Sequelize) => {
    let listData = [];
    for (let i = 1; i <= 50; i++) {
      for (let j = 0; j < 10; j++) {
        listData.push({
          name: faker.lorem.sentence(),
          userId: i,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
    return queryInterface.bulkInsert("lists", listData, {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("lists", null, {});
  },
};
