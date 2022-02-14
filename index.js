const express = require("express");
const app = express();
const { engine } = require("express-handlebars");

// Permettono di utilizzare altri operatori all'interno delle espressioni nelle {{...}}; nel nostro caso {{compare}}
const helpers = require("handlebars-helpers")(["comparison"]);
// Senza questo modulo non riuscivo ad usare gli helpers...
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const Handlebars = require("handlebars");
const insecureHandlebars = allowInsecurePrototypeAccess(Handlebars);

// Importiamo la cartella public che contiene gli scripts e css custom
app.use(express.static(__dirname + "/public"));

// Importiamo i middlewares
const {
  overrideMethods,
  setSession,
  redirectHome,
  redirectLogin,
} = require("./middlewares/index");

// Abbiamo installato SweetAlert2 per la gestione delle pop-up di cancellazione
// npm i sweetalert2
const Swal = require("sweetalert2");
// Ora dobbiamo servirlo come file statico
app.use(express.static(__dirname + "/node_modules/sweetalert2/dist"));

// In questo modo Express.js capisce che i file del template hanno estensione .hbs
// Il tipo di estensione è una scelta libera, ho usato .hbs perchè acronimo di handlebars
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    helpers, // <- Importiamo gli helpers
    handlebars: insecureHandlebars,
  })
);
// Handlebars di default si aspetta una cartella views -> layouts -> main.hbs
app.set("view engine", "hbs");
app.set("views", "./views");

// Necessari alla submit dei form per inviare i dati correttemente
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Per la gestione dei dati della sessione abbiamo installato:
// npm i connect-flash express-session
const flash = require("connect-flash");
app.use(setSession());
// Con flash trasmettiamo i dati tra una pagina e l'altra ed è sempre disponibile nella request
app.use(flash());

// Implementazione del modulo override
app.use(overrideMethods());

// Abbiamo installato localmente Bootstrap per il FE e lo serviamo come file statico:
app.use(express.static(__dirname + "/node_modules/bootstrap/dist"));

// Usiamo Axios per il FE e lo serviamo come file statico:
app.use(express.static(__dirname + "/node_modules/axios/dist"));

// API per la pagina di creazione utente
// Se supera il controllo del middleware allora accederà alle rotte
app.use("/auth", redirectHome, require("./routes/auth"));

// API delle liste
// Se supera il controllo del middleware allora accederà alle rotte
app.use(["/", "/lists"], redirectLogin, require("./routes/lists"));

// API dei todos
// Se supera il controllo del middleware allora accederà alle rotte
app.use("/todos", redirectLogin, require("./routes/todos"));

// API dell'applicazione -> non direttamente esposte al FE ma richiamabili per testare le singole funzionalità
app.use("/api/lists", require("./routes/api/lists"));
app.use("/api/todos", require("./routes/api/todos"));

// In questo modo Handlebars renderizzerà la pagina index
// Nella pagina main.hbs in corrispondenza del body andrà messa una variabile {{{body}}} per far capire al framework che li va immesso contenuto dinamico
// Questa era la prima versione, l'abbiamo sostituita con il render direttamente nelle rotte
// app.get(["/", "/lists"], (req, res) => {
//   res.render("index");
// });

app.listen(process.env.PORT || 4000, () => console.log("Listening"));
