const db = require('../db');
const shortid = require("shortid");
const books = db.get("books").value();

module.exports = {
  index: (request, response) => {
    response.render("books", {
      books
    });
  },
  create: (request, response) => {
    const title = request.body.title;
    const desc = request.body.desc;
    if (title !== null && title !== "") {
      db.get("books")
        .push({
          id: shortid.generate(),
          title: title,
          desc: desc
        })
        .write();
    }
    response.redirect("back");
  },
  remove: (request, response) => {
    db.get("books")
      .remove({
        id: request.params.id
      })
      .write();
    response.redirect("back");
  },
  edit: (request, response) => {
    const id = request.params.id;
    const book = db
      .get("books")
      .find({ id: id })
      .value();
    response.render("books/edit", {
      book
    });
  },
  update: (request, response) => {
    const id = request.params.id;
    const newTitle = request.body.title;
    const newDesc = request.body.desc;
    db.get("books")
      .find({ id: id })
      .assign({ title: newTitle, desc: newDesc })
      .write();
    response.redirect("/books");
  }
}