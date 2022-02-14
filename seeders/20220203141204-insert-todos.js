"use strict";
const faker = require("@withshepherd/faker");
faker.setLocale("it");

module.exports = {
  up: (queryInterface, Sequelize) => {
    let todoData = [];
    for (let i = 1; i <= 50; i++) {
      for (let j = 0; j < 10; j++) {
        todoData.push({
          todo: faker.lorem.sentence(),
          listId: i,
          completed: faker.random.arrayElement([0, 1]),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
    return queryInterface.bulkInsert("todos", todoData, {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("todos", null, {});
  },
};
