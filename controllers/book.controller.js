const db = require('../db');
const shortid = require("shortid");

module.exports = {
  index: (request, response) => {
    var page = request.query.page || 1;
    var perPage = 8;
    var start = (page - 1)*perPage;
    var end = page*perPage;
    const books = db.get("books").value().slice(start, end);
    const totalPage = Math.floor(db.get("books").value().length/perPage) + 1;
    response.render("books", {
      books,
      perPage,
      totalPage
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