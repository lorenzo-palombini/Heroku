document.addEventListener("DOMContentLoaded", () => {
  // Rende opachi gli errori e li elimina dopo 4s
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((ele) => {
    ele.style.opacity = "0";
    setTimeout(() => {
      ele.parentNode.removeChild(ele);
    }, 4000);
  });

  // Lanciata in todos.hbs al click sul todo
  const ul = document.querySelector("#todos");
  if (ul) {
    ul.addEventListener("click", (evt) => {
      const eleId = evt.target.id;
      if (eleId.startsWith("i-")) {
        const id = eleId.replace("i-", "") * 1;
        const completed = evt.target.getAttribute("completed");
        completeTodo(id, completed);
      }
    });
  }
});

// Chiamata al BE per modificare il valore di completed da 0 a 1 o viceversa
async function completeTodo(id, completed) {
  try {
    console.log(completed);
    const res = await axios.patch("/api/todos/" + id, {
      completed,
    });
    Swal.fire({ type: "success", text: "Todo successfully updated" }).then(
      () => (location.href = "/todos")
    );
  } catch (e) {
    Swal.fire(e.response.data.message);
  }
}

// Lanciata in edit.hbs per eseguire lo switch del metodo http da eseguire
function updateList(btn) {
  debugger;
  const method = document.getElementById("method");
  const form = document.getElementById("list");
  method.value = btn.value === "DELETE" ? "DELETE" : "PATCH";
  method.value === "PATCH"
    ? form.submit()
    : showConfirmMsg(
        "Delete List",
        "Are you sure you want to delete this item?",
        form.name
      );
}

// Lanciata al click dei tasti per la cancellazione delle liste
async function showConfirmMsg(title = "", msg = "", formname) {
  const resp = await Swal.fire({
    title: title || "Are you sure?",
    text: msg || "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });
  if (resp.value) {
    if (document.forms[formname]) {
      document.forms[formname].submit();
    }
  }
}

// Lanciata in login.hbs al submit in fase di registrazione di un nuovo utente
async function registerUser(f) {
  try {
    const res = await axios.post("/auth/register", {
      name: f.name.value,
      email: f.email.value,
      password: f.password.value,
    });
    // In caso di esito positivo ridireziono alla home
    Swal.fire({ type: "success", text: "User successfully registred" }).then(
      () => (location.href = "/")
    );
  } catch (e) {
    Swal.fire(e.response.data.message);
  }
}

// Lanciata in login.hbs al submit in fase di login di un utente
async function loginUser(f) {
  try {
    const res = await axios.post("/auth/login", {
      email: f.email.value,
      password: f.password.value,
    });
    // In caso di esito positivo ridireziono alla home
    Swal.fire({ type: "success", text: "User successfully loggedin" }).then(
      () => (location.href = "/")
    );
  } catch (e) {
    Swal.fire(e.response.data.message);
  }
}

// Lanciata in newtodo.hbs per eseguire lo switch del metodo http da eseguire
function updateList(btn) {
  debugger;
  const method = document.getElementById("method");
  const form = document.getElementById("todo");
  method.value = btn.value === "DELETE" ? "DELETE" : "PATCH";
  method.value === "PATCH"
    ? form.submit()
    : showConfirmMsg(
        "Delete List",
        "Are you sure you want to delete this item?",
        form.name
      );
}
