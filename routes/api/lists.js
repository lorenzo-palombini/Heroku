const express = require("express");
const router = express.Router();
const {
  getLists,
  getListById,
  deleteList,
  addList,
  updateList,
} = require("../../controllers/listsController");

const { getTodosByListId } = require("../../controllers/todosController");

router
  .get("/", async (req, res) => {
    try {
      const result = await getLists();
      res.json(result);
    } catch (error) {
      res.status(500).json(error.toString());
    }
  })
  .get("/:id([0-9]+)", async (req, res) => {
    const result = await getListById(req.params.id);
    res.status(result ? 200 : 404).json(result ? result : "Record not found");
  })
  .get("/:list_id([0-9]+)/todos", async (req, res) => {
    const result = await getTodosByListId(req.params.list_id);
    res.status(result ? 200 : 404).json(result ? result : "Record not found");
  })
  .delete("/:id([0-9]+)", async (req, res) => {
    const deleted = await deleteList(req.params.id);
    res
      .status(deleted ? 204 : 404)
      .json(deleted ? deleted : "Record not found");
  })
  .post("/", async (req, res) => {
    const result = await addList(req.body);
    res.status(result ? 201 : 400).json(result ? result : "Bad request");
  })
  .patch("/:id([0-9]+)", async (req, res) => {
    const updList = await updateList(req.params.id, req.body);
    res
      .status(updList[0] ? 202 : 404)
      .json(updList[0] ? updList[0] : "Record not found");
  });

module.exports = router;
