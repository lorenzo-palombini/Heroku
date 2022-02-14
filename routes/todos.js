const express = require("express");
const router = express.Router();
const list = require("../controllers/listsController");
const todo = require("../controllers/todosController");

router
  // La lista di tutti i todos di un utente
  .get("/", async (req, res) => {
    try {
      let { q, completed } = req.query;
      // Lo passo al FE per condizionare i tasti del footer
      const tmpCompleted = completed;
      // Completed a db. è un integer
      if (completed !== "ALL" && completed !== undefined) {
        completed = completed * 1;
      }
      // I todos mostrati sono sono quelli per il quale l'utente è autorizzato
      const { id } = req.session.user;
      const lists = await list.getListByUserId(id);
      const todos = await todo.getTodos({ q, userId: id, completed });
      const result = todos.map((r) => r.dataValues);

      res.render("todos", {
        // In questo modo passiamo gli oggetti alla pagina todos.hbs del FE
        todos: result,
        showBackButton: false,
        user: req.session.user, // Per mostrare l'utente loggato sul FE
        lists,
        q,
        completed: tmpCompleted,
        // Nel parametro "message" faccio tornare il valore della variabile "success" in flash condizionando la pagina index.hbs per mostrarlo a video
        messages: req.flash("messages"),
        errors: req.flash("errors"),
      });
    } catch (e) {
      res.status(500).send(e.toString());
    }
  })
  // Creazione di un todo
  .post("/", async (req, res) => {
    try {
      const { listId } = req.body;
      const result = await todo.addTodo({ ...req.body });
      // Richiamando flash prima del redirect stiamo salvando nella variabile "success" il messaggio che verrà mostrato poi nella rotta "/"
      req.flash("messages", "Todo added!");
      const todoRoute = listId ? "/" + listId + "/todos" : "/todos";
      res.redirect(todoRoute);
    } catch (e) {
      // In caso di errore li salviamo nella variabile "errors" di flash prima del redirect alla rotta "/"
      req.flash(
        "errors",
        e.errors ? e.errors.map((ele) => ele.message) : e.toString()
      );
      res.redirect("/todos");
    }
  });

module.exports = router;
