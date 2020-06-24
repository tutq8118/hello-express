const db = require('../db');
const shortid = require("shortid");
// const users = db.get("users").value();
const User = require('../models/user.model');

module.exports = {
  index: async (request, response) => {
    const users = await User.find();
    console.log(users);
    response.render("users", {
      users
    });
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