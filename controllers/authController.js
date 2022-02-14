const users = require("../models").users;
const bcrypt = require("bcrypt");

async function register({ name, email, password }) {
  // Salvo sul db. il nuovo utente se supera le validazioni del modello
  return users.create({ name, email, password });
}

async function login({ email, password }) {
  const user = await users.findOne({ where: { email } });
  // Verifico che sia presenta a db.
  if (!user) {
    throw new Error("User not found by email");
  } else {
    // Compara password non criptata del FE con quella criptata nel db.
    if (!bcrypt.compareSync(password, user.password)) {
      throw new Error("Password doesn't match");
    }
    return user;
  }
}

module.exports = { register, login };
