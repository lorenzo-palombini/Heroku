// Poichè la PUT e la DELETE sono mediate da un form che non consente queste operazioni usiamo il modulo override per abilitarle
const methodOverride = require("method-override");
const overrideMethods = () => {
  return methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  });
};

// Configuriamo il cookie della sessione
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const fileStoreOptions = {};
const MAX_AGE = Number(process.env.MAX_AGE) || 60 * 60 * 1000;
const SECRET = process.env.SECRET || "Out secret value";
const DEFAULT_ENV = process.env.NODE_ENV || "development";

const setSession = () => {
  return session({
    // Salviamo la sessione su un file per evitare che ad ogni riavvio del server l'utente debba loggarsi nuovamente
    // Il file si trova sotto la cartella sessions
    store: new FileStore(fileStoreOptions),
    cookie: {
      maxAge: MAX_AGE,
      httpOnly: false, // Heroku -> Il cookie così può essere inviato anche da AJAX e non solo via http da JavaScript
      secure: false, // DEFAULT_ENV === "production", Heroku -> disabilitato perchè siamo su server di sviluppo di Heroku dove non abbiamo i certificati
    },
    secret: SECRET,
    // Resave fa si che vengano salvati i dati di sessione ad ogni richiesta
    resave: false,
    saveUninitialized: false,
  });
};

// Se un utente è già loggato verrà ridirezionato alla home
const redirectHome = (req, res, next) => {
  if (req.session.user && !req.path === "/auth/logout") {
    res.redirect("/");
  } else {
    next();
  }
};

// Se un utente non è loggato verrà ridirezionato alla login
const redirectLogin = (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

// Verifichiamo che un utente sia autorizzato a visualizzare la lista
const lists = require("../models").lists;
const userOwnsList = async function (req, res, next) {
  // list_id che viene dalla url della rotta
  const listId = req.params.list_id;
  if (!listId) {
    res.render("errors/400", { error: "No list id provided" });
    return;
  }
  const listObj = await lists.findByPk(listId);
  if (!listObj) {
    res.render("errors/404", { error: "No list found" });
    return;
  }
  if (listObj.userId !== req.session.user.id) {
    res.render("errors/403", { error: "You are not allowed to see this list" });
    return;
  }
  next();
};

module.exports = {
  overrideMethods,
  setSession,
  redirectHome,
  redirectLogin,
  userOwnsList,
};
