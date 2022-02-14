const express = require("express");
const router = express.Router();
const list = require("../controllers/listsController");
const todo = require("../controllers/todosController");
const { userOwnsList } = require("../middlewares");

router
  // La lista delle liste
  .get(["/", "/lists"], async (req, res) => {
    try {
      const { q } = req.query;
      // Le liste mostrate sono sono quelle per le quali l'utente è autorizzato
      const { id } = req.session.user;
      const lists = await list.getLists({ q, userId: id });
      const result = lists.map((r) => r.dataValues);

      res.render("index", {
        // In questo modo passiamo gli oggetti alla pagina index.hbs del FE
        lists: result,
        showBackButton: false,
        user: req.session.user, // Per mostrare l'utente loggato sul FE
        // Nel parametro "messages" faccio tornare il valore della variabile "success" in flash condizionando la pagina index.hbs per mostrarlo a video
        messages: req.flash("messages"),
        errors: req.flash("errors"),
      });
    } catch (e) {
      // In caso di errore li salviamo nella variabile "errors" di flash prima del redirect alla rotta "/"
      req.flash(
        "errors",
        e.errors.map((ele) => ele.message)
      );
      res.redirect("/");
    }
  })
  // Navigazione verso la pagina dei todos associati alla lista
  .get(
    ["/:list_id([0-9]+)/todos", "/lists/:list_id([0-9]+)/todos"],
    userOwnsList,
    async (req, res) => {
      try {
        const listId = req.params.list_id;
        let completed = req.query.completed ? req.query.completed : 1;
        const listById = await list.getListById(listId);
        const todos = await todo.getTodosByListId(listId, completed);
        const user = req.session.user;
        const lists = await list.getListByUserId(user.id);
        const result = todos.map((r) => r.dataValues);

        res.render("todos", {
          // In questo modo passiamo gli oggetti alla pagina todos.hbs del FE
          todos: result,
          list_name: listById.name,
          user, // Per mostrare l'utente loggato sul FE
          listId,
          lists,
        });
      } catch (e) {
        // In caso di errore li salviamo nella variabile "errors" di flash prima del redirect alla rotta "/"
        req.flash(
          "errors",
          e.errors ? e.errors.map((ele) => ele.message) : e.toString()
        );
        res.redirect("/");
      }
    }
  )
  // Cancellazione di una lista
  .delete(
    ["/:list_id([0-9]+)", "/lists/:list_id([0-9]+)"],
    userOwnsList,
    async (req, res) => {
      try {
        const listId = req.params.list_id;
        const deleted = await list.deleteList(listId);
        req.flash("messages", "List deleted correctly!");
        res.redirect("/");
      } catch (e) {
        // In caso di errore li salviamo nella variabile "errors" di flash prima del redirect alla rotta "/"
        req.flash(
          "errors",
          e.errors.map((ele) => ele.message)
        );
        res.redirect("/");
      }
    }
  )
  // Navigazione verso la pagina di aggiornamento/cancellazione di una lista
  .get(
    ["/:list_id([0-9]+)/edit", "/lists/:list_id([0-9]+)/edit"],
    userOwnsList,
    async (req, res) => {
      try {
        const listId = req.params.list_id;
        const listObj = await list.getListById(listId);
        res.render("list/edit", {
          ...listObj.dataValues,
          // Per mostrare l'utente loggato sul FE
          user: req.session.user,
          errors: req.flash("errors"),
        });
      } catch (e) {
        // In caso di errore li salviamo nella variabile "errors" di flash prima del redirect alla rotta "/"
        req.flash(
          "errors",
          e.errors.map((ele) => ele.message)
        );
        res.redirect("/");
      }
    }
  )
  // Aggiornamento di una lista
  .patch(
    ["/:list_id([0-9]+)", "/lists/:list_id([0-9]+)"],
    userOwnsList,
    async (req, res) => {
      try {
        const listId = req.params.list_id;
        const updated = await list.updateList(listId, req.body.list_name);
        // Richiamando flash prima del redirect stiamo salvando nella variabile "success" il messaggio che verrà mostrato poi nella rotta "/"
        req.flash("messages", "List modified correctly!");
        res.redirect("/");
      } catch (e) {
        // In caso di errore li salviamo nella variabile "errors" di flash prima del redirect, in questo caso alla rotta di edit
        req.flash(
          "errors",
          e.errors.map((ele) => ele.message)
        );
        res.redirect("/" + req.params.list_id + "/edit");
      }
    }
  )
  // Creazione di una lista
  .post(["/", "/lists"], async (req, res) => {
    try {
      const result = await list.addList(
        req.body.list_name,
        // La lista viene salvata in base allo userId dell'utente
        req.session.user.id
      );
      // Richiamando flash prima del redirect stiamo salvando nella variabile "success" il messaggio che verrà mostrato poi nella rotta "/"
      req.flash("messages", "List added!");
      res.redirect("/");
    } catch (e) {
      // In caso di errore li salviamo nella variabile "errors" di flash prima del redirect alla rotta "/"
      req.flash(
        "errors",
        e.errors.map((ele) => ele.message)
      );
      res.redirect("/");
    }
  })
  // Navigazione verso la pagina di creazione di una lista
  .get(["/new", "/lists/new"], async (req, res) => {
    try {
      res.render("list/newlist", {
        showBackButton: true,
        // Per mostrare l'utente loggato sul FE
        user: req.session.user,
      });
    } catch (e) {
      // In caso di errore li salviamo nella variabile "errors" di flash prima del redirect alla rotta "/"
      req.flash(
        "errors",
        e.errors.map((ele) => ele.message)
      );
      res.redirect("/");
    }
  });

module.exports = router;
