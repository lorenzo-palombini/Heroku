const express = require("express");
const router = express.Router();
const {
  getTodos,
  getTodoById,
  deleteTodo,
  addTodo,
  updateTodo,
} = require("../../controllers/todosController");

router
  .get("/", async (req, res) => {
    try {
      const result = await getTodos();
      res.json(result);
    } catch (error) {
      res.status(500).json(error.toString());
    }
  })
  .get("/:id([0-9]+)", async (req, res) => {
    const result = await getTodoById(req.params.id);
    res.status(result ? 200 : 404).json(result ? result : "Record not found");
  })
  .delete("/:id([0-9]+)", async (req, res) => {
    const deleted = await deleteTodo(req.params.id);
    res
      .status(deleted ? 204 : 404)
      .json(deleted ? deleted : "Record not found");
  })
  .post("/", async (req, res) => {
    const result = await addTodo(req.body);
    res.status(result ? 201 : 400).json(result ? result : "Bad request");
  })
  .patch("/:id([0-9]+)", async (req, res) => {
    try {
      const id = req.params.id;
      const todo = await getTodoById(id);
      if (!todo) {
        res.send(404, { message: "Todo not found" });
        return;
      }
      // Se l'utente non è autorizzato a modificare questa risorsa
      if (+req.session.user.id !== todo.list.dataValues.userId) {
        res
          .status(403)
          .send({ message: "User is not authorized to modify this todo" });
        return;
      }
      console.log(req.body);
      const updTodo = await updateTodo(id, { ...todo.dataValues, ...req.body });
      res
        .status(updTodo[0] ? 202 : 404)
        .json(updTodo[0] ? updTodo[0] : "Record not found");
    } catch (e) {
      res.status(500).send(e.toString());
    }
  });

module.exports = router;
