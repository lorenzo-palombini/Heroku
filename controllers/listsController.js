const lists = require("../models").lists;
const todos = require("../models").todos;
const Op = require("../models").Sequelize.Op;

const attributes = {
  include: [
    "id",
    "name",
    // Esegue una count sulla colonna
    [lists.sequelize.fn("COUNT", lists.sequelize.col("todos.id")), "total"],
  ],
  exlude: ["userId", "createdAt", "updatedAt"],
};

async function getLists(pars = {}) {
  // Where dinamica per le ricerche
  const where = {};
  if (pars.q) {
    where.name = { [Op.like]: "%" + pars.q + "%" };
  }
  if (pars.userId) {
    where.userId = pars.userId;
  }
  return await lists.findAll({
    attributes,
    subQuery: false,
    include: { model: todos, attributes: [] },
    group: ["lists.id"],
    order: [["createdAt", "DESC"]],
    where: where,
  });
}

async function getListByUserId(userId) {
  return await lists.findAll({
    attributes: { include: ["id", "name"] },
    where: { userId },
    order: [["name", "ASC"]],
  });
}

async function getListById(id) {
  return await lists.findByPk(id);
}

async function deleteList(id) {
  return await lists.destroy({ where: { id } });
}

async function addList(list_name, userId) {
  return await lists.create({ name: list_name, userId });
}

async function updateList(id, list_name) {
  return await lists.update({ name: list_name }, { where: { id } });
}

module.exports = {
  getLists,
  getListByUserId,
  getListById,
  deleteList,
  addList,
  updateList,
};
