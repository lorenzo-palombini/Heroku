const todos = require("../models").todos;
const lists = require("../models").lists;
const attributes = ["id", "todo", "completed", "listId"];
const Op = require("../models").Sequelize.Op;

async function getTodos(pars = {}) {
  let where = {};
  let whereList = {};
  if (pars.q) {
    where.todo = { [Op.like]: "%" + pars.q + "%" };
  }
  if (typeof pars.completed === "number") {
    where.completed = pars.completed;
  }
  if (pars.userId) {
    whereList.userId = pars.userId;
  }
  return await todos.findAll({
    attributes,
    where,
    include: { model: lists, where: whereList },
  });
}

async function getTodoById(id) {
  return await todos.findByPk(id, {
    attributes: attributes,
    // Includo il modello per la left outer join
    include: lists,
  });
}

async function getTodosByListId(listId, completed = null) {
  const where = { listId };
  if (completed !== null) {
    where.completed = completed;
  }
  return await todos.findAll({
    attributes: attributes,
    // Includo il modello per la left outer join
    include: lists,
    where,
  });
}

async function deleteTodo(id) {
  return await todos.destroy({ where: { id } });
}

async function addTodo({ todo, completed, listId }) {
  if (completed === undefined) {
    completed = 1;
  }
  return await todos.create({ todo, completed, listId });
}

async function updateTodo(id, { todo, completed, listId }) {
  let updCompleted;
  if (completed === "true") {
    updCompleted = 0;
  } else {
    updCompleted = 1;
  }
  console.log(updCompleted);
  return await todos.update(
    { todo, completed: updCompleted, listId },
    { where: { id } }
  );
}

module.exports = {
  getTodos,
  getTodoById,
  getTodosByListId,
  deleteTodo,
  addTodo,
  updateTodo,
};
