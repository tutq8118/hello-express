const db = require('../db');
const shortid = require("shortid");
const transactions = db.get("transactions").value();
const books = db.get("books").value();
const users = db.get("users").value();

module.exports = {
  index: (request, response) => {
    response.render("transactions", {
      transactions,
      books,
      users
    });
  },
  create: (request, response) => {
    const userEmail = request.body.userEmail;
    const bookTitle = request.body.bookTitle;
    if (bookTitle !== null && bookTitle !== "" && userEmail !== null && userEmail !== "") {
      db.get("transactions")
        .push({
          id: shortid.generate(),
          bookTitle: bookTitle,
          userEmail: userEmail,
          isCompleted: false
        })
        .write();
    }
    response.redirect("back");
  },
  remove: (request, response) => {
    db.get("transactions")
      .remove({
        id: request.params.id
      })
      .write();
    response.redirect("back");
  },
  edit: (request, response) => {
    const id = request.params.id;
    const transaction = db
      .get("transactions")
      .find({ id: id })
      .value();
    response.render("transactions/edit", {
      transaction,
      books,
      users
    });
  },
  update: (request, response) => {
    const id = request.params.id;
    const newBookTitle = request.body.bookTitle;
    const newUserEmail = request.body.userEmail;
    db.get("transactions")
      .find({ id: id })
      .assign({ bookTitle: newBookTitle, userEmail: newUserEmail })
      .write();
    response.redirect("/transactions");
  },
  complete: (request, response) => {
    const id = request.params.id;
    
    const isCompleted = db.get("transactions").find({ id: id }).value() ? db.get("transactions").find({ id: id }).value().isCompleted : null;
    if (isCompleted === null) {
      response.redirect("/transactions");
    }
    else if (isCompleted === false) {
      db.get("transactions")
        .find({ id: id })
        .assign({isCompleted: true})
        .write();
        response.redirect("/transactions");
    }
    else {
      db.get("transactions")
        .find({ id: id })
        .assign({isCompleted: false})
        .write();
        response.redirect("/transactions");
    }
    
  }
}