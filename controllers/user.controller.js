const db = require('../db');
const shortid = require("shortid");
const users = db.get("users").value();

module.exports = {
  index: (request, response) => {
    response.render("users", {
      users
    });
  },
  create: (req, res) => {
    const name = req.body.name;
    if (name !== null && name !== "") {
      db.get("users")
        .push({
          id: shortid.generate(),
          name: name
        })
        .write();
      res.redirect("/users");
    }
  },
  remove: (request, response) => {
    db.get("users")
      .remove({
        id: request.params.id
      })
      .write();
    response.redirect("/users");
  },
  edit: (request, response) => {
    const id = request.params.id;
    const user = db
      .get("users")
      .find({ id: id })
      .value();
    response.render("users/edit", {
      user
    });
  },
  update: (request, response) => {
    const id = request.params.id;
    const newName = request.body.name;
    db.get("users")
      .find({ id: id })
      .assign({ name: newName})
      .write();
    response.redirect("/users");
  }
}