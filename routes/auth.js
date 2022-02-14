const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

router
  // Form di creazione di un nuovo utente -> pagina login.hbs
  .get("/signup", async (req, res) => {
    res.render("login", {
      signup: true, // <- Abbiamo condizionato la pagina
    });
  })
  // Form per accedere all'applicazione -> pagina login.hbs
  .get("/login", async (req, res) => {
    res.render("login", {
      signup: false, // <- Abbiamo condizionato la pagina
    });
  })
  // Logout
  .get("/logout", async (req, res) => {
    // Distruggiamo la sessione prima di uscire e torniamo alla login
    req.session.destroy(() => {
      res.redirect("/auth/login");
    });
  })
  // Registrazione di un nuovo utente
  .post("/register", async (req, res) => {
    try {
      const { name, email, id } = await auth.register(req.body);
      const user = { name, email, id };
      // Una volta creato l'utente lo registro in sessione
      // Il valore user in req.session è del tutto arbitrario, può essere quel che vogliamo
      req.session.user = user;
      res.status(id ? 201 : 404).json(id ? user : null);
    } catch (e) {
      const errorMessages = e.errors.map((error) => error.message).join("\n");
      res.status(500).send({ message: errorMessages });
    }
  })
  // Login all'applicazione -> pagina login.hbs
  .post("/login", async (req, res) => {
    try {
      const { name, email, id } = await auth.login(req.body);
      const user = { name, email, id };
      // Una volta che l'utente si è loggato lo registro in sessione
      // Il valore user in req.session è del tutto arbitrario, può essere quel che vogliamo
      req.session.user = user;
      res.status(id ? 201 : 404).json(id ? user : null);
    } catch (e) {
      const errorMessages = e.message;
      res.status(500).send({ message: errorMessages });
    }
  });

module.exports = router;
